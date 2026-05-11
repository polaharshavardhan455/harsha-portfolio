/* ============================================================
   SCRIPT.JS — Pola Harsha Portfolio
   ============================================================

   TABLE OF CONTENTS
   -----------------
   1.  Cosmic Background — Stars, Embers, Shooting Stars
   2.  Intro Overlay Animation
   3.  Scroll Progress Bar
   4.  Navigation — Active Link & Header Scroll Style
   5.  Typewriter Effect
   6.  Skill Modal
   7.  3D Card Tilt (Project Cards)
   8.  Scroll Reveal (Intersection Observer)
   9.  Back To Top Button
   10. Beyond Tech — Toggle Story
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {


    /* ============================================================
       1. COSMIC BACKGROUND — Stars, Embers, Shooting Stars
       ============================================================ */

    (function () {

        // ── Static stars (three parallax layers) ──────────────────

        const layers = [
            { id: 'stars-far',  count: 180, minSize: 0.5, maxSize: 1.2, opacity: 0.35, drift: 18 },
            { id: 'stars-mid',  count: 100, minSize: 0.8, maxSize: 1.6, opacity: 0.55, drift: 28 },
            { id: 'stars-near', count:  55, minSize: 1.2, maxSize: 2.5, opacity: 0.80, drift: 42 }
        ];

        layers.forEach(function (layer) {
            const container = document.getElementById(layer.id);
            if (!container) return;

            for (let i = 0; i < layer.count; i++) {
                const star     = document.createElement('div');
                const size     = layer.minSize + Math.random() * (layer.maxSize - layer.minSize);
                const duration = 3 + Math.random() * 4;
                const delay    = Math.random() * 6;

                star.className = 'star';
                star.style.cssText = [
                    'left:'             + Math.random() * 100 + '%',
                    'top:'              + Math.random() * 100 + '%',
                    'width:'            + size + 'px',
                    'height:'           + size + 'px',
                    'opacity:'          + (layer.opacity * (0.5 + Math.random() * 0.5)),
                    'background:'       + (Math.random() > 0.85 ? '#fde68a' : '#fff'),
                    'animation:'        + 'pulse ' + duration + 's ' + delay + 's ease-in-out infinite alternate',
                    'box-shadow:'       + (size > 1.8 ? '0 0 ' + (size * 2) + 'px rgba(255,220,120,0.4)' : 'none')
                ].join(';');

                container.appendChild(star);
            }

            // Subtle parallax on mouse move
            document.addEventListener('mousemove', function (e) {
                const mx = (e.clientX / window.innerWidth  - 0.5) * layer.drift;
                const my = (e.clientY / window.innerHeight - 0.5) * layer.drift;
                container.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
            });
        });

        // ── Floating embers ────────────────────────────────────────

        const emberContainer = document.getElementById('stars-near');
        if (emberContainer) {
            for (let i = 0; i < 22; i++) {
                const ember    = document.createElement('div');
                const size     = 1 + Math.random() * 2.5;
                const duration = 8  + Math.random() * 14;
                const delay    = Math.random() * 12;

                ember.className = 'ember';
                ember.style.cssText = [
                    'left:'   + Math.random() * 100 + '%',
                    'top:'    + (60 + Math.random() * 40) + '%',
                    'width:'  + size + 'px',
                    'height:' + size + 'px',
                    'background:' + (Math.random() > 0.5
                        ? 'rgba(251,191,36,' + (0.3 + Math.random() * 0.5) + ')'
                        : 'rgba(249,115,22,' + (0.2 + Math.random() * 0.4) + ')'),
                    'box-shadow: 0 0 ' + (size * 3) + 'px rgba(251,191,36,0.4)',
                    '--dur:'   + duration + 's',
                    '--delay:' + delay + 's'
                ].join(';');

                emberContainer.appendChild(ember);
            }
        }

        // ── Shooting stars ─────────────────────────────────────────

        const shootContainer = document.getElementById('stars-far');
        if (shootContainer) {
            for (let i = 0; i < 6; i++) {
                const s        = document.createElement('div');
                const duration = 1.2 + Math.random() * 1.5;
                const delay    = 4   + Math.random() * 18;

                s.className = 'shooting-star';
                s.style.cssText = [
                    'left:'        + Math.random() * 70 + '%',
                    'top:'         + Math.random() * 40 + '%',
                    '--shoot-dur:' + duration + 's',
                    '--shoot-delay:' + delay + 's'
                ].join(';');

                shootContainer.appendChild(s);
            }
        }

    }());


    /* ============================================================
       2. INTRO OVERLAY ANIMATION
       ============================================================ */

    (function () {

        const overlay = document.getElementById('intro-overlay');
        const chars   = document.querySelectorAll('.intro-char');
        const burst   = document.getElementById('intro-stars-burst');

        if (!overlay) return;

        // Stagger each letter's animation delay
        chars.forEach(function (char, i) {
            char.style.animationDelay = (i * 0.08) + 's';
        });

        // Burst stars that fly outward
        if (burst) {
            for (let i = 0; i < 30; i++) {
                const star  = document.createElement('div');
                const angle = Math.random() * 360;
                const dist  = 80 + Math.random() * 120;
                const bx    = Math.cos(angle * Math.PI / 180) * dist;
                const by    = Math.sin(angle * Math.PI / 180) * dist;

                star.className = 'burst-star';
                star.style.cssText = [
                    'left:'         + (50 + (Math.random() - 0.5) * 20) + '%',
                    'top:'          + (50 + (Math.random() - 0.5) * 20) + '%',
                    '--bx:'         + bx + 'px',
                    '--by:'         + by + 'px',
                    'animation-delay:' + (1.4 + Math.random() * 0.4) + 's',
                    'width:'        + (2 + Math.random() * 3) + 'px',
                    'height:'       + (2 + Math.random() * 3) + 'px',
                    'background:'   + (Math.random() > 0.5 ? '#fbbf24' : '#fff')
                ].join(';');

                burst.appendChild(star);
            }
        }

        // Hide overlay after animation completes
        setTimeout(function () {
            overlay.classList.add('hidden');
            setTimeout(function () {
                overlay.style.display = 'none';
            }, 1000);
        }, 3200);

    }());


    /* ============================================================
       3. SCROLL PROGRESS BAR
       ============================================================ */

    (function () {

        const bar = document.getElementById('scroll-bar');
        if (!bar) return;

        window.addEventListener('scroll', function () {
            const scrollTop    = window.scrollY;
            const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
            const progress     = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            bar.style.width    = progress + '%';
        }, { passive: true });

    }());


    /* ============================================================
       4. NAVIGATION — Active Link & Header Scroll Style
       ============================================================ */

    (function () {

        const header  = document.querySelector('.header');
        const navLinks = document.querySelectorAll('.nav-menu a');
        const sections = document.querySelectorAll('section[id]');

        // Add scrolled class to header after 80px
        window.addEventListener('scroll', function () {
            if (header) {
                header.classList.toggle('scrolled', window.scrollY > 80);
            }
        }, { passive: true });

        // Highlight active nav link based on scroll position
        window.addEventListener('scroll', function () {
            let current = '';

            sections.forEach(function (section) {
                const sectionTop = section.offsetTop - 120;
                if (window.scrollY >= sectionTop) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(function (link) {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href && href === '#' + current) {
                    link.classList.add('active');
                }
            });
        }, { passive: true });

        // Close mobile menu when a link is clicked
        const navToggle = document.getElementById('nav-toggle');
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                if (navToggle) navToggle.checked = false;
            });
        });

    }());


    /* ============================================================
       5. TYPEWRITER EFFECT
       ============================================================ */

    (function () {

        const el = document.getElementById('typewriter-text');
        if (!el) return;

        const phrases = [
            'ECE Student · JNTUACEP',
            'Cross-Domain Engineer',
            'AI × Hardware Builder',
            'Embedded Systems · Python',
            'Robotics & Automation Minor',
            'Exploring Neuromorphic Tech'
        ];

        let phraseIndex = 0;
        let charIndex   = 0;
        let deleting    = false;
        let paused      = false;

        // Create cursor element
        const cursor = document.createElement('span');
        cursor.className = 'typewriter-cursor';
        el.parentNode.insertBefore(cursor, el.nextSibling);

        function type() {
            if (paused) return;

            const current = phrases[phraseIndex];

            if (!deleting) {
                // Typing forward
                el.textContent = current.slice(0, charIndex + 1);
                charIndex++;

                if (charIndex === current.length) {
                    // Pause at end before deleting
                    paused = true;
                    setTimeout(function () {
                        deleting = true;
                        paused   = false;
                        setTimeout(type, 60);
                    }, 1800);
                    return;
                }
            } else {
                // Deleting
                el.textContent = current.slice(0, charIndex - 1);
                charIndex--;

                if (charIndex === 0) {
                    deleting     = false;
                    phraseIndex  = (phraseIndex + 1) % phrases.length;
                }
            }

            setTimeout(type, deleting ? 40 : 80);
        }

        // Start after intro overlay clears
        setTimeout(type, 3400);

    }());


    /* ============================================================
       6. SKILL MODAL
       ============================================================ */

    (function () {

        const modal      = document.getElementById('skillModal');
        const closeBtn   = document.querySelector('.skill-modal-close');
        const skillItems = document.querySelectorAll('.skill-item');

        if (!modal) return;

        // Data for each skill
        const skillData = {
            python: {
                name:       'Python',
                learnedFrom:'Coursera — Meta Python Course · Self-study projects · Building portfolio tools',
                certLink:   'https://coursera.org/share/a0c564366adb9bd2034ce00441eb87f0',
                certText:   'View Certificate',
                level:      72
            },
            c: {
                name:       'C Language',
                learnedFrom:'University coursework (ECE) · Data structures labs · Embedded systems programming',
                certLink:   '',
                certText:   'No certificate — university course',
                level:      60
            },
            embedded: {
                name:       'Embedded Systems',
                learnedFrom:'Arduino & microcontroller projects · ECE lab work · Self-built hardware projects',
                certLink:   '',
                certText:   'No certificate — hands-on projects',
                level:      58
            },
            matlab: {
                name:       'MATLAB',
                learnedFrom:'University ECE coursework · Signal processing labs · Simulation projects',
                certLink:   '',
                certText:   'No certificate — university course',
                level:      50
            },
            htmlcss: {
                name:       'HTML / CSS',
                learnedFrom:'Self-taught through portfolio projects · W3Schools · MDN Web Docs',
                certLink:   '',
                certText:   'No certificate — self-taught',
                level:      78
            },
            javascript: {
                name:       'JavaScript',
                learnedFrom:'Self-taught building this portfolio · MDN Web Docs · Project-based learning',
                certLink:   '',
                certText:   'No certificate — self-taught',
                level:      62
            },
            genai: {
                name:       'Generative AI',
                learnedFrom:'GUVI AI Impact Summit · Self-exploration of LLMs, prompting, AI tools · Ongoing',
                certLink:   '',
                certText:   'No certificate — self-exploration',
                level:      55
            }
        };

        // Open modal
        skillItems.forEach(function (item) {
            item.addEventListener('click', function () {
                const key  = item.getAttribute('data-skill');
                const data = skillData[key];
                if (!data) return;

                document.getElementById('modalSkillName').textContent  = data.name;
                document.getElementById('modalLearnedFrom').textContent = data.learnedFrom;

                const certLink = document.getElementById('modalCertLink');
                certLink.textContent = data.certText;
                certLink.href        = data.certLink || '#';

                // Animate skill bar
                const fill = document.getElementById('modalSkillLevel');
                fill.style.width = '0%';
                modal.style.display = 'flex';

                requestAnimationFrame(function () {
                    setTimeout(function () {
                        fill.style.width = data.level + '%';
                    }, 80);
                });
            });
        });

        // Close modal
        function closeModal() {
            modal.style.display = 'none';
            document.getElementById('modalSkillLevel').style.width = '0%';
        }

        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeModal();
        });

    }());


    /* ============================================================
       7. 3D CARD TILT (Project Cards)
       ============================================================ */

    (function () {

        const cards = document.querySelectorAll('.project-card');

        cards.forEach(function (card) {

            card.addEventListener('mousemove', function (e) {
                const rect   = card.getBoundingClientRect();
                const x      = e.clientX - rect.left;
                const y      = e.clientY - rect.top;
                const cx     = rect.width  / 2;
                const cy     = rect.height / 2;
                const tiltX  = ((y - cy) / cy) * -6;
                const tiltY  = ((x - cx) / cx) *  6;

                card.style.transform = [
                    'perspective(800px)',
                    'rotateX(' + tiltX + 'deg)',
                    'rotateY(' + tiltY + 'deg)',
                    'translateZ(6px)'
                ].join(' ');
            });

            card.addEventListener('mouseleave', function () {
                card.style.transform = '';
                card.style.transition = 'transform 0.5s ease';
            });

            card.addEventListener('mouseenter', function () {
                card.style.transition = 'transform 0.1s ease';
            });
        });

    }());


    /* ============================================================
       8. SCROLL REVEAL (Intersection Observer)
       ============================================================ */

    (function () {

        const targets = document.querySelectorAll(
            '.project-card, .skill-item, .cred-card, .about-card, .road-stop, .bt-card, .connect-link'
        );

        // Set initial hidden state
        targets.forEach(function (el) {
            el.style.opacity   = '0';
            el.style.transform = 'translateY(24px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity   = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        targets.forEach(function (el, i) {
            // Stagger delay based on position
            el.style.transitionDelay = (i % 4) * 0.08 + 's';
            observer.observe(el);
        });

    }());


    /* ============================================================
       9. BACK TO TOP BUTTON
       ============================================================ */

    (function () {

        const btn = document.getElementById('back-to-top');
        if (!btn) return;

        window.addEventListener('scroll', function () {
            btn.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

    }());


    /* ============================================================
       10. BEYOND TECH — Toggle Story
       ============================================================ */

    // Global function so inline onclick="toggleMore('t1')" works
    window.toggleMore = function (id) {
        const moreEl = document.getElementById('more-' + id);
        if (!moreEl) return;

        const isOpen = moreEl.classList.contains('open');
        const card   = moreEl.closest('.bt-card');
        const btn    = card ? card.querySelector('.btc-btn') : null;

        moreEl.classList.toggle('open', !isOpen);
        if (btn) btn.textContent = isOpen ? 'the story →' : 'close ×';
    };
    


}); // end DOMContentLoaded
// ── Experience: toggle card open/close ──────────────────────
function toggleExp(header) {
    const card = header.closest('.exp-card');
    if (card.classList.contains('dim')) return;
    card.classList.toggle('open');
}

// ── Experience: switch tabs ─────────────────────────────────
function switchTab(btn, tab, cardId) {
    const card = document.querySelector(`.exp-card[data-id="${cardId}"]`);

    card.querySelectorAll('.exp-tab').forEach(t => t.classList.remove('on'));
    btn.classList.add('on');

    card.querySelectorAll('.exp-panel').forEach(p => p.classList.remove('active'));
    card.querySelector(`.exp-panel[data-tab="${tab}"]`).classList.add('active');
}

// ── Auto-open first card on load ────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const first = document.querySelector('.exp-card.active');
    if (first) first.classList.add('open');
});