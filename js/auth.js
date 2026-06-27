// auth.js - Login/Signup simulation with localStorage

function initLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        let valid = true;

        // Clear errors
        document.getElementById('loginEmailError').textContent = '';
        document.getElementById('loginPasswordError').textContent = '';

        if (!email) {
            document.getElementById('loginEmailError').textContent = 'Email is required';
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            document.getElementById('loginEmailError').textContent = 'Invalid email format';
            valid = false;
        }

        if (!password) {
            document.getElementById('loginPasswordError').textContent = 'Password is required';
            valid = false;
        } else if (password.length < 6) {
            document.getElementById('loginPasswordError').textContent = 'Minimum 6 characters';
            valid = false;
        }

        if (valid) {
            // Simulate login
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', email.split('@')[0]);
            localStorage.setItem('isLoggedIn', 'true');

            // Redirect to dashboard or previous page
            window.location.href = 'dashboard.html';
        }
    });
}

function initSignupForm() {
    const form = document.getElementById('signupForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const confirm = document.getElementById('signupConfirm').value;
        let valid = true;

        // Clear errors
        ['signupNameError', 'signupEmailError', 'signupPasswordError', 'signupConfirmError'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = '';
        });

        if (!name) {
            document.getElementById('signupNameError').textContent = 'Name is required';
            valid = false;
        }
        if (!email) {
            document.getElementById('signupEmailError').textContent = 'Email is required';
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            document.getElementById('signupEmailError').textContent = 'Invalid email';
            valid = false;
        }
        if (!password || password.length < 6) {
            document.getElementById('signupPasswordError').textContent = 'Minimum 6 characters';
            valid = false;
        }
        if (password !== confirm) {
            document.getElementById('signupConfirmError').textContent = 'Passwords do not match';
            valid = false;
        }

        if (valid) {
            // Simulate signup - auto login
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', name);
            localStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'dashboard.html';
        }
    });
}

// Check auth on protected pages
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const protectedPages = ['dashboard.html', 'form.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage) && !isLoggedIn) {
        // Save intended page
        localStorage.setItem('redirectAfterLogin', currentPage);
        window.location.href = 'login.html';
    }
}

// Run check on load
document.addEventListener('DOMContentLoaded', checkAuth);
