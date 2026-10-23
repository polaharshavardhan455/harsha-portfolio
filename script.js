/* ============================================================
   SCRIPT.JS — Pola Harsha Portfolio (PCB · Design Verification)
   ============================================================

   TABLE OF CONTENTS
   -----------------
   1.  Theme — Solder Mask Toggle & Colours
   2.  PCB Background — Board Layout + Signal Pulses
   3.  Scroll Progress Bar (VCC)
   4.  Navigation — Active Link
   5.  Typewriter Effect
   6.  Scroll Reveal (Intersection Observer)
   7.  3D Card Tilt
   8.  Chip Anatomy — Exploded 3D View
   9.  Verification — Testbench Simulation
   10. Verification — Mini Bug Hunt
   11. Probe Readout (cursor coordinates)

   HOW TO EDIT
   -----------
   • Search for the number + title, e.g.  "2. PCB BACKGROUND"
   • Values you are likely to change are tagged  // ← EDIT
   • No libraries, no API calls, no network requests.
     Everything runs offline.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {


    /* ============================================================
       1. THEME — Solder Mask Toggle & Colours
       Reads the CSS colour variables so the canvas always matches
       the page. The MASK button swaps green board ↔ white board.
       ============================================================ */

    const root   = document.documentElement;
    const colors = {};                      // shared with section 2
    let onThemeChange = function () {};     // section 2 plugs its redraw in here

    function currentTheme() {
        return root.dataset.theme ||
            (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    }

    function readColors() {
        const s = getComputedStyle(root);
        colors.trace = s.getPropertyValue('--trace').trim();
        colors.silk  = s.getPropertyValue('--silk').trim();
        colors.pulse = s.getPropertyValue('--led').trim();
        document.getElementById('mask').textContent =
            'MASK: ' + (currentTheme() === 'light' ? 'WHITE' : 'GREEN');
    }

    document.getElementById('mask').addEventListener('click', function () {
        root.dataset.theme = currentTheme() === 'light' ? 'dark' : 'light';
        readColors();
        onThemeChange();
    });

    readColors();


    /* ============================================================
       2. PCB BACKGROUND — Board Layout + Signal Pulses
       Draws a fake PCB: ICs with pins, resistors / capacitors,
       45° routed traces, buses, vias, mounting holes, copper pour.
       The board is painted ONCE on a hidden canvas; each frame
       only the small green signal lights are drawn on top.
       ============================================================ */

    (function () {

        const canvas = document.getElementById('bg');
        const ctx    = canvas.getContext('2d');
        const board  = document.createElement('canvas');   // static layout lives here
        const bctx   = board.getContext('2d');
        const still  = matchMedia('(prefers-reduced-motion: reduce)').matches;

        const CELL        = 190;         // ← EDIT  part grid size (bigger = fewer parts)
        const CHAMFER     = 12;          // ← EDIT  45° corner size on traces
        const PULSE_SHARE = 0.35;        // ← EDIT  share of traces carrying a light (0 – 1)
        const PULSE_SPEED = [10, 25];    // ← EDIT  min / max light speed (px per second)
        const TAIL        = 6;           // ← EDIT  length of the light's tail
        const NAMES       = ['FPGA', 'MCU', 'ADC', 'SRAM', 'CPLD', 'PLL', 'LDO'];
        const MONO        = 'ui-monospace, Menlo, Consolas, monospace';

        let W = 0, H = 0, dpr = 1;
        let parts = [], routes = [], nets = [];

        const dist = function (a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); };


        // ── Seeded random (layout is identical on every load) ─────

        function seeded(a) {
            return function () {
                a |= 0; a = a + 0x6D2B79F5 | 0;
                let t = Math.imul(a ^ a >>> 15, 1 | a);
                t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
                return ((t ^ t >>> 14) >>> 0) / 4294967296;
            };
        }


        // ── Part footprints ───────────────────────────────────────
        // pin = { x, y, dx, dy } → pad centre + direction the trace leaves in

        function makeQFP(x, y) {
            const s = 64, n = 6, pitch = 9, o = (s - (n - 1) * pitch) / 2, pins = [];
            for (let i = 0; i < n; i++) {
                const t = o + i * pitch;
                pins.push({ x: x - 5,     y: y + t,     dx: -1, dy:  0 });
                pins.push({ x: x + s + 5, y: y + t,     dx:  1, dy:  0 });
                pins.push({ x: x + t,     y: y - 5,     dx:  0, dy: -1 });
                pins.push({ x: x + t,     y: y + s + 5, dx:  0, dy:  1 });
            }
            return { kind: 'ic', x: x, y: y, w: s, h: s, pins: pins };
        }

        function makeSOIC(x, y) {
            const w = 36, h = 52, n = 4, pitch = 12, o = (h - (n - 1) * pitch) / 2, pins = [];
            for (let i = 0; i < n; i++) {
                pins.push({ x: x - 5,     y: y + o + i * pitch, dx: -1, dy: 0 });
                pins.push({ x: x + w + 5, y: y + o + i * pitch, dx:  1, dy: 0 });
            }
            return { kind: 'ic', x: x, y: y, w: w, h: h, pins: pins };
        }

        function makePassive(x, y) {
            return { kind: 'pas', x: x, y: y, w: 26, h: 10, pins: [
                { x: x - 5,  y: y + 5, dx: -1, dy: 0 },
                { x: x + 31, y: y + 5, dx:  1, dy: 0 }
            ] };
        }


        // ── Place parts on a loose grid ───────────────────────────

        function layout() {
            const R = seeded(11), list = [];
            for (let gy = 0; gy * CELL < H; gy++) {
                for (let gx = 0; gx * CELL < W; gx++) {
                    const x = gx * CELL + 40 + R() * 40;
                    const y = gy * CELL + 40 + R() * 40;
                    const k = R();
                    if      (k < 0.34) list.push(makeQFP(x, y));
                    else if (k < 0.58) list.push(makeSOIC(x, y));
                    else if (k < 0.85) { for (let i = 0; i < 3; i++) list.push(makePassive(x, y + i * 24)); }
                }
            }
            let u = 0, n = 0;                         // reference designators U1.. R1.. C2..
            list.forEach(function (p) {
                if (p.kind === 'ic') { p.ref = 'U' + (++u); p.name = NAMES[u % NAMES.length]; }
                else                 { p.ref = (n++ % 2 ? 'C' : 'R') + n; }
            });
            return list;
        }


        // ── Trace routing (stub out of the pad, then 45° corners) ─

        function chamfer(p) {
            const out = [p[0]];
            for (let i = 1; i < p.length - 1; i++) {
                const l1 = dist(p[i - 1], p[i]), l2 = dist(p[i], p[i + 1]);
                const c  = Math.min(CHAMFER, l1 / 2, l2 / 2);
                if (c < 1) { out.push(p[i]); continue; }
                out.push([p[i][0] + (p[i - 1][0] - p[i][0]) / l1 * c, p[i][1] + (p[i - 1][1] - p[i][1]) / l1 * c]);
                out.push([p[i][0] + (p[i + 1][0] - p[i][0]) / l2 * c, p[i][1] + (p[i + 1][1] - p[i][1]) / l2 * c]);
            }
            out.push(p[p.length - 1]);
            return out;
        }

        function route(a, b, k) {
            const s = [a.x + a.dx * 12, a.y + a.dy * 12];
            const e = [b.x + b.dx * 12, b.y + b.dy * 12];
            let mid;
            if (a.dx && b.dx) { const mx = (s[0] + e[0]) / 2 + k * 5; mid = [[mx, s[1]], [mx, e[1]]]; }
            else              { mid = [[e[0], s[1]]]; }
            return chamfer([[a.x, a.y], s].concat(mid, [e, [b.x, b.y]]));
        }

        function buildRoutes() {
            const ics = parts.filter(function (p) { return p.kind === 'ic'; });
            const out = [];

            // buses: every IC → the next IC on its right, pin to pin
            ics.forEach(function (A) {
                let best = null;
                ics.forEach(function (B) {
                    const dx = B.x - (A.x + A.w), dy = Math.abs(B.y - A.y);
                    if (dx > 40 && dx < CELL * 1.3 && dy < CELL * 0.5 && (!best || dx < best.dx)) best = { B: B, dx: dx };
                });
                if (!best) return;
                const o = A.pins.filter(function (p) { return p.dx === 1; });
                const i = best.B.pins.filter(function (p) { return p.dx === -1; });
                for (let k = 0; k < Math.min(o.length, i.length, 5); k++) out.push(route(o[k], i[k], k - 2));
            });

            // passives: right pin → nearest IC pin
            parts.forEach(function (p) {
                if (p.kind !== 'pas') return;
                let near = null, best = 1e9;
                ics.forEach(function (I) {
                    I.pins.forEach(function (q) {
                        const d = dist([p.pins[1].x, p.pins[1].y], [q.x, q.y]);
                        if (d < best) { best = d; near = q; }
                    });
                });
                if (near && best < CELL * 1.2) out.push(route(p.pins[1], near, 0));
            });
            return out;
        }


        // ── Paint the static board (runs on load, resize, theme) ──

        function paint() {
            bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            bctx.clearRect(0, 0, W, H);
            bctx.lineJoin = 'round';

            // copper pour (hatched ground plane, bottom-right corner)
            bctx.save();
            bctx.beginPath(); bctx.rect(W - 230, H - 130, 200, 100); bctx.clip();
            bctx.strokeStyle = colors.trace; bctx.lineWidth = 1;
            for (let i = -100; i < 300; i += 7) { bctx.beginPath(); bctx.moveTo(W - 230 + i, H - 30); bctx.lineTo(W - 230 + i + 100, H - 130); bctx.stroke(); }
            bctx.restore();

            // traces + vias
            bctx.strokeStyle = colors.trace; bctx.lineWidth = 1.6;
            routes.forEach(function (r, n) {
                bctx.beginPath();
                r.forEach(function (q, i) { i ? bctx.lineTo(q[0], q[1]) : bctx.moveTo(q[0], q[1]); });
                bctx.stroke();
                if (n % 3 === 0 && r.length > 3) {
                    bctx.beginPath(); bctx.arc(r[2][0], r[2][1], 3.5, 0, 7); bctx.stroke();
                }
            });

            // parts: body outline, pads, pin-1 dot, reference text
            parts.forEach(function (p) {
                bctx.strokeStyle = colors.silk; bctx.lineWidth = 1;
                bctx.strokeRect(p.x, p.y, p.w, p.h);
                bctx.fillStyle = colors.trace;
                p.pins.forEach(function (q) {
                    bctx.fillRect(q.x - (q.dx ? 4 : 2), q.y - (q.dx ? 2 : 4), q.dx ? 8 : 4, q.dx ? 4 : 8);
                });
                bctx.fillStyle = colors.silk;
                bctx.font = (p.kind === 'ic' ? 10 : 8) + 'px ' + MONO;
                bctx.fillText(p.ref, p.x, p.y - 6);
                if (p.kind === 'ic') {
                    bctx.beginPath(); bctx.arc(p.x + 7, p.y + 7, 2.5, 0, 7); bctx.stroke();
                    bctx.font = '9px ' + MONO;
                    bctx.fillText(p.name, p.x + p.w / 2 - 12, p.y + p.h / 2 + 3);
                }
            });

            // board outline, mounting holes, label
            bctx.strokeStyle = colors.silk; bctx.lineWidth = 1;
            bctx.setLineDash([7, 5]); bctx.strokeRect(12, 12, W - 24, H - 24); bctx.setLineDash([]);
            [[34, 34], [W - 34, 34], [34, H - 34], [W - 34, H - 34]].forEach(function (c) {
                bctx.beginPath(); bctx.arc(c[0], c[1], 7, 0, 7); bctx.stroke();
                bctx.beginPath(); bctx.arc(c[0], c[1], 13, 0, 7); bctx.stroke();
            });
            bctx.fillStyle = colors.silk; bctx.font = '10px ' + MONO;
            bctx.fillText('PORTFOLIO-REV1 · 2L · 1.6mm · ENIG', 56, H - 22);
            bctx.fillText('GND', W - 150, H - 80);
        }


        // ── Signal pulses (the only thing animated) ───────────────

        function buildNets() {
            nets = routes.map(function (pts) {
                let L = 0;
                for (let i = 1; i < pts.length; i++) L += dist(pts[i - 1], pts[i]);
                return {
                    pts: pts, L: L,
                    s: Math.random() * L,
                    v: PULSE_SPEED[0] + Math.random() * (PULSE_SPEED[1] - PULSE_SPEED[0]),
                    on: Math.random() < PULSE_SHARE
                };
            });
        }

        function at(pts, s) {
            for (let i = 1; i < pts.length; i++) {
                const l = dist(pts[i - 1], pts[i]);
                if (s <= l) { const t = l ? s / l : 0; return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t]; }
                s -= l;
            }
            return pts[pts.length - 1];
        }

        let last = 0;
        function frame(ts) {
            const dt = Math.min(0.05, (ts - last) / 1000 || 0);
            last = ts;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, W, H);
            ctx.drawImage(board, 0, 0, W, H);

            nets.forEach(function (n) {
                if (!n.on) return;
                if (!still) { n.s += n.v * dt; if (n.s > n.L + 60) n.s = -60; }
                for (let j = 0; j < TAIL; j++) {
                    const s = n.s - j * 7;
                    if (s < 0 || s > n.L) continue;
                    const q = at(n.pts, s);
                    ctx.globalAlpha = (1 - j / TAIL) * 0.75;
                    ctx.fillStyle = colors.pulse; ctx.shadowColor = colors.pulse;
                    ctx.shadowBlur = j ? 0 : 12;
                    ctx.beginPath(); ctx.arc(q[0], q[1], j ? 2 : 3, 0, 7); ctx.fill();
                }
                ctx.globalAlpha = 1; ctx.shadowBlur = 0;
            });
            if (!still) requestAnimationFrame(frame);
        }


        // ── Setup + resize ────────────────────────────────────────

        function resize() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            W = window.innerWidth; H = window.innerHeight;
            canvas.width = board.width = W * dpr;
            canvas.height = board.height = H * dpr;
            parts = layout(); routes = buildRoutes(); buildNets(); paint();
            if (still) frame(0);
        }

        onThemeChange = function () { paint(); if (still) frame(0); };
        window.addEventListener('resize', resize);
        resize();
        if (!still) requestAnimationFrame(frame);

    }());


    /* ============================================================
       3. SCROLL PROGRESS BAR (VCC)
       The green bar at the top fills as you scroll down
       ============================================================ */

    const vcc = document.getElementById('vcc');

    window.addEventListener('scroll', function () {
        const h = root.scrollHeight - window.innerHeight;
        vcc.style.width = (h > 0 ? window.scrollY / h * 100 : 0) + '%';
    }, { passive: true });


    /* ============================================================
       4. NAVIGATION — Active Link
       Highlights the nav item of the section in the middle of
       the screen
       ============================================================ */

    const navLinks = document.querySelectorAll('#menu a');

    const navObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            navLinks.forEach(function (a) {
                a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id);
            });
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    document.querySelectorAll('main section[id]').forEach(function (s) { navObserver.observe(s); });


    /* ============================================================
       5. TYPEWRITER EFFECT
       Hero tagline types, pauses, deletes, then the next line
       ============================================================ */

    (function () {

        const lines = [                                     // ← EDIT  your taglines
            'Aspiring Design Verification Engineer.',
            'If it isn’t verified, it’s broken.',
            'Hardware meets AI.',
            'Learning how circuits think.',
            'Curious by nature.'
        ];
        const el = document.getElementById('tw');
        let li = 0, ci = 0, deleting = false;

        (function tick() {
            const text = lines[li];
            el.textContent = text.slice(0, ci);

            if (!deleting && ci === text.length) { deleting = true; return setTimeout(tick, 1600); }
            if (deleting && ci === 0)            { deleting = false; li = (li + 1) % lines.length; }

            ci += deleting ? -1 : 1;
            setTimeout(tick, deleting ? 30 : 70);
        }());

    }());


    /* ============================================================
       6. SCROLL REVEAL (Intersection Observer)
       Sections fade + slide up the first time they appear
       ============================================================ */

    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (e.isIntersecting) e.target.classList.add('in');
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.rv').forEach(function (el) { revealObserver.observe(el); });


    /* ============================================================
       7. 3D CARD TILT
       Cards lean towards the mouse. CSS reads --rx / --ry.
       ============================================================ */

    (function () {

        if (matchMedia('(hover: none)').matches) return;     // skip on touch screens
        const TILT = 6;                                      // ← EDIT  degrees of tilt

        document.querySelectorAll('.card').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width - 0.5;
                const y = (e.clientY - r.top)  / r.height - 0.5;
                card.style.setProperty('--ry', (x * TILT) + 'deg');
                card.style.setProperty('--rx', (-y * TILT) + 'deg');
            });
            card.addEventListener('mouseleave', function () {
                card.style.setProperty('--ry', '0deg');
                card.style.setProperty('--rx', '0deg');
            });
        });

    }());


    /* ============================================================
       8. CHIP ANATOMY — Exploded 3D View
       The slider spreads the layers apart (CSS variable --gap).
       Hover / tap a layer or button to read what it does.
       ============================================================ */

    (function () {

        const chip   = document.getElementById('chip');
        const slider = document.getElementById('explode');
        const desc   = document.getElementById('chipdesc');
        const layers = chip.querySelectorAll('.lyr');
        const btns   = document.querySelectorAll('.lbtn');

        const INFO = [                                       // ← EDIT  layer descriptions
            'Silicon: billions of transistors are etched here. This is where logic gates are born.',
            'Metal 1: the tiniest wires. They connect transistors into gates and flip-flops.',
            'Metal 2: medium wires that carry signals between blocks.',
            'Metal 3: thick wires that distribute power and the clock across the chip.',
            'Package: the black shell and pins that protect the die and connect it to the PCB.'
        ];

        function pick(i) {
            layers.forEach(function (l) { l.classList.toggle('on', +l.dataset.i === i); });
            btns.forEach(function (b)   { b.classList.toggle('on', +b.dataset.i === i); });
            desc.textContent = INFO[i];
        }

        slider.addEventListener('input', function () {
            chip.style.setProperty('--gap', (slider.value * 0.9) + 'px');
        });
        chip.style.setProperty('--gap', (slider.value * 0.9) + 'px');

        layers.forEach(function (l) { l.addEventListener('mouseenter', function () { pick(+l.dataset.i); }); });
        btns.forEach(function (b) {
            b.addEventListener('mouseenter', function () { pick(+b.dataset.i); });
            b.addEventListener('click',      function () { pick(+b.dataset.i); });
        });

    }());


    /* ============================================================
       9. VERIFICATION — Testbench Simulation
       Fake UVM-style run: random transactions go through
       Sequencer → Driver → DUT → Monitor → Scoreboard.
       Tick "Inject a bug" and the scoreboard catches it.
       ============================================================ */

    (function () {

        const $      = function (id) { return document.getElementById(id); };
        const blocks = document.querySelectorAll('#tb .blk');
        const log    = $('log');
        const TXNS   = 8;                                    // ← EDIT  transactions per run
        let busy = false;

        function line(text, cls) {
            const d = document.createElement('div');
            d.textContent = text;
            if (cls) d.className = cls;
            log.appendChild(d);
            log.scrollTop = log.scrollHeight;
        }

        $('run').addEventListener('click', function () {
            if (busy) return;
            busy = true;
            log.textContent = '';

            const bug = $('bug').checked;
            let n = 0, pass = 0, fail = 0;

            $('res').textContent = 'RUNNING';
            $('res').style.color = 'var(--cu2)';
            $('cov').style.width = '0';
            $('sb').textContent  = '0 pass · 0 fail';
            line('UVM_INFO @ 0ns: reset released, DUT = 4-bit adder' + (bug ? ' (bug injected)' : ''));

            (function step() {

                // ── end of run: print the report ──
                if (n === TXNS) {
                    const ok = fail === 0;
                    line('UVM_REPORT: ' + (ok ? 'TEST PASSED' : 'TEST FAILED') + ' · ' + fail + ' error(s) · coverage 100%', ok ? 'ok' : 'err');
                    $('res').textContent = ok ? 'PASS' : 'FAIL';
                    $('res').style.color = ok ? 'var(--led)' : '#ff7a7a';
                    busy = false;
                    return;
                }

                // ── one random transaction ──
                n++;
                const a   = Math.floor(Math.random() * 16);
                const b   = Math.floor(Math.random() * 16);
                const exp = (a + b) & 15;                        // reference model
                const got = (bug && n === 5) ? exp ^ 4 : exp;    // DUT output (bug on txn 5)

                blocks.forEach(function (el, k) {                // light up the block diagram
                    setTimeout(function () { el.classList.add('hot'); },    k * 70);
                    setTimeout(function () { el.classList.remove('hot'); }, k * 70 + 260);
                });

                setTimeout(function () {                         // scoreboard compares
                    if (got === exp) { pass++; line('UVM_INFO  @ ' + n * 10 + 'ns: txn ' + n + '  a=' + a + ' b=' + b + ' → sum=' + got + '  MATCH'); }
                    else             { fail++; line('UVM_ERROR @ ' + n * 10 + 'ns: txn ' + n + '  a=' + a + ' b=' + b + ' expected ' + exp + ' got ' + got + '  MISMATCH', 'err'); }
                    $('sb').textContent  = pass + ' pass · ' + fail + ' fail';
                    $('cov').style.width = (n / TXNS * 100) + '%';
                }, 380);

                setTimeout(step, 560);
            }());
        });

    }());


    /* ============================================================
       10. VERIFICATION — Mini Bug Hunt
       Visitor clicks the buggy line of Verilog
       (button with data-b="1" in index.html is the bug)
       ============================================================ */

    (function () {

        const lines = document.querySelectorAll('#code button');
        const msg   = document.getElementById('bugmsg');

        lines.forEach(function (btn) {
            btn.addEventListener('click', function () {
                lines.forEach(function (x) { x.classList.remove('hit', 'miss'); });
                const hit = btn.dataset.b === '1';
                btn.classList.add(hit ? 'hit' : 'miss');
                msg.style.color = hit ? 'var(--led)' : '#ff7a7a';
                msg.textContent = hit
                    ? 'Bug found: reset loads 1 instead of 0. A testbench flags this on the very first check.'
                    : 'Not this line. Re-read the spec and check the reset value.';
            });
        });

    }());


    /* ============================================================
       11. PROBE READOUT (cursor coordinates)
       Bottom-right label shows the mouse position like a
       probe on a PCB (converted to millimetres)
       ============================================================ */

    const probe = document.getElementById('probe');

    window.addEventListener('mousemove', function (e) {
        probe.textContent = 'PROBE X ' + (e.clientX * 0.2645).toFixed(1) + ' Y ' + (e.clientY * 0.2645).toFixed(1) + ' mm';
    }, { passive: true });

});