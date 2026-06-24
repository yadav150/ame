// ==================== FIREBASE CONFIG (PLACEHOLDER) ====================
// Replace with your own Firebase project configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ==================== DOM ELEMENTS ====================
// Auth UI
const loginBtnNav = document.getElementById('login-btn-nav');
const signupBtnNav = document.getElementById('signup-btn-nav');
const userMenu = document.getElementById('user-menu');
const userEmailDisplay = document.getElementById('user-email-display');
const logoutBtnNav = document.getElementById('logout-btn-nav');
const loginModalOverlay = document.getElementById('login-modal-overlay');
const signupModalOverlay = document.getElementById('signup-modal-overlay');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

// Toast
const toastContainer = document.getElementById('toast-container');

// Scroll fade-in
const fadeSections = document.querySelectorAll('.fade-in-section');

// Resume Builder specific (will be null on index page)
const buildResumeBtn = document.getElementById('build-resume-btn');
const fullNameInput = document.getElementById('fullName');
const profTitleInput = document.getElementById('profTitle');
const photoUpload = document.getElementById('photoUpload');
const photoPreview = document.getElementById('photoPreview');
const declarationPlace = document.getElementById('declarationPlace');
const resumeTemplate = document.getElementById('resume-template');
const loadingOverlay = document.getElementById('loading-overlay');

// ==================== AUTH STATE OBSERVER ====================
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in
        if (loginBtnNav) loginBtnNav.classList.add('hidden');
        if (signupBtnNav) signupBtnNav.classList.add('hidden');
        if (userMenu) userMenu.classList.remove('hidden');
        if (userEmailDisplay) userEmailDisplay.textContent = user.email;
    } else {
        // No user
        if (loginBtnNav) loginBtnNav.classList.remove('hidden');
        if (signupBtnNav) signupBtnNav.classList.remove('hidden');
        if (userMenu) userMenu.classList.add('hidden');
    }
});

// ==================== AUTH FUNCTIONS ====================
function openLoginModal() {
    loginModalOverlay.classList.remove('hidden');
}
function closeLoginModal() {
    loginModalOverlay.classList.add('hidden');
}
function openSignupModal() {
    signupModalOverlay.classList.remove('hidden');
}
function closeSignupModal() {
    signupModalOverlay.classList.add('hidden');
}
function switchToSignup(e) {
    e.preventDefault();
    closeLoginModal();
    openSignupModal();
}
function switchToLogin(e) {
    e.preventDefault();
    closeSignupModal();
    openLoginModal();
}

async function handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('login-submit-btn');
    btn.disabled = true;
    btn.textContent = 'Logging in...';
    try {
        await auth.signInWithEmailAndPassword(email, password);
        closeLoginModal();
        showToast('✅ Welcome back!');
    } catch (error) {
        showToast('❌ ' + error.message);
    } finally {
        btn.disabled = false;
        btn.textContent = '🔑 Log In';
    }
}

async function handleSignupSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    if (password !== confirm) {
        showToast('❌ Passwords do not match');
        return;
    }
    const btn = document.getElementById('signup-submit-btn');
    btn.disabled = true;
    btn.textContent = 'Creating...';
    try {
        const result = await auth.createUserWithEmailAndPassword(email, password);
        await result.user.updateProfile({ displayName: name });
        closeSignupModal();
        showToast('🎉 Account created successfully!');
    } catch (error) {
        showToast('❌ ' + error.message);
    } finally {
        btn.disabled = false;
        btn.textContent = '✨ Create Account';
    }
}

async function handleGoogleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        await auth.signInWithPopup(provider);
        closeLoginModal();
        showToast('✅ Signed in with Google');
    } catch (error) {
        showToast('❌ ' + error.message);
    }
}

async function handleLogout() {
    try {
        await auth.signOut();
        showToast('👋 Logged out');
    } catch (error) {
        showToast('❌ Logout failed');
    }
}

async function handleForgotPassword(e) {
    e.preventDefault();
    const email = prompt('Enter your email address to reset password:');
    if (!email) return;
    try {
        await auth.sendPasswordResetEmail(email);
        showToast('📧 Password reset email sent!');
    } catch (error) {
        showToast('❌ ' + error.message);
    }
}

// ==================== TOAST ====================
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

