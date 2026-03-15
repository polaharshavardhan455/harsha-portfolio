// ============================================================
// SCRIPT.JS — Pola Harsha Portfolio
// All JS runs after the HTML is fully loaded (DOMContentLoaded)
// ============================================================
//
// TABLE OF CONTENTS
// -----------------
// 1. Global Variables
// 2. DOM Selectors
// 3. Utility Functions
//      - generateStars()
//      - generateEmbers()
//      - addShootingStar()
//      - parallaxLoop()
//      - typeWrite()
// 4. Section Logic
//      - Parallax mouse tracking
//      - Intro overlay animation
//      - Skills modal open/close
//      - Card tilt effect
//      - Beyond Tech story toggle
//      - Back to top
// 5. Scroll Event Listener
// 6. Intersection Observers
// 7. Initialization
// ============================================================


document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // 1. GLOBAL VARIABLES
    // Declared at the top so every function below can access them
    // ============================================================

    // Parallax — tracks where mouse is heading vs where stars currently are
    let targetX  = 0, targetY  = 0;  // where the mouse is pointing (normalised -1 to +1)
    let currentX = 0, currentY = 0;  // where the stars currently are (lags behind mouse)

    // Typewriter — tracks which role is showing and which character we're on
    const roles = [
        'Cross Domain guy',
        'Electronics Student',
        'AI Player',
        'Solo Traveler',
        'GYM Bro',
        'Python Developer',
        'Vibe Coder'
    ];
    let roleIndex  = 0;     // which role in the array we're currently showing
    let charIndex  = 0;     // how many characters are visible right now
    let isDeleting = false; // true = erasing, false = typing

    // wordEl — the <span> JS types into. Assigned at the bottom after we create the span
    let wordEl = null;

    // Skills data — used to populate the modal when a skill is clicked
    const skillsData = {
        python:     { name: 'Python',              learnedFrom: 'Coursera (Meta), YouTube (FreeCodeCamp), Personal Projects', certLink: null, certText: null, level: 65 },
        c:          { name: 'C Language',           learnedFrom: 'College Coursework, GeeksForGeeks, HackerRank',              certLink: null, certText: null, level: 50 },
        embedded:   { name: 'Embedded Programming', learnedFrom: 'College labs, Workshops, YouTube, Team project',             certLink: null, certText: null, level: 50 },
        matlab:     { name: 'MATLAB',               learnedFrom: 'College Lab, MathWorks Tutorials, AI explanations',          certLink: null, certText: null, level: 40 },
        htmlcss:    { name: 'HTML / CSS',           learnedFrom: 'W3Schools, Personal Projects',                               certLink: null, certText: null, level: 80 },
        javascript: { name: 'JavaScript',           learnedFrom: 'Personal Projects, YouTube, AI explanations',                certLink: null, certText: null, level: 50 },
        genai:      { name: 'Gen AI',               learnedFrom: 'Google AI Essentials, YouTube, Self-exploration',            certLink: null, certText: null, level: 65 }
    };


    // ============================================================
    // 2. DOM SELECTORS
    // Grab HTML elements so we can interact with them in JS
    // getElementById returns one element, querySelectorAll returns a list
    // ============================================================

    const pFar  = document.getElementById('stars-far');
    const pMid  = document.getElementById('stars-mid');
    const pNear = document.getElementById('stars-near');

    const sections   = document.querySelectorAll('section[id]');
    const navLinks   = document.querySelectorAll('.nav-menu a');
    const sectionEls = document.querySelectorAll('.section');

    const skillModal = document.getElementById('skillModal');
    const modalClose = document.querySelector('.skill-modal-close');
    const skillItems = document.querySelectorAll('.skill-item');

    const typeEl = document.getElementById('typewriter-text');
    const btt    = document.getElementById('back-to-top');
    const header = document.querySelector('.header');


    // ============================================================
    // 3. UTILITY FUNCTIONS
    // ============================================================

    // ------ generateStars() ------
    // Creates star divs and places them randomly inside a container
    // Each star gets random: position, size, colour, animation timing
    function generateStars(containerId, count) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const colors = ['#ffffff', '#ffffff', '#ffffff', '#fde68a', '#fbbf24', '#f97316'];

        for (let i = 0; i < count; i++) {
            const star    = document.createElement('div');
            star.className = 'star';

            star.style.left = `${Math.random() * 100}%`;
            star.style.top  = `${Math.random() * 100}%`;

            const size = Math.random() * 1.8 + 0.5; // 0.5px to 2.3px
            star.style.width      = `${size}px`;
            star.style.height     = `${size}px`;
            star.style.background = colors[Math.floor(Math.random() * colors.length)];
            star.style.opacity    = '0.8';

            // CSS custom properties — the animation in style.css reads these
            star.style.setProperty('--dur',   `${(Math.random() * 5 + 3).toFixed(1)}s`);
            star.style.setProperty('--delay', `${(Math.random() * 8).toFixed(1)}s`);

            if (size > 1.5) {
                star.style.boxShadow = `0 0 ${Math.round(size * 3)}px rgba(255,255,255,0.6)`;
            }

            if (containerId === 'stars-far') {
                star.style.animation      = 'pulse 4s infinite alternate ease-in-out';
                star.style.animationDelay = `${Math.random() * 4}s`;
            }

            container.appendChild(star);
        }
    }


    // ------ generateEmbers() ------
    // Same as generateStars but uses warm amber/orange colours
    // and a float-up animation — like embers drifting from a fire
    function generateEmbers(count) {
        const container = document.querySelector('.cosmic-bg');
        if (!container) return;

        const colors = [
            'rgba(251,191,36,0.8)',
            'rgba(249,115,22,0.7)',
            'rgba(234,88,12,0.6)',
            'rgba(253,224,71,0.7)',
        ];

        for (let i = 0; i < count; i++) {
            const ember    = document.createElement('div');
            ember.className = 'ember';

            ember.style.left = `${Math.random() * 100}%`;
            ember.style.top  = `${Math.random() * 100}%`;

            const size = Math.random() * 3 + 1.5;
            ember.style.width      = `${size}px`;
            ember.style.height     = `${size}px`;
            ember.style.background = colors[Math.floor(Math.random() * colors.length)];

            const dur   = (Math.random() * 6 + 5).toFixed(1);
            const delay = (Math.random() * 10).toFixed(1);
            ember.style.setProperty('--dur',   `${dur}s`);
            ember.style.setProperty('--delay', `${delay}s`);

            if (size > 3) {
                ember.style.boxShadow = `0 0 ${Math.round(size * 4)}px rgba(251,191,36,0.5)`;
            }

            container.appendChild(ember);
        }
    }


    // ------ addShootingStar() ------
    // Creates one shooting star, lets it animate, then removes it from DOM
    function addShootingStar() {
        const container = document.querySelector('.cosmic-bg');
        if (!container) return;

        const star     = document.createElement('div');
        star.className = 'shooting-star';
        star.style.left = `${Math.random() * 70}%`;
        star.style.top  = `${Math.random() * 40}%`;

        const dur   = (Math.random() * 3 + 6).toFixed(1);
        const delay = (Math.random() * 12).toFixed(1);

        star.style.setProperty('--shoot-dur',   `${dur}s`);
        star.style.setProperty('--shoot-delay', `${delay}s`);

        container.appendChild(star);

        // Remove element after the animation completes — keeps DOM clean
        setTimeout(() => star.remove(),
            (parseFloat(dur) + parseFloat(delay) + 1) * 1000 * 3);
    }


    // ------ parallaxLoop() ------
    // Runs 60 times per second via requestAnimationFrame
    // LERP (linear interpolation): moves current position 5% toward target each frame
    // This creates the smooth "lagging behind" effect
    //
    // Formula:  current += (target - current) * speed
    // Example:  target=100, current=0, speed=0.05
    //   Frame 1: current = 0 + (100-0)*0.05 = 5
    //   Frame 2: current = 5 + (100-5)*0.05 = 9.75
    //   Frame 3: current = 9.75 + (100-9.75)*0.05 = 14.26
    //   ... slowly approaches 100 but never jumps instantly
    function parallaxLoop() {
        currentX += (targetX - currentX) * 0.05;
        currentY += (targetY - currentY) * 0.05;

        // Far layer moves 10x, mid 22x, near 40x — creates illusion of depth
        if (pFar)  pFar.style.transform  = `translate(${currentX * 10}px, ${currentY * 10}px)`;
        if (pMid)  pMid.style.transform  = `translate(${currentX * 22}px, ${currentY * 22}px)`;
        if (pNear) pNear.style.transform = `translate(${currentX * 40}px, ${currentY * 40}px)`;

        requestAnimationFrame(parallaxLoop); // schedule next frame
    }


    // ------ typeWrite() ------
    // Types one character, then calls itself after a short delay
    // When the full word is typed, switches to deleting mode
    // When fully deleted, moves to the next role
    function typeWrite() {
        if (!wordEl) return;

        const current = roles[roleIndex];

        if (!isDeleting) {
            wordEl.textContent = current.slice(0, charIndex + 1);
            charIndex++;
            if (charIndex === current.length) {
                isDeleting = true;
                setTimeout(typeWrite, 1800); // pause 1.8s before deleting
                return;
            }
        } else {
            wordEl.textContent = current.slice(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length; // loop back to start
            }
        }

        setTimeout(typeWrite, isDeleting ? 60 : 100); // delete faster than type
    }


    // ============================================================
    // 4. SECTION LOGIC
    // ============================================================

    // ------ Parallax mouse tracking ------
    // Converts mouse position to a value between -1 and +1
    // (0,0) = top-left corner, (1,1) = bottom-right, (0.5,0.5) = center
    document.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth  - 0.5) * 2;
        targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    });


    // ------ Intro overlay animation ------
    // IIFE = Immediately Invoked Function Expression
    // The (function(){ ... })() syntax runs this code once immediately
    (function () {
        const overlay = document.getElementById('intro-overlay');
        const chars   = document.querySelectorAll('.intro-char');
        const burst   = document.getElementById('intro-stars-burst');

        // Stagger each letter's delay so they appear one by one
        chars.forEach((ch, i) => {
            ch.style.animationDelay = `${0.08 * i + 0.3}s`;
        });

        // Create 20 burst stars — each flies in a different direction
        for (let i = 0; i < 20; i++) {
            const s     = document.createElement('div');
            s.className = 'burst-star';

            const angle = (i / 20) * 360;            // evenly spread around a circle
            const dist  = 80 + Math.random() * 80;   // random distance 80–160px

            s.style.left = '50%';
            s.style.top  = '50%';
            s.style.setProperty('--bx', `${Math.cos(angle * Math.PI / 180) * dist}px`);
            s.style.setProperty('--by', `${Math.sin(angle * Math.PI / 180) * dist}px`);
            s.style.animationDelay = `${1.4 + Math.random() * 0.3}s`;
            s.style.background     = ['#fff', '#fbbf24', '#f97316', '#fde68a'][i % 4];

            burst.appendChild(s);
        }

        // 3.2s → add .hidden (CSS fades it out)
        // 4.3s → remove from DOM entirely
        setTimeout(() => {
            overlay.classList.add('hidden');
            setTimeout(() => overlay.remove(), 1100);
        }, 3200);
    })();


    // ------ Skills modal — open ------
    skillItems.forEach(item => {
        item.addEventListener('click', () => {
            const skillKey  = item.getAttribute('data-skill'); // e.g. "python"
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

                // Reset bar to 0% first, then animate to the actual level
                // The 50ms gap forces the browser to process the 0% before transitioning
                const fillEl = document.getElementById('modalSkillLevel');
                fillEl.style.width = '0%';
                setTimeout(() => { fillEl.style.width = skillInfo.level + '%'; }, 50);

                skillModal.style.display     = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // ------ Skills modal — close (3 ways) ------
    modalClose.addEventListener('click', () => {
        skillModal.style.display     = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === skillModal) {
            skillModal.style.display     = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && skillModal.style.display === 'block') {
            skillModal.style.display     = 'none';
            document.body.style.overflow = 'auto';
        }
    });


    // ------ Card tilt effect ------
    // Calculates how far the cursor is from the card center
    // Converts that offset into rotateX and rotateY degrees
    document.querySelectorAll('.project-card').forEach(card => {

        card.addEventListener('mousemove', (e) => {
            const rect    = card.getBoundingClientRect();
            const x       = e.clientX - rect.left;  // cursor X relative to card edge
            const y       = e.clientY - rect.top;
            const centerX = rect.width  / 2;
            const centerY = rect.height / 2;

            // ((offset from center) / half-width) gives -1 to +1
            // multiply by 8 = max 8 degrees of tilt
            const rotateY =  ((x - centerX) / centerX) * 8;
            const rotateX = -((y - centerY) / centerY) * 8;

            card.style.transform   = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            card.style.transition  = 'transform 0.1s ease';
            card.style.boxShadow   = `0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(251,191,36,0.15)`;
            card.style.borderColor = 'rgba(251,191,36,0.4)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform   = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
            card.style.transition  = 'transform 0.5s ease, box-shadow 0.5s ease, border-color 0.5s ease';
            card.style.boxShadow   = '';
            card.style.borderColor = '';
        });

    });


    // ------ Beyond Tech story toggle ------
    // Called from onclick="toggleMore('t1')" in the HTML
    // FIX 2: Button text resets to "the story →" not "read more →"
    function toggleMore(id) {
        const more   = document.getElementById('more-' + id);
        const btn    = more.previousElementSibling;
        const isOpen = more.classList.contains('open');

        more.classList.toggle('open');
        btn.textContent = isOpen ? 'the story →' : 'close ↑';
    }

    // Expose to global scope so HTML onclick can reach it
    window.toggleMore = toggleMore;


    // ------ Back to top ------
    btt.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // ============================================================
    // 5. SCROLL EVENT LISTENER
    // Fires on every scroll — kept lightweight (3 things only)
    // ============================================================

    window.addEventListener('scroll', () => {
        if (header) header.classList.toggle('scrolled', window.scrollY > 50);
        if (btt)    btt.classList.toggle('visible',   window.scrollY > 400);

        // Progress bar: scrolled distance / total scrollable height = percentage
        const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        document.getElementById('scroll-bar').style.width = scrolled + '%';
    });


    // ============================================================
    // 6. INTERSECTION OBSERVERS
    // More efficient than scroll events for watching elements
    // Browser tells us when elements enter/exit the viewport
    // ============================================================

    // Active nav highlight — fires when a section is 45% visible
    const navObserver = new IntersectionObserver(entries => {
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

    sections.forEach(s => navObserver.observe(s));


    // Fade in sections — fires when 10% of a section is visible
    // Section starts at opacity 0 and shifted down 20px
    // Observer adds the transition back to visible position
    const fadeObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity   = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    sectionEls.forEach(el => {
        el.style.opacity    = '0';
        el.style.transform  = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObs.observe(el);
    });


    // ============================================================
    // 7. INITIALIZATION
    // Everything that runs once on page load
    // ============================================================

    // Three layers of stars — more stars on near layer = more density effect
    generateStars('stars-far',  30);
generateStars('stars-mid',  35);
generateStars('stars-near', 40);
generateEmbers(15);

    // Start the parallax render loop
    parallaxLoop();

    // Set up typewriter HTML then assign wordEl and start
    typeEl.innerHTML = '<span id="tw-word"></span><span class="typewriter-cursor"></span>';
    wordEl = document.getElementById('tw-word');
    typeWrite();

}); // end DOMContentLoaded