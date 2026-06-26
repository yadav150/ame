// signup.js
const firebaseConfig = {
    apiKey: "AIzaSyBLX-DBrAZZgi7OGRW3-oeno0PJsZ9hzEg",
    authDomain: "its-me-ame.firebaseapp.com",
    projectId: "its-me-ame",
    storageBucket: "its-me-ame.firebasestorage.app",
    messagingSenderId: "832380884001",
    appId: "1:832380884001:web:0c9239588ceb8d8995bf60"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Navbar
const authLink = document.getElementById('authLink');
const userDisplay = document.getElementById('userDisplay');
const userNameSpan = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');
const dashboardLink = document.getElementById('dashboardLink');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');
hamburgerBtn.addEventListener('click', () => navLinks.classList.toggle('show'));

auth.onAuthStateChanged(user => {
    if (user) {
        authLink.style.display = 'none';
        userDisplay.style.display = 'flex';
        userNameSpan.textContent = user.displayName || user.email;
        dashboardLink.style.display = 'inline-block';
    } else {
        authLink.style.display = 'block';
        userDisplay.style.display = 'none';
        dashboardLink.style.display = 'none';
    }
});
logoutBtn.addEventListener('click', () => auth.signOut().then(() => window.location.href = 'index.html'));

// Sign Up logic
const errorDiv = document.getElementById('authError');
document.getElementById('signupForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    errorDiv.style.display = 'none';
    if (!name || !email || !password) {
        errorDiv.textContent = 'Please fill in all fields.';
        errorDiv.style.display = 'block';
        return;
    }
    auth.createUserWithEmailAndPassword(email, password)
        .then(userCredential => {
            return userCredential.user.updateProfile({ displayName: name });
        })
        .then(() => window.location.href = 'dashboard.html')
        .catch(error => {
            errorDiv.textContent = error.message;
            errorDiv.style.display = 'block';
        });
});

document.getElementById('googleSignupBtn').addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    errorDiv.style.display = 'none';
    auth.signInWithPopup(provider)
        .then(() => window.location.href = 'dashboard.html')
        .catch(error => {
            errorDiv.textContent = error.message;
            errorDiv.style.display = 'block';
        });
});