// ==================== MOBILE MENU ====================
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// ==================== SCROLL FADE-IN ====================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, { threshold: 0.15 });

fadeSections.forEach(section => observer.observe(section));

// ==================== DYNAMIC DATE ====================
function getCurrentDateFormatted() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

// Set current year in footers
const yearSpans = document.querySelectorAll('#current-year, #current-year-form');
yearSpans.forEach(span => span.textContent = new Date().getFullYear());

// ==================== RESUME BUILDER LOGIC ====================
if (buildResumeBtn) {
    // Photo preview
    photoUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(ev) {
                photoPreview.src = ev.target.result;
                photoPreview.classList.remove('hidden');
                updatePreview();
            };
            reader.readAsDataURL(file);
        }
    });

    // Add More Handlers
    document.getElementById('add-education').addEventListener('click', () => addEducationEntry());
    document.getElementById('add-experience').addEventListener('click', () => addExperienceEntry());
    document.getElementById('add-project').addEventListener('click', () => addProjectEntry());
    document.getElementById('add-certification').addEventListener('click', () => addCertificationEntry());
    document.getElementById('add-achievement').addEventListener('click', () => addAchievementEntry());
    document.getElementById('add-skill').addEventListener('click', () => addSkillInput());
    document.getElementById('add-language').addEventListener('click', () => addLanguageEntry());
    document.getElementById('add-interest').addEventListener('click', () => addInterestInput());

    // Initial entries
    addEducationEntry(); addExperienceEntry(); addProjectEntry();
    addCertificationEntry(); addAchievementEntry();
    addSkillInput(); addLanguageEntry(); addInterestInput();

    // Live Preview
    const allInputs = document.querySelector('.form-panel');
    allInputs.addEventListener('input', updatePreview);
    allInputs.addEventListener('change', updatePreview);

    // Build Resume PDF
    buildResumeBtn.addEventListener('click', generatePDF);
}

function addEducationEntry() {
    const container = document.getElementById('education-container');
    const entry = document.createElement('div');
    entry.className = 'education-entry dynamic-entry';
    entry.innerHTML = `
        <div class="form-grid">
            <div class="input-group"><label>Qualification</label><input type="text" class="edu-qualification" placeholder="e.g., B.Tech"></div>
            <div class="input-group"><label>Institution / University</label><input type="text" class="edu-institution" placeholder="University"></div>
            <div class="input-group"><label>Board</label><input type="text" class="edu-board" placeholder="Board"></div>
            <div class="input-group"><label>Year</label><input type="text" class="edu-year" placeholder="2023"></div>
            <div class="input-group"><label>Percentage / CGPA</label><input type="text" class="edu-percentage" placeholder="8.5"></div>
            <div class="input-group full-width"><label>Description</label><textarea class="edu-desc" rows="2"></textarea></div>
        </div>
        <button type="button" class="btn-remove-entry">🗑️</button>
    `;
    container.appendChild(entry);
    entry.querySelector('.btn-remove-entry').addEventListener('click', () => {
        entry.remove();
        updatePreview();
    });
    entry.querySelectorAll('input, textarea').forEach(input => input.addEventListener('input', updatePreview));
}

function addExperienceEntry() {
    const container = document.getElementById('experience-container');
    const entry = document.createElement('div');
    entry.className = 'experience-entry dynamic-entry';
    entry.innerHTML = `
        <div class="form-grid">
            <div class="input-group"><label>Job Title</label><input type="text" class="exp-title"></div>
            <div class="input-group"><label>Company</label><input type="text" class="exp-company"></div>
            <div class="input-group"><label>Type</label><input type="text" class="exp-type"></div>
            <div class="input-group"><label>Start Date</label><input type="text" class="exp-start"></div>
            <div class="input-group"><label>End Date</label><input type="text" class="exp-end"></div>
            <div class="input-group full-width"><label>Responsibilities</label><textarea class="exp-desc" rows="3"></textarea></div>
        </div>
        <button type="button" class="btn-remove-entry">🗑️</button>
    `;
    container.appendChild(entry);
    entry.querySelector('.btn-remove-entry').addEventListener('click', () => {
        entry.remove();
        updatePreview();
    });
    entry.querySelectorAll('input, textarea').forEach(input => input.addEventListener('input', updatePreview));
}

