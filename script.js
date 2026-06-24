// ===== Navbar Toggle (Mobile) =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        navToggle.innerHTML = navLinks.classList.contains('open')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    });
}

// ===== Sticky Navbar =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Scroll to Top =====
const scrollBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
    scrollBtn.classList.toggle('visible', window.scrollY > 400);
});
scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== FAQ Accordion =====
document.querySelectorAll('.faq__question').forEach(btn => {
    btn.addEventListener('click', () => {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', !expanded);
        const answer = btn.nextElementSibling;
        if (!expanded) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
            answer.style.maxHeight = '0';
        }
    });
});

// ===== Fade-in on scroll (Intersection Observer) =====
const fadeEls = document.querySelectorAll('.feature-card, .template-card, .step, .testimonial-card, .faq__item, .why-choose__content, .why-choose__visual');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });
fadeEls.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===== Close mobile nav on link click =====
document.querySelectorAll('.navbar__links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        if (navToggle) navToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
});
