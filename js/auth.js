// js/auth.js - Real Firebase Authentication

// Google provider
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Login form handler
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
      // Sign in with Firebase
      auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Signed in
          window.location.href = 'dashboard.html';
        })
        .catch((error) => {
          document.getElementById('loginPasswordError').textContent =
            error.message.replace('Firebase: ', '');
        });
    }
  });

  // Google login button
  document.getElementById('googleLoginBtn')?.addEventListener('click', () => {
    auth.signInWithPopup(googleProvider)
      .then((result) => {
        window.location.href = 'dashboard.html';
      })
      .catch((error) => {
        console.error('Google sign-in error:', error);
        alert('Google sign-in failed. Please try again.');
      });
  });
}

// Signup form handler
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
      auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Set display name
          return userCredential.user.updateProfile({ displayName: name });
        })
        .then(() => {
          window.location.href = 'dashboard.html';
        })
        .catch((error) => {
          document.getElementById('signupEmailError').textContent =
            error.message.replace('Firebase: ', '');
        });
    }
  });

  // Google signup button
  document.getElementById('googleSignupBtn')?.addEventListener('click', () => {
    auth.signInWithPopup(googleProvider)
      .then((result) => {
        window.location.href = 'dashboard.html';
      })
      .catch((error) => {
        console.error('Google sign-in error:', error);
        alert('Google sign-in failed. Please try again.');
      });
  });
}

// Sign out
function logout() {
  auth.signOut().then(() => {
    window.location.href = 'login.html';
  }).catch((error) => {
    console.error('Sign out error:', error);
  });
}

// Check auth state on protected pages
function checkAuth() {
  auth.onAuthStateChanged((user) => {
    const protectedPages = ['dashboard.html', 'form.html'];
    const currentPage = window.location.pathname.split('/').pop();
    if (protectedPages.includes(currentPage)) {
      if (!user) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
      }
    }
  });
}

// Update UI based on auth state (reactive)
function updateAuthUI() {
  auth.onAuthStateChanged((user) => {
    const navLogin = document.getElementById('navLogin');
    const navSignup = document.getElementById('navSignup');
    const navDashboard = document.getElementById('navDashboard');
    const navLogout = document.getElementById('navLogout');
    const navLogoutForm = document.getElementById('navLogoutForm');
    const navLogoutDash = document.getElementById('navLogoutDash');

    const sidebarLogin = document.getElementById('sidebarLoginLink');
    const sidebarSignup = document.getElementById('sidebarSignupLink');
    const sidebarDashboard = document.getElementById('sidebarDashboardLink');
    const sidebarLogout = document.getElementById('sidebarLogoutLink');
    const sidebarLogoutForm = document.getElementById('sidebarLogoutForm');
    const sidebarLogoutDash = document.getElementById('sidebarLogoutDash');

    if (user) {
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

    // Attach logout click handlers
    document.querySelectorAll('#navLogout, #navLogoutForm, #navLogoutDash, #sidebarLogoutLink, #sidebarLogoutForm, #sidebarLogoutDash')
      .forEach(btn => {
        if (btn) {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
          });
        }
      });
  });
}

// Execute check on page load
document.addEventListener('DOMContentLoaded', checkAuth);
