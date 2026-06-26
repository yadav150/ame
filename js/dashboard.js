// dashboard.js
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
const db = firebase.firestore();

// Navbar elements
const authLink = document.getElementById('authLink');
const userDisplay = document.getElementById('userDisplay');
const userNameSpan = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');
const dashboardLink = document.getElementById('dashboardLink');
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');

hamburgerBtn.addEventListener('click', () => navLinks.classList.toggle('show'));

// Dashboard elements
const sidebarLogout = document.getElementById('sidebarLogout');
const avatarLetter = document.getElementById('avatarLetter');
const welcomeName = document.getElementById('welcomeName');
const userEmailDisplay = document.getElementById('userEmailDisplay');
const resumeCards = document.getElementById('resumeCards');
const noResumesMsg = document.getElementById('noResumesMsg');

function updateUI(user) {
    if (user) {
        const displayName = user.displayName || user.email;
        const firstName = displayName.split(' ')[0] || displayName;
        const firstLetter = (user.displayName?.[0] || user.email[0]).toUpperCase();
        avatarLetter.textContent = firstLetter;
        welcomeName.textContent = `Welcome, ${firstName}`;
        userEmailDisplay.textContent = user.email;

        authLink.style.display = 'none';
        userDisplay.style.display = 'flex';
        userNameSpan.textContent = displayName;
        dashboardLink.style.display = 'inline-block';
        loadResumes(user.uid);
    } else {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
    }
}

auth.onAuthStateChanged(user => {
    if (user) updateUI(user);
    else window.location.href = 'login.html';
});

// Logout from navbar or sidebar
logoutBtn.addEventListener('click', () => auth.signOut().then(() => window.location.href = 'index.html'));
sidebarLogout.addEventListener('click', () => auth.signOut().then(() => window.location.href = 'index.html'));

function loadResumes(uid) {
    resumeCards.innerHTML = '<p class="loading-text">Loading your resumes…</p>';
    db.collection('resumes')
        .where('uid', '==', uid)
        .get()
        .then(snapshot => {
            if (snapshot.empty) {
                resumeCards.innerHTML = '';
                noResumesMsg.style.display = 'block';
                return;
            }
            noResumesMsg.style.display = 'none';
            let resumes = [];
            snapshot.forEach(doc => {
                const resume = doc.data();
                resume.id = doc.id;
                resumes.push(resume);
            });
            // Sort newest first
            resumes.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
            let html = '';
            resumes.forEach(resume => {
                const date = resume.createdAt ? resume.createdAt.toDate().toLocaleDateString() : 'N/A';
                html += `
                    <div class="resume-card">
                        <div class="card-top">
                            <h4>${resume.name || 'Unnamed'}</h4>
                            <span class="template-badge">Formal CV</span>
                        </div>
                        <p class="card-date">Created: ${date}</p>
                        <div class="card-actions">
                            <button class="cta-button small" onclick="alert('Download coming soon')">Download PDF</button>
                        </div>
                    </div>
                `;
            });
            resumeCards.innerHTML = html;
        })
        .catch(err => {
            resumeCards.innerHTML = `<p class="error-text">Error: ${err.message}</p>`;
        });
}
