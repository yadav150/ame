// main.js - Core UI functions

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

// Update UI based on auth state
function updateAuthUI() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userName = localStorage.getItem('userName') || '';

    // Navbar links
    const navLogin = document.getElementById('navLogin');
    const navSignup = document.getElementById('navSignup');
    const navDashboard = document.getElementById('navDashboard');
    const navLogout = document.getElementById('navLogout');
    const navLogoutForm = document.getElementById('navLogoutForm');
    const navLogoutDash = document.getElementById('navLogoutDash');

    // Sidebar links
    const sidebarLogin = document.getElementById('sidebarLoginLink');
    const sidebarSignup = document.getElementById('sidebarSignupLink');
    const sidebarDashboard = document.getElementById('sidebarDashboardLink');
    const sidebarLogout = document.getElementById('sidebarLogoutLink');
    const sidebarLogoutForm = document.getElementById('sidebarLogoutForm');
    const sidebarLogoutDash = document.getElementById('sidebarLogoutDash');

    if (isLoggedIn) {
        if (navLogin) navLogin.style.display = 'none';
        if (navSignup) navSignup.style.display = 'none';
        if (navDashboard) navDashboard.style.display = 'inline-block';
        if (navLogout) navLogout.style.display = 'inline-block';
        if (navLogoutForm) navLogoutForm.style.display = 'inline-block';
        if (navLogoutDash) navLogoutDash.style.display = 'inline-block';

        if (sidebarLogin) sidebarLogin.style.display = 'none';
        if (sidebarSignup) sidebarSignup.style.display = 'none';
        if (sidebarDashboard) sidebarDashboard.style.display = 'block';
        if (sidebarLogout) sidebarLogout.style.display = 'block';
        if (sidebarLogoutForm) sidebarLogoutForm.style.display = 'block';
        if (sidebarLogoutDash) sidebarLogoutDash.style.display = 'block';
    } else {
        if (navLogin) navLogin.style.display = 'inline-block';
        if (navSignup) navSignup.style.display = 'inline-block';
        if (navDashboard) navDashboard.style.display = 'none';
        if (navLogout) navLogout.style.display = 'none';
        if (navLogoutForm) navLogoutForm.style.display = 'none';
        if (navLogoutDash) navLogoutDash.style.display = 'none';

        if (sidebarLogin) sidebarLogin.style.display = 'block';
        if (sidebarSignup) sidebarSignup.style.display = 'block';
        if (sidebarDashboard) sidebarDashboard.style.display = 'none';
        if (sidebarLogout) sidebarLogout.style.display = 'none';
        if (sidebarLogoutForm) sidebarLogoutForm.style.display = 'none';
        if (sidebarLogoutDash) sidebarLogoutDash.style.display = 'none';
    }

    // Set up logout buttons
    document.querySelectorAll('#navLogout, #navLogoutForm, #navLogoutDash, #sidebarLogoutLink, #sidebarLogoutForm, #sidebarLogoutDash')
        .forEach(btn => {
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    logout();
                });
            }
        });
}

// Logout function
function logout() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'login.html';
}