function addProjectEntry() {
    const container = document.getElementById('projects-container');
    const entry = document.createElement('div');
    entry.className = 'project-entry dynamic-entry';
    entry.innerHTML = `
        <div class="form-grid">
            <div class="input-group"><label>Project Name</label><input type="text" class="proj-name"></div>
            <div class="input-group"><label>Technologies</label><input type="text" class="proj-tech"></div>
            <div class="input-group"><label>Link</label><input type="url" class="proj-link"></div>
            <div class="input-group full-width"><label>Description</label><textarea class="proj-desc" rows="3"></textarea></div>
        </div>
        <button type="button" class="btn-remove-entry">🗑️</button>
    `;
    container.appendChild(entry);
    entry.querySelector('.btn-remove-entry').addEventListener('click', () => {
        entry.remove();
        updatePreview();
    });
    entry.querySelectorAll('input, textarea').forEach(input => input.addEventListener('input', updatePreview));
}

function addCertificationEntry() {
    const container = document.getElementById('certifications-container');
    const entry = document.createElement('div');
    entry.className = 'certification-entry dynamic-entry';
    entry.innerHTML = `
        <div class="form-grid">
            <div class="input-group"><label>Certificate Name</label><input type="text" class="cert-name"></div>
            <div class="input-group"><label>Organization</label><input type="text" class="cert-org"></div>
            <div class="input-group"><label>Date</label><input type="text" class="cert-date"></div>
            <div class="input-group"><label>Credential Link</label><input type="url" class="cert-link"></div>
        </div>
        <button type="button" class="btn-remove-entry">🗑️</button>
    `;
    container.appendChild(entry);
    entry.querySelector('.btn-remove-entry').addEventListener('click', () => {
        entry.remove();
        updatePreview();
    });
    entry.querySelectorAll('input').forEach(input => input.addEventListener('input', updatePreview));
}

function addAchievementEntry() {
    const container = document.getElementById('achievements-container');
    const entry = document.createElement('div');
    entry.className = 'achievement-entry dynamic-entry';
    entry.innerHTML = `
        <div class="form-grid">
            <div class="input-group"><label>Title</label><input type="text" class="achieve-title"></div>
            <div class="input-group"><label>Year</label><input type="text" class="achieve-year"></div>
            <div class="input-group full-width"><label>Description</label><textarea class="achieve-desc" rows="2"></textarea></div>
        </div>
        <button type="button" class="btn-remove-entry">🗑️</button>
    `;
    container.appendChild(entry);
    entry.querySelector('.btn-remove-entry').addEventListener('click', () => {
        entry.remove();
        updatePreview();
    });
    entry.querySelectorAll('input, textarea').forEach(input => input.addEventListener('input', updatePreview));
}

function addSkillInput() {
    const container = document.getElementById('skills-container');
    const row = document.createElement('div');
    row.className = 'skills-input-row';
    row.innerHTML = `
        <input type="text" class="skill-input" placeholder="e.g., JavaScript">
        <button type="button" class="btn-remove-skill">✕</button>
    `;
    container.appendChild(row);
    row.querySelector('.btn-remove-skill').addEventListener('click', () => {
        row.remove();
        updatePreview();
    });
    row.querySelector('.skill-input').addEventListener('input', updatePreview);
}

function addLanguageEntry() {
    const container = document.getElementById('languages-container');
    const entry = document.createElement('div');
    entry.className = 'language-entry dynamic-entry';
    entry.innerHTML = `
        <div class="form-grid">
            <div class="input-group"><label>Language</label><input type="text" class="lang-name"></div>
            <div class="input-group"><label>Proficiency</label>
                <select class="lang-proficiency">
                    <option value="Native">Native</option>
                    <option value="Fluent">Fluent</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Basic">Basic</option>
                </select>
            </div>
        </div>
        <button type="button" class="btn-remove-entry">🗑️</button>
    `;
    container.appendChild(entry);
    entry.querySelector('.btn-remove-entry').addEventListener('click', () => {
        entry.remove();
        updatePreview();
    });
    entry.querySelectorAll('input, select').forEach(el => el.addEventListener('input', updatePreview));
}

