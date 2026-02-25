document.addEventListener('DOMContentLoaded', () => {

    // ========================
    // GENERATE STARS with gentle rotation (Grok-style)
    // ========================
    function generateStars(containerId, count) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const colors = ['#ffffff', '#ffffff', '#ffffff', '#93c5fd', '#fde68a', '#c4b5fd'];
        for (let i = 0; i < count; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left    = `${Math.random() * 100}%`;
            star.style.top     = `${Math.random() * 100}%`;
            const size = Math.random() * 1.8 + 0.5;
            star.style.width   = `${size}px`;
            star.style.height  = `${size}px`;
            star.style.background = colors[Math.floor(Math.random() * colors.length)];
            star.style.setProperty('--dur',   `${(Math.random() * 5 + 3).toFixed(1)}s`);
            star.style.setProperty('--delay', `${(Math.random() * 8).toFixed(1)}s`);
            star.style.setProperty('--rotation', `${Math.random() * 360}deg`);
            // Bigger stars get a glow
            if (size > 1.5) {
                star.style.boxShadow = `0 0 ${Math.round(size * 3)}px rgba(255,255,255,0.6)`;
            }
            container.appendChild(star);
        }
    }

    generateStars('stars-far',  150);
    generateStars('stars-mid',  250);
    generateStars('stars-near', 400);

    // ========================
    // SHOOTING STARS (slowed down significantly)
    // ========================
    function addShootingStar() {
        const container = document.querySelector('.cosmic-bg');
        if (!container) return;
        const star = document.createElement('div');
        star.className = 'shooting-star';
        // Random starting position along top/right edges
        star.style.left  = `${Math.random() * 70}%`;
        star.style.top   = `${Math.random() * 40}%`;
        const dur   = (Math.random() * 3 + 6).toFixed(1); // Slowed: 6-9 seconds
        const delay = (Math.random() * 12).toFixed(1);    // Longer delays
        star.style.setProperty('--shoot-dur',   `${dur}s`);
        star.style.setProperty('--shoot-delay', `${delay}s`);
        container.appendChild(star);
        // Remove after a while to avoid DOM bloat
        setTimeout(() => star.remove(), (parseFloat(dur) + parseFloat(delay) + 1) * 1000 * 3);
    }

    // Spawn fewer shooting stars
    for (let i = 0; i < 5; i++) addShootingStar();
    // Much slower refresh rate
    setInterval(() => addShootingStar(), 12000); // Every 12 seconds

    // ========================
    // ACTIVE NAV ON SCROLL
    // ========================
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav-menu a');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
                });
            }
        });
    }, { threshold: 0.45 });

    sections.forEach(s => observer.observe(s));

    // ========================
    // FADE-IN SECTIONS ON SCROLL
    // ========================
    const sectionEls = document.querySelectorAll('.section');
    const fadeObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    sectionEls.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObs.observe(el);
    });

    // ========================
    // SKILL MODAL FUNCTIONALITY
    // ========================
    const skillModal = document.getElementById('skillModal');
    const modalClose = document.querySelector('.skill-modal-close');
    const skillItems = document.querySelectorAll('.skill-item');

    // UPDATE THIS WITH YOUR ACTUAL INFO
    const skillsData = {
        python: {
            name: 'Python',
            learnedFrom: 'Coursera, DataCamp, Personal Projects',
            certLink: 'https://www.coursera.org/account/accomplishments/certificate/XXXXX',
            certText: 'View Certificate',
            level: 75 // percentage (0-100)
        }
    };

    // Open modal on skill click
    skillItems.forEach(item => {
        item.addEventListener('click', () => {
            const skillKey = item.getAttribute('data-skill');
            const skillInfo = skillsData[skillKey];

            if (skillInfo) {
                document.getElementById('modalSkillName').textContent = skillInfo.name;
                document.getElementById('modalLearnedFrom').textContent = skillInfo.learnedFrom;
                document.getElementById('modalCertLink').textContent = skillInfo.certText;
                document.getElementById('modalCertLink').href = skillInfo.certLink;
                document.getElementById('modalSkillLevel').style.width = skillInfo.level + '%';

                skillModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal
    modalClose.addEventListener('click', () => {
        skillModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === skillModal) {
            skillModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && skillModal.style.display === 'block') {
            skillModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});