// main.js - Core UI functions (NO auth logic – that's in auth.js)

// Scroll animation observer
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// Mobile sidebar toggle
function initSidebar() {
    const sidebar = document.getElementById('mobileSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const hamburger = document.getElementById('hamburgerBtn');
    const closeBtn = document.getElementById('sidebarClose');

    if (!sidebar || !hamburger) return;

    hamburger.addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    function closeSidebar() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn?.addEventListener('click', closeSidebar);
    overlay?.addEventListener('click', closeSidebar);

    // Close on link click inside sidebar
    sidebar.querySelectorAll('.sidebar-link').forEach(link => {
        link.addEventListener('click', () => {
            setTimeout(closeSidebar, 150);
        });
    });
}

// Navigation link active state
function initNavigation() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a, .sidebar-nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// FAQ accordion
function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isActive = item.classList.contains('active');
            // Close all
            document.querySelectorAll('.faq-item').forEach(el => el.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Template selection: redirect to form.html with template ID
function initTemplateSelection() {
    document.querySelectorAll('.select-template-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const templateId = btn.getAttribute('data-template');
            // Store selected template in localStorage
            localStorage.setItem('selectedTemplate', templateId);
            window.location.href = 'form.html';
        });
    });
}