function addInterestInput() {
    const container = document.getElementById('interests-container');
    const row = document.createElement('div');
    row.className = 'interests-input-row';
    row.innerHTML = `
        <input type="text" class="interest-input" placeholder="e.g., Photography">
        <button type="button" class="btn-remove-interest">✕</button>
    `;
    container.appendChild(row);
    row.querySelector('.btn-remove-interest').addEventListener('click', () => {
        row.remove();
        updatePreview();
    });
    row.querySelector('.interest-input').addEventListener('input', updatePreview);
}

// ==================== LIVE PREVIEW UPDATE ====================
function updatePreview() {
    if (!resumeTemplate) return;

    const fullName = fullNameInput.value || 'Your Name';
    const title = profTitleInput.value || 'Professional Title';
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const village = document.getElementById('village').value;
    const district = document.getElementById('district').value;
    const state = document.getElementById('state').value;
    const pincode = document.getElementById('pincode').value;
    const linkedin = document.getElementById('linkedin').value;
    const website = document.getElementById('website').value;
    const photoSrc = photoPreview.src;

    // Build contact string
    let contactParts = [];
    if (phone) contactParts.push(`📞 ${phone}`);
    if (email) contactParts.push(`✉️ ${email}`);
    let addressParts = [address, village, district, state, pincode].filter(Boolean);
    if (addressParts.length) contactParts.push(`📍 ${addressParts.join(', ')}`);
    if (linkedin) contactParts.push(`🔗 ${linkedin}`);
    if (website) contactParts.push(`🌐 ${website}`);

    // Education
    const eduEntries = document.querySelectorAll('.education-entry');
    let eduHTML = '';
    eduEntries.forEach(entry => {
        const qual = entry.querySelector('.edu-qualification')?.value;
        const inst = entry.querySelector('.edu-institution')?.value;
        const board = entry.querySelector('.edu-board')?.value;
        const year = entry.querySelector('.edu-year')?.value;
        const perc = entry.querySelector('.edu-percentage')?.value;
        const desc = entry.querySelector('.edu-desc')?.value;
        if (qual || inst) {
            eduHTML += `<div class="entry"><strong>${qual || ''}</strong> - ${inst || ''}<br>`;
            if (board) eduHTML += `${board} | `;
            if (year) eduHTML += `${year} | `;
            if (perc) eduHTML += `${perc}`;
            if (desc) eduHTML += `<br><small>${desc}</small>`;
            eduHTML += `</div>`;
        }
    });

    // Experience
    const expEntries = document.querySelectorAll('.experience-entry');
    let expHTML = '';
    expEntries.forEach(entry => {
        const job = entry.querySelector('.exp-title')?.value;
        const comp = entry.querySelector('.exp-company')?.value;
        const type = entry.querySelector('.exp-type')?.value;
        const start = entry.querySelector('.exp-start')?.value;
        const end = entry.querySelector('.exp-end')?.value;
        const desc = entry.querySelector('.exp-desc')?.value;
        if (job || comp) {
            expHTML += `<div class="entry"><strong>${job || ''}</strong> at ${comp || ''} (${type || ''})<br>`;
            if (start || end) expHTML += `${start || ''} - ${end || ''}<br>`;
            if (desc) expHTML += `<small>${desc}</small>`;
            expHTML += `</div>`;
        }
    });

    // Projects
    const projEntries = document.querySelectorAll('.project-entry');
    let projHTML = '';
    projEntries.forEach(entry => {
        const name = entry.querySelector('.proj-name')?.value;
        const tech = entry.querySelector('.proj-tech')?.value;
        const link = entry.querySelector('.proj-link')?.value;
        const desc = entry.querySelector('.proj-desc')?.value;
        if (name) {
            projHTML += `<div class="entry"><strong>${name}</strong> (${tech || ''})<br>`;
            if (link) projHTML += `<a href="${link}" target="_blank">${link}</a><br>`;
            if (desc) projHTML += `<small>${desc}</small>`;
            projHTML += `</div>`;
        }
    });

    // Certifications
    const certEntries = document.querySelectorAll('.certification-entry');
    let certHTML = '';
    certEntries.forEach(entry => {
        const name = entry.querySelector('.cert-name')?.value;
        const org = entry.querySelector('.cert-org')?.value;
        const date = entry.querySelector('.cert-date')?.value;
        const link = entry.querySelector('.cert-link')?.value;
        if (name) {
            certHTML += `<div class="entry"><strong>${name}</strong> - ${org || ''} (${date || ''})<br>`;
            if (link) certHTML += `<a href="${link}">Credential</a>`;
            certHTML += `</div>`;
        }
    });

    // Achievements
    const achieveEntries = document.querySelectorAll('.achievement-entry');
    let achieveHTML = '';
    achieveEntries.forEach(entry => {
        const title = entry.querySelector('.achieve-title')?.value;
        const year = entry.querySelector('.achieve-year')?.value;
        const desc = entry.querySelector('.achieve-desc')?.value;
        if (title) {
            achieveHTML += `<div class="entry"><strong>${title}</strong> (${year || ''})<br><small>${desc || ''}</small></div>`;
        }
    });

    // Skills
    const skillInputs = document.querySelectorAll('.skill-input');
    let skillsArr = [];
    skillInputs.forEach(inp => { if (inp.value.trim()) skillsArr.push(inp.value.trim()); });
    const skillsHTML = skillsArr.length ? skillsArr.join(' • ') : '';

    // Languages
    const langEntries = document.querySelectorAll('.language-entry');
    let langHTML = '';
    langEntries.forEach(entry => {
        const lang = entry.querySelector('.lang-name')?.value;
        const prof = entry.querySelector('.lang-proficiency')?.value;
        if (lang) langHTML += `<div>${lang} - ${prof}</div>`;
    });

    // Interests
    const interestInputs = document.querySelectorAll('.interest-input');
    let interestsArr = [];
    interestInputs.forEach(inp => { if (inp.value.trim()) interestsArr.push(inp.value.trim()); });
    const interestsHTML = interestsArr.length ? interestsArr.join(', ') : '';

    // Declaration
    const place = declarationPlace?.value || '';
    const date = getCurrentDateFormatted();

    // Build preview
    let html = `
        <div style="display: flex; justify-content: space-between; align-items: start;">
            <div>
                <h2>${fullName}</h2>
                <h3>${title}</h3>
            </div>
            ${photoSrc ? `<img src="${photoSrc}" class="resume-photo" alt="Profile">` : ''}
        </div>
        <div class="contact-row">${contactParts.join(' | ')}</div>
        <div class="section-title">Objective</div>
        <p class="objective-text">To work with an organization where I can utilize my skills, learn new technologies, improve my abilities, and contribute effectively towards organizational goals while achieving personal and professional growth.</p>
    `;

    if (skillsHTML) html += `<div class="section-title">Skills</div><p>${skillsHTML}</p>`;
    if (expHTML) html += `<div class="section-title">Work Experience</div>${expHTML}`;
    if (projHTML) html += `<div class="section-title">Projects</div>${projHTML}`;
    if (eduHTML) html += `<div class="section-title">Education</div>${eduHTML}`;
    if (certHTML) html += `<div class="section-title">Certifications</div>${certHTML}`;
    if (achieveHTML) html += `<div class="section-title">Achievements</div>${achieveHTML}`;
    if (langHTML) html += `<div class="section-title">Languages</div>${langHTML}`;
    if (interestsHTML) html += `<div class="section-title">Interests</div><p>${interestsHTML}</p>`;

    html += `
        <div class="section-title">Declaration</div>
        <p>I hereby declare that the above particulars of facts and information stated are true, correct and complete to the best of my belief and knowledge.</p>
        <div style="display: flex; justify-content: space-between; margin-top: 1.5rem;">
            <div><strong>Date:</strong> ${date}<br><strong>Place:</strong> ${place || '________'}</div>
            <div style="text-align: right;"><strong>${fullName}</strong></div>
        </div>
    `;

    resumeTemplate.innerHTML = html;
}

// ==================== PDF GENERATION ====================
function generatePDF() {
    if (!fullNameInput.value.trim()) {
        showToast('⚠️ Please enter your full name.');
        return;
    }
    loadingOverlay.classList.remove('hidden');

    const element = document.getElementById('resume-template');
    const opt = {
        margin:        [0.5, 0.5, 0.5, 0.5],
        filename:      `${fullNameInput.value.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, letterRendering: true, useCORS: true },
        jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        loadingOverlay.classList.add('hidden');
        showToast('🎉 Resume downloaded successfully!');
    }).catch(() => {
        loadingOverlay.classList.add('hidden');
        showToast('❌ PDF generation failed. Try again.');
    });
}
