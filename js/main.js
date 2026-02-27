window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 600);
    }
});

function updateNavbarAndProgress() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.classList.toggle('is-scrolled', window.scrollY > 10);
    }

    const progress = document.querySelector('.scroll-progress');
    if (progress) {
        const doc = document.documentElement;
        const scrollTop = doc.scrollTop || document.body.scrollTop;
        const scrollHeight = doc.scrollHeight - doc.clientHeight;
        const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        progress.style.width = `${pct}%`;
    }
}

window.addEventListener('scroll', updateNavbarAndProgress, { passive: true });
window.addEventListener('load', updateNavbarAndProgress);

function initThemeToggle() {
    const root = document.documentElement;
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved || (prefersDark ? 'dark' : 'light');

    if (initial === 'dark') {
        root.setAttribute('data-theme', 'dark');
    } else {
        root.removeAttribute('data-theme');
    }

    const toggles = document.querySelectorAll('[data-theme-toggle]');
    toggles.forEach(btn => {
        btn.addEventListener('click', () => {
            const isDark = root.getAttribute('data-theme') === 'dark';
            if (isDark) {
                root.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                root.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    });
}

function initHeroSlider() {
    const slider = document.querySelector('.hero-slider');
    if (!slider) return;

    const slides = Array.from(slider.querySelectorAll('.slide'));
    const dotsContainer = document.querySelector('.slider-dots');
    if (slides.length <= 1 || !dotsContainer) return;

    let current = slides.findIndex(s => s.classList.contains('active'));
    if (current < 0) current = 0;

    dotsContainer.innerHTML = '';
    const dots = slides.map((_, idx) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'slider-dot' + (idx === current ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
        dot.addEventListener('click', () => {
            goTo(idx);
            restart();
        });
        dotsContainer.appendChild(dot);
        return dot;
    });

    function goTo(idx) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = idx;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
    }

    function next() {
        goTo((current + 1) % slides.length);
    }

    let timer = null;
    function restart() {
        if (timer) window.clearInterval(timer);
        timer = window.setInterval(next, 6000);
    }

    restart();
}

function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
        counters.forEach(el => {
            const end = Number(el.getAttribute('data-counter'));
            const suffix = el.getAttribute('data-suffix') || '';
            el.textContent = `${end}${suffix}`;
        });
        return;
    }

    const animate = (el) => {
        const end = Number(el.getAttribute('data-counter'));
        const suffix = el.getAttribute('data-suffix') || '';
        const duration = Number(el.getAttribute('data-duration')) || 1200;
        const startTime = performance.now();

        function tick(now) {
            const t = Math.min(1, (now - startTime) / duration);
            const value = Math.floor(end * (0.15 + 0.85 * t));
            el.textContent = `${value}${suffix}`;
            if (t < 1) requestAnimationFrame(tick);
            else el.textContent = `${end}${suffix}`;
        }

        requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            if (el.getAttribute('data-done') === '1') return;
            el.setAttribute('data-done', '1');
            animate(el);
        });
    }, { threshold: 0.35 });

    counters.forEach(el => io.observe(el));
}

function initContactForm() {
    const form = document.querySelector('[data-contact-form]');
    if (!form) return;

    const success = form.querySelector('[data-form-success]');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (success) success.style.display = 'block';
        form.reset();
    });
}

window.addEventListener('load', () => {
    initThemeToggle();
    initHeroSlider();
    initCounters();
    initContactForm();
});

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });

        if (navMenu) navMenu.classList.remove('active');
    });
});
