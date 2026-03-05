document.addEventListener('DOMContentLoaded', () => {


// ========================================
// 1. GLOBAL VARIABLES / CONFIGURATION
// ========================================

// Cursor Trail
const trailColors = ['#ffffff', '#93c5fd', '#fde68a', '#c4b5fd', '#6ee7b7'];
let lastTrail = 0;

// Parallax
let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;

// Typewriter
const roles = [
  'Cross Domain guy',
  'Electronics  Student',
  'Ai Player',
  'Solo Traveler',
  'GYM Bro',
  'Python Developer'
  ,'Vibe Coder'
];
let roleIndex = 0, charIndex = 0, isDeleting = false;

// Skills Data
const skillsData = {
    python:     { name: 'Python',               learnedFrom: 'Coursera (meta), YouTube (FreeCodeCamp), Personal Projects',  certLink: null, certText: null, level: 65 },
    c:          { name: 'C Language',            learnedFrom: 'College Coursework, GeeksForGeeks, Hacker rank',              certLink: null, certText: null, level: 50 },
    embedded:   { name: 'Embedded Programming',  learnedFrom: 'College labs, Workshops, YouTube, Team project',              certLink: null, certText: null, level: 50 },
    matlab:     { name: 'MATLAB',                learnedFrom: 'College Lab, MathWorks Tutorials, AI explanations',           certLink: null, certText: null, level: 40 },
    htmlcss:    { name: 'HTML / CSS',            learnedFrom: 'W3Schools, Personal Projects',                                certLink: null, certText: null, level: 80 },
    javascript: { name: 'JavaScript',            learnedFrom: 'Personal Projects, YouTube, AI explanations',                 certLink: null, certText: null, level: 50 },
    genai:      { name: 'Gen AI',                learnedFrom: 'Google AI Essentials, YouTube, Self-exploration',             certLink: null, certText: null, level: 65 }
};


// ========================================
// 2. DOM SELECTORS
// ========================================

// Parallax
const pFar  = document.getElementById('stars-far');
const pMid  = document.getElementById('stars-mid');
const pNear = document.getElementById('stars-near');

// Navigation
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-menu a');

// Sections Fade
const sectionEls = document.querySelectorAll('.section');

// Skills Modal
const skillModal = document.getElementById('skillModal');
const modalClose = document.querySelector('.skill-modal-close');
const skillItems = document.querySelectorAll('.skill-item');

// Typewriter
const typeEl = document.getElementById('typewriter-text');

// Back To Top & Header
const btt = document.getElementById('back-to-top');
const header = document.querySelector('.header');


// ========================================
// 3. UTILITY FUNCTIONS
// ========================================

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
        star.style.opacity = '0.8';
        star.style.setProperty('--dur',   `${(Math.random() * 5 + 3).toFixed(1)}s`);
        star.style.setProperty('--delay', `${(Math.random() * 8).toFixed(1)}s`);

        if (size > 1.5) {
            star.style.boxShadow = `0 0 ${Math.round(size * 3)}px rgba(255,255,255,0.6)`;
        }

        if (containerId === 'stars-far') {
            star.style.animation = 'pulse 4s infinite alternate ease-in-out';
            star.style.animationDelay = `${Math.random() * 4}s`;
        }

        container.appendChild(star);
    }
}

function addShootingStar() {
    const container = document.querySelector('.cosmic-bg');
    if (!container) return;

    const star = document.createElement('div');
    star.className = 'shooting-star';
    star.style.left  = `${Math.random() * 70}%`;
    star.style.top   = `${Math.random() * 40}%`;

    const dur   = (Math.random() * 3 + 6).toFixed(1);
    const delay = (Math.random() * 12).toFixed(1);

    star.style.setProperty('--shoot-dur',   `${dur}s`);
    star.style.setProperty('--shoot-delay', `${delay}s`);

    container.appendChild(star);

    setTimeout(() => {
        star.remove();
    }, (parseFloat(dur) + parseFloat(delay) + 1) * 1000 * 3);
}

function parallaxLoop() {
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;

    if (pFar)  pFar.style.transform  = `translate(${currentX * 10}px, ${currentY * 10}px)`;
    if (pMid)  pMid.style.transform  = `translate(${currentX * 22}px, ${currentY * 22}px)`;
    if (pNear) pNear.style.transform = `translate(${currentX * 40}px, ${currentY * 40}px)`;

    requestAnimationFrame(parallaxLoop);
}

function typeWrite() {
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

    setTimeout(typeWrite, isDeleting ? 60 : 100);
}


