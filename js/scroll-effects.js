function revealOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight - 100) {
            el.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);
