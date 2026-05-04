// ============================================================
// SCRIPT.JS — Pola Harsha Portfolio — PARTICLE CONSTELLATION
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // SOUND
    // ============================================================
    const introSound = new Audio('assets/sounds/mixkit-sci-fi-click-900.wav');
    introSound.volume = 0.5;


    // ============================================================
    // 1. TYPEWRITER DATA
    // ============================================================
    const roles = [
        'Cross Domain Guy',
        'Electronics Student',
        'AI Player',
        'Solo Traveler',
        'GYM Bro',
        'Python Developer',
        'Vibe Coder'
    ];
    let roleIndex = 0, charIndex = 0, isDeleting = false, wordEl = null;


    // ============================================================
    // 2. SKILLS DATA
    // ============================================================
    const skillsData = {
        python: { name: 'Python', learnedFrom: 'Coursera (Meta), YouTube (FreeCodeCamp), Personal Projects', certLink: null, level: 65 },
        c: { name: 'C Language', learnedFrom: 'College Coursework, GeeksForGeeks, HackerRank', certLink: null, level: 50 },
        embedded: { name: 'Embedded Programming', learnedFrom: 'College labs, Workshops, YouTube, Team project', certLink: null, level: 50 },
        matlab: { name: 'MATLAB', learnedFrom: 'College Lab, MathWorks Tutorials, AI explanations', certLink: null, level: 40 },
        htmlcss: { name: 'HTML / CSS', learnedFrom: 'W3Schools, Personal Projects', certLink: null, level: 80 },
        javascript: { name: 'JavaScript', learnedFrom: 'Personal Projects, YouTube, AI explanations', certLink: null, level: 50 },
        genai: { name: 'Gen AI', learnedFrom: 'Google AI Essentials, YouTube, Self-exploration', certLink: null, level: 65 }
    };


    // ============================================================
    // 3. DOM REFS
    // ============================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    const sectionEls = document.querySelectorAll('.section');
    const skillModal = document.getElementById('skillModal');
    const modalClose = document.querySelector('.skill-modal-close');
    const skillItems = document.querySelectorAll('.skill-item');
    const typeEl = document.getElementById('typewriter-text');
    const btt = document.getElementById('back-to-top');
    const header = document.querySelector('.header');
    const scrollBar = document.getElementById('scroll-bar');


    // ============================================================
    // 4. PARTICLE CONSTELLATION CANVAS
    // ============================================================

    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    let mousePos = { x: -9999, y: -9999 };
    const CONNECT_DIST = 130;
    const MOUSE_RADIUS = 160;
    const MOUSE_REPEL = 0.018;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

    window.addEventListener('mousemove', e => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => { mousePos.x = -9999; mousePos.y = -9999; });

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.ox = this.x;    // origin for gentle return
            this.oy = this.y;
            this.vx = (Math.random() - 0.5) * 0.35;
            this.vy = (Math.random() - 0.5) * 0.35;
            this.size = Math.random() * 1.6 + 0.4;
            this.opacity = Math.random() * 0.4 + 0.25;
            // each particle has a slight cyan or white tint
            this.isCyan = Math.random() < 0.25;
        }

        update() {
            // Drift
            this.x += this.vx;
            this.y += this.vy;

            // Mouse repulsion — particles move away from cursor
            const dx = this.x - mousePos.x;
            const dy = this.y - mousePos.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < MOUSE_RADIUS && dist > 0) {
                const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                this.x += (dx / dist) * force * force * MOUSE_RADIUS * MOUSE_REPEL * 6;
                this.y += (dy / dist) * force * force * MOUSE_RADIUS * MOUSE_REPEL * 6;
            }

            // Wrap edges
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.y > canvas.height + 10) this.y = -10;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

            if (this.isCyan) {
                ctx.fillStyle = `rgba(34,211,238,${this.opacity * 0.9})`;
                if (this.size > 1.2) {
                    ctx.shadowColor = 'rgba(34,211,238,0.6)';
                    ctx.shadowBlur = 6;
                }
            } else {
                ctx.fillStyle = `rgba(200,220,255,${this.opacity})`;
                ctx.shadowBlur = 0;
            }
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function initParticles() {
        const density = (canvas.width * canvas.height) / 9000;
        const count = Math.min(150, Math.max(60, Math.floor(density)));
        particles = [];
        for (let i = 0; i < count; i++) particles.push(new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECT_DIST) {
                    const alpha = (1 - dist / CONNECT_DIST) * 0.35;

                    // Lines near mouse glow brighter cyan
                    const mx = (particles[i].x + particles[j].x) / 2;
                    const my = (particles[i].y + particles[j].y) / 2;
                    const mdx = mx - mousePos.x;
                    const mdy = my - mousePos.y;
                    const md = Math.sqrt(mdx * mdx + mdy * mdy);
                    const boost = md < 200 ? (1 - md / 200) * 0.5 : 0;

                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(34,211,238,${alpha + boost})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
    }

    // Extra: lines from nearest particles to mouse cursor
    function drawMouseLines() {
        if (mousePos.x < 0) return;
        let closest = [];
        particles.forEach(p => {
            const dx = p.x - mousePos.x;
            const dy = p.y - mousePos.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 120) closest.push({ p, d });
        });
        closest.sort((a, b) => a.d - b.d);
        closest.slice(0, 5).forEach(({ p, d }) => {
            const alpha = (1 - d / 120) * 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mousePos.x, mousePos.y);
            ctx.strokeStyle = `rgba(99,102,241,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
        });
        // cursor dot
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99,102,241,0.6)';
        ctx.fill();
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawConnections();
        drawMouseLines();
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();


    // ============================================================
    // 5. INTRO OVERLAY
    // ============================================================
    (() => {
        const overlay = document.getElementById('intro-overlay');
        if (!overlay) return;

        const chars = overlay.querySelectorAll('.intro-char');
        const burst = document.getElementById('intro-stars-burst');

        chars.forEach((ch, i) => {
            ch.style.animationDelay = `${0.08 * i + 0.3}s`;
        });

        // Burst particles — cyan + white
        for (let i = 0; i < 24; i++) {
            const s = document.createElement('div');
            s.className = 'burst-star';
            const angle = (i / 24) * 360;
            const dist = 80 + Math.random() * 100;
            s.style.left = '50%';
            s.style.top = '50%';
            s.style.setProperty('--bx', `${Math.cos(angle * Math.PI / 180) * dist}px`);
            s.style.setProperty('--by', `${Math.sin(angle * Math.PI / 180) * dist}px`);
            s.style.animationDelay = `${1.4 + Math.random() * 0.3}s`;
            s.style.background = ['#fff', '#22d3ee', '#fff', '#6366f1'][i % 4];
            burst.appendChild(s);
        }

        setTimeout(() => {
            introSound.currentTime = 0;
            introSound.play().catch(() => {
                const unlock = () => {
                    introSound.play().catch(() => { });
                    document.removeEventListener('click', unlock);
                };
                document.addEventListener('click', unlock, { once: true });
            });
            overlay.classList.add('hidden');
            setTimeout(() => overlay.remove(), 1100);
        }, 3200);
    })();


    // ============================================================
    // 6. TYPEWRITER
    // ============================================================
    function typeWrite() {
        if (!wordEl) return;
        const current = roles[roleIndex];

        if (!isDeleting) {
            wordEl.textContent = current.slice(0, charIndex + 1);
            charIndex++;
            if (charIndex === current.length) {
                isDeleting = true;
                setTimeout(typeWrite, 1800);
                return;
            }
        } else {
            wordEl.textContent = current.slice(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }
        }
        setTimeout(typeWrite, isDeleting ? 55 : 95);
    }

    if (typeEl) {
        typeEl.innerHTML = '<span id="tw-word"></span><span class="typewriter-cursor"></span>';
        wordEl = document.getElementById('tw-word');
        typeWrite();
    }


    // ============================================================
    // 7. SKILL MODAL
    // ============================================================
    skillItems.forEach(item => {
        item.addEventListener('click', () => {
            const key = item.getAttribute('data-skill');
            const info = skillsData[key];
            if (!info) return;

            document.getElementById('modalSkillName').textContent = info.name;
            document.getElementById('modalLearnedFrom').textContent = info.learnedFrom;

            const certLink = document.getElementById('modalCertLink');
            const certItem = certLink.closest('.skill-detail-item');
            if (info.certLink) {
                certLink.textContent = info.certText || 'View Certificate';
                certLink.href = info.certLink;
                certItem.style.display = 'flex';
            } else {
                certItem.style.display = 'none';
            }

            const fillEl = document.getElementById('modalSkillLevel');
            fillEl.style.width = '0%';
            setTimeout(() => { fillEl.style.width = info.level + '%'; }, 50);

            skillModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() { skillModal.style.display = 'none'; document.body.style.overflow = 'auto'; }
    if (modalClose) modalClose.addEventListener('click', closeModal);
    window.addEventListener('click', e => { if (e.target === skillModal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });


    // ============================================================
    // 8. PROJECT CARD 3D TILT
    // ============================================================
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const x = e.clientX - r.left;
            const y = e.clientY - r.top;
            const ry = ((x - r.width / 2) / (r.width / 2)) * 7;
            const rx = -((y - r.height / 2) / (r.height / 2)) * 7;
            card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
            card.style.transition = 'transform 0.1s ease';
            card.style.boxShadow = '0 20px 60px rgba(34,211,238,0.1), 0 0 40px rgba(34,211,238,0.05)';
            card.style.borderColor = 'rgba(34,211,238,0.25)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease, border-color 0.5s ease';
            card.style.boxShadow = '';
            card.style.borderColor = '';
        });
    });


    // ============================================================
    // 9. BEYOND TECH STORY TOGGLE
    // ============================================================
    function toggleMore(id) {
        const more = document.getElementById('more-' + id);
        if (!more) return;
        const btn = more.previousElementSibling;
        const isOpen = more.classList.contains('open');
        more.classList.toggle('open');
        if (btn) btn.textContent = isOpen ? 'the story →' : 'close ↑';
    }
    window.toggleMore = toggleMore;


    // ============================================================
    // 10. BACK TO TOP
    // ============================================================
    if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


    // ============================================================
    // 11. SCROLL EVENTS
    // ============================================================
    window.addEventListener('scroll', () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 50);
        if (btt) btt.classList.toggle('visible', window.scrollY > 400);
        if (scrollBar) {
            const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            scrollBar.style.width = pct + '%';
        }
    });


    // ============================================================
    // 12. INTERSECTION OBSERVERS
    // ============================================================

    // Active nav link
    const navObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
                });
            }
        });
    }, { threshold: 0.45 });
    sections.forEach(s => navObs.observe(s));

    // Fade-up on scroll
    const fadeObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    sectionEls.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
        fadeObs.observe(el);
    });


}); // end DOMContentLoaded