// ========================================
// 4. SECTION-SPECIFIC LOGIC
// ========================================

// ---------- Hero ----------

// Cursor Trail
document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTrail < 40) return;

    lastTrail = now;

    const dot = document.createElement('div');
    dot.className = 'cursor-trail-dot';
    dot.style.left = `${e.clientX}px`;
    dot.style.top  = `${e.clientY}px`;
    dot.style.background = trailColors[Math.floor(Math.random() * trailColors.length)];

    const size = Math.random() * 4 + 3;
    dot.style.width  = `${size}px`;
    dot.style.height = `${size}px`;

    if (size > 5) {
        dot.style.boxShadow = `0 0 6px ${dot.style.background}`;
    }

    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 800);
});

// Parallax Mouse Move
document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth  - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
});

// Opening Animation
(function () {
    const overlay  = document.getElementById('intro-overlay');
    const chars    = document.querySelectorAll('.intro-char');
    const burst    = document.getElementById('intro-stars-burst');

    chars.forEach((ch, i) => {
        ch.style.animationDelay = `${0.08 * i + 0.3}s`;
    });

    for (let i = 0; i < 20; i++) {
        const s = document.createElement('div');
        s.className = 'burst-star';

        const angle = (i / 20) * 360;
        const dist  = 80 + Math.random() * 80;

        s.style.left = '50%';
        s.style.top  = '50%';
        s.style.setProperty('--bx', `${Math.cos(angle * Math.PI/180) * dist}px`);
        s.style.setProperty('--by', `${Math.sin(angle * Math.PI/180) * dist}px`);
        s.style.animationDelay = `${1.4 + Math.random() * 0.3}s`;
        s.style.background = ['#fff','#93c5fd','#fde68a','#c4b5fd'][i % 4];

        burst.appendChild(s);
    }

    setTimeout(() => {
        overlay.classList.add('hidden');
        setTimeout(() => overlay.remove(), 1100);
    }, 3200);
})();

// ---------- Skills ----------

// Skill Modal Open
skillItems.forEach(item => {
    item.addEventListener('click', () => {
        const skillKey  = item.getAttribute('data-skill');
        const skillInfo = skillsData[skillKey];

        if (skillInfo) {
            document.getElementById('modalSkillName').textContent   = skillInfo.name;
            document.getElementById('modalLearnedFrom').textContent = skillInfo.learnedFrom;

            const certLink = document.getElementById('modalCertLink');
            const certItem = certLink.closest('.skill-detail-item');
            if (skillInfo.certLink) {
                certLink.textContent   = skillInfo.certText;
                certLink.href          = skillInfo.certLink;
                certItem.style.display = 'flex';
            } else {
                certItem.style.display = 'none';
            }

            // Reset then animate to your level
            const fillEl = document.getElementById('modalSkillLevel');
            fillEl.style.width = '0%';
            setTimeout(() => {
                fillEl.style.width = skillInfo.level + '%';
            }, 50);

            skillModal.style.display     = 'block';
            document.body.style.overflow = 'hidden';
        }
    });
});

// Skill Modal Close
modalClose.addEventListener('click', () => {
    skillModal.style.display = 'none';
    document.body.style.overflow = 'auto';
});

window.addEventListener('click', (e) => {
    if (e.target === skillModal) {
        skillModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && skillModal.style.display === 'block') {
        skillModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// ---------- Connect ----------

// Back To Top Click
btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ========================================
// 5. EVENT LISTENERS
// ========================================

// Scroll Effects
window.addEventListener('scroll', () => {
    if (header) {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }
    if (btt) {
        btt.classList.toggle('visible', window.scrollY > 400);
    }
});




// ========================================
// 6. ANIMATIONS / EFFECTS
// ========================================

// Active Nav Observer
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.toggle(
                    'active',
                    link.getAttribute('href') === `#${entry.target.id}`
                );
            });
        }
    });
}, { threshold: 0.45 });

sections.forEach(s => observer.observe(s));

// Fade In Sections
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

// Star Generation
generateStars('stars-far',  60);
generateStars('stars-mid',  80);
generateStars('stars-near', 100);

// Shooting Stars
for (let i = 0; i < 5; i++) addShootingStar();
setInterval(() => addShootingStar(), 12000);

// Parallax Loop Start
parallaxLoop();

// Typewriter Init
typeEl.innerHTML = '<span id="tw-word"></span><span class="typewriter-cursor"></span>';
const wordEl = document.getElementById('tw-word');
typeWrite();


// ========================================
// 7. INITIALIZATION
// ========================================
// (All logic initialized within DOMContentLoaded)

});