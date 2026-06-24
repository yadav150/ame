// ==================== FIREBASE CONFIG (PLACEHOLDER) ====================
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ==================== DOM ELEMENTS ====================
const loginBtnNav = document.getElementById('login-btn-nav');
const signupBtnNav = document.getElementById('signup-btn-nav');
const userMenu = document.getElementById('user-menu');
const userEmailDisplay = document.getElementById('user-email-display');
const loginModalOverlay = document.getElementById('login-modal-overlay');
const signupModalOverlay = document.getElementById('signup-modal-overlay');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const toastContainer = document.getElementById('toast-container');

const buildResumeBtn = document.getElementById('build-resume-btn');
const fullNameInput = document.getElementById('fullName');
const photoUpload = document.getElementById('photoUpload');
const photoPreview = document.getElementById('photoPreview');
const resumeTemplate = document.getElementById('resume-template');
const loadingOverlay = document.getElementById('loading-overlay');
const customBgColor = document.getElementById('custom-bgcolor');
const colorPresets = document.querySelectorAll('.color-preset');

// ==================== AUTH OBSERVER ====================
auth.onAuthStateChanged(user => {
    if (user) {
        if (loginBtnNav) loginBtnNav.classList.add('hidden');
        if (signupBtnNav) signupBtnNav.classList.add('hidden');
        if (userMenu) userMenu.classList.remove('hidden');
        if (userEmailDisplay) userEmailDisplay.textContent = user.email;
    } else {
        if (loginBtnNav) loginBtnNav.classList.remove('hidden');
        if (signupBtnNav) signupBtnNav.classList.remove('hidden');
        if (userMenu) userMenu.classList.add('hidden');
    }
});

// ==================== AUTH FUNCTIONS ====================
function openLoginModal() { loginModalOverlay.classList.remove('hidden'); }
function closeLoginModal() { loginModalOverlay.classList.add('hidden'); }
function openSignupModal() { signupModalOverlay.classList.remove('hidden'); }
function closeSignupModal() { signupModalOverlay.classList.add('hidden'); }
function switchToSignup(e) { e.preventDefault(); closeLoginModal(); openSignupModal(); }
function switchToLogin(e) { e.preventDefault(); closeSignupModal(); openLoginModal(); }

async function handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('login-submit-btn');
    btn.disabled = true; btn.textContent = 'Logging in...';
    try {
        await auth.signInWithEmailAndPassword(email, password);
        closeLoginModal();
        showToast('Welcome back!');
    } catch (error) {
        showToast(error.message);
    } finally {
        btn.disabled = false; btn.textContent = 'Log In';
    }
}

async function handleSignupSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    if (password !== confirm) { showToast('Passwords do not match'); return; }
    const btn = document.getElementById('signup-submit-btn');
    btn.disabled = true; btn.textContent = 'Creating...';
    try {
        const result = await auth.createUserWithEmailAndPassword(email, password);
        await result.user.updateProfile({ displayName: name });
        closeSignupModal();
        showToast('Account created successfully!');
    } catch (error) {
        showToast(error.message);
    } finally {
        btn.disabled = false; btn.textContent = 'Create Account';
    }
}

async function handleGoogleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        await auth.signInWithPopup(provider);
        closeLoginModal();
        showToast('Signed in with Google');
    } catch (error) {
        showToast(error.message);
    }
}

async function handleLogout() {
    await auth.signOut();
    showToast('Logged out');
}

async function handleForgotPassword(e) {
    e.preventDefault();
    const email = prompt('Enter your email to reset password:');
    if (!email) return;
    try {
        await auth.sendPasswordResetEmail(email);
        showToast('Password reset email sent!');
    } catch (error) {
        showToast(error.message);
    }
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

// ==================== MOBILE MENU ====================
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => navLinks.classList.toggle('active'));
}

// ==================== DYNAMIC DATE ====================
function getCurrentDateFormatted() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}
document.querySelectorAll('#current-year-form').forEach(el => el.textContent = new Date().getFullYear());

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
    document.getElementById('add-education').addEventListener('click', addEducationEntry);
    document.getElementById('add-experience').addEventListener('click', addExperienceEntry);
    document.getElementById('add-project').addEventListener('click', addProjectEntry);
    document.getElementById('add-certification').addEventListener('click', addCertificationEntry);
    document.getElementById('add-achievement').addEventListener('click', addAchievementEntry);
    document.getElementById('add-skill').addEventListener('click', addSkillInput);
    document.getElementById('add-language').addEventListener('click', addLanguageEntry);
    document.getElementById('add-interest').addEventListener('click', addInterestInput);

    // Init entries
    addEducationEntry(); addExperienceEntry(); addProjectEntry();
    addCertificationEntry(); addAchievementEntry();
    addSkillInput(); addLanguageEntry(); addInterestInput();

    // Live preview on input
    document.querySelector('.form-panel').addEventListener('input', updatePreview);
    document.querySelector('.form-panel').addEventListener('change', updatePreview);

    // Background color
    colorPresets.forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.dataset.color;
            resumeTemplate.style.backgroundColor = color;
            customBgColor.value = color;
        });
    });
    customBgColor.addEventListener('input', () => {
        resumeTemplate.style.backgroundColor = customBgColor.value;
    });

    // Build PDF
    buildResumeBtn.addEventListener('click', generatePDF);
}

// ==================== ADD ENTRY FUNCTIONS ====================
function addEducationEntry() {
    const container = document.getElementById('education-container');
    const div = document.createElement('div');
    div.className = 'education-entry dynamic-entry';
    div.innerHTML = `
        <div class="form-grid">
            <div class="input-group"><label>Qualification</label><input type="text" class="edu-qualification"></div>
            <div class="input-group"><label>Institution</label><input type="text" class="edu-institution"></div>
            <div class="input-group"><label>Board</label><input type="text" class="edu-board"></div>
            <div class="input-group"><label>Year</label><input type="text" class="edu-year"></div>
            <div class="input-group"><label>Percentage/CGPA</label><input type="text" class="edu-percentage"></div>
            <div class="input-group full-width"><label>Description</label><textarea class="edu-desc" rows="2"></textarea></div>
        </div>
        <button type="button" class="btn-remove-entry">✕</button>
    `;
    container.appendChild(div);
    div.querySelector('.btn-remove-entry').addEventListener('click', () => { div.remove(); updatePreview(); });
    div.querySelectorAll('input, textarea').forEach(el => el.addEventListener('input', updatePreview));
}

function addExperienceEntry() {
    const container = document.getElementById('experience-container');
    const div = document.createElement('div');
    div.className = 'experience-entry dynamic-entry';
    div.innerHTML = `
        <div class="form-grid">
            <div class="input-group"><label>Job Title</label><input type="text" class="exp-title"></div>
            <div class="input-group"><label>Company</label><input type="text" class="exp-company"></div>
            <div class="input-group"><label>Type</label><input type="text" class="exp-type"></div>
            <div class="input-group"><label>Start Date</label><input type="text" class="exp-start"></div>
            <div class="input-group"><label>End Date</label><input type="text" class="exp-end"></div>
            <div class="input-group full-width"><label>Responsibilities</label><textarea class="exp-desc" rows="3"></textarea></div>
        </div>
        <button type="button" class="btn-remove-entry">✕</button>
    `;
    container.appendChild(div);
    div.querySelector('.btn-remove-entry').addEventListener('click', () => { div.remove(); updatePreview(); });
    div.querySelectorAll('input, textarea').forEach(el => el.addEventListener('input', updatePreview));
}

function addProjectEntry() {
    const container = document.getElementById('projects-container');
    const div = document.createElement('div');
    div.className = 'project-entry dynamic-entry';
    div.innerHTML = `
        <div class="form-grid">
            <div class="input-group"><label>Project Name</label><input type="text" class="proj-name"></div>
            <div class="input-group"><label>Technologies</label><input type="text" class="proj-tech"></div>
            <div class="input-group"><label>Link</label><input type="url" class="proj-link"></div>
            <div class="input-group full-width"><label>Description</label><textarea class="proj-desc" rows="3"></textarea></div>
        </div>
        <button type="button" class="btn-remove-entry">✕</button>
    `;
    container.appendChild(div);
    div.querySelector('.btn-remove-entry').addEventListener('click', () => { div.remove(); updatePreview(); });
    div.querySelectorAll('input, textarea').forEach(el => el.addEventListener('input', updatePreview));
}

function addCertificationEntry() {
    const container = document.getElementById('certifications-container');
    const div = document.createElement('div');
    div.className = 'certification-entry dynamic-entry';
    div.innerHTML = `
        <div class="form-grid">
            <div class="input-group"><label>Certificate Name</label><input type="text" class="cert-name"></div>
            <div class="input-group"><label>Organization</label><input type="text" class="cert-org"></div>
            <div class="input-group"><label>Date</label><input type="text" class="cert-date"></div>
            <div class="input-group"><label>Credential Link</label><input type="url" class="cert-link"></div>
        </div>
        <button type="button" class="btn-remove-entry">✕</button>
    `;
    container.appendChild(div);
    div.querySelector('.btn-remove-entry').addEventListener('click', () => { div.remove(); updatePreview(); });
    div.querySelectorAll('input').forEach(el => el.addEventListener('input', updatePreview));
}

function addAchievementEntry() {
    const container = document.getElementById('achievements-container');
    const div = document.createElement('div');
    div.className = 'achievement-entry dynamic-entry';
    div.innerHTML = `
        <div class="form-grid">
            <div class="input-group"><label>Title</label><input type="text" class="achieve-title"></div>
            <div class="input-group"><label>Year</label><input type="text" class="achieve-year"></div>
            <div class="input-group full-width"><label>Description</label><textarea class="achieve-desc" rows="2"></textarea></div>
        </div>
        <button type="button" class="btn-remove-entry">✕</button>
    `;
    container.appendChild(div);
    div.querySelector('.btn-remove-entry').addEventListener('click', () => { div.remove(); updatePreview(); });
    div.querySelectorAll('input, textarea').forEach(el => el.addEventListener('input', updatePreview));
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
    row.querySelector('.btn-remove-skill').addEventListener('click', () => { row.remove(); updatePreview(); });
    row.querySelector('.skill-input').addEventListener('input', updatePreview);
}

function addLanguageEntry() {
    const container = document.getElementById('languages-container');
    const div = document.createElement('div');
    div.className = 'language-entry dynamic-entry';
    div.innerHTML = `
        <div class="form-grid">
            <div class="input-group"><label>Language</label><input type="text" class="lang-name"></div>
            <div class="input-group"><label>Proficiency</label>
                <select class="lang-proficiency">
                    <option>Native</option><option>Fluent</option><option>Intermediate</option><option>Basic</option>
                </select>
            </div>
        </div>
        <button type="button" class="btn-remove-entry">✕</button>
    `;
    container.appendChild(div);
    div.querySelector('.btn-remove-entry').addEventListener('click', () => { div.remove(); updatePreview(); });
    div.querySelectorAll('input, select').forEach(el => el.addEventListener('input', updatePreview));
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
    row.querySelector('.btn-remove-interest').addEventListener('click', () => { row.remove(); updatePreview(); });
    row.querySelector('.interest-input').addEventListener('input', updatePreview);
}

// ==================== LIVE PREVIEW (New Two-Column Layout) ====================
function updatePreview() {
    if (!resumeTemplate) return;

    const fullName = fullNameInput.value || 'Your Name';
    const title = document.getElementById('profTitle').value || 'Professional Title';
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const village = document.getElementById('village').value;
    const district = document.getElementById('district').value;
    const state = document.getElementById('state').value;
    const pincode = document.getElementById('pincode').value;
    const linkedin = document.getElementById('linkedin').value;
    const website = document.getElementById('website').value;
    const twitter = document.getElementById('twitter').value;
    const instagram = document.getElementById('instagram').value;
    const facebook = document.getElementById('facebook').value;
    const profSummary = document.getElementById('profSummary').value;
    const photoSrc = photoPreview.src;

    // Contact list
    let contactItems = '';
    if (phone) contactItems += `<li>📞 ${phone}</li>`;
    if (email) contactItems += `<li>✉️ ${email}</li>`;
    const fullAddress = [address, village, district, state, pincode].filter(Boolean).join(', ');
    if (fullAddress) contactItems += `<li>📍 ${fullAddress}</li>`;

    // Social list
    let socialItems = '';
    if (linkedin) socialItems += `<li><a href="${linkedin}">LinkedIn</a></li>`;
    if (twitter) socialItems += `<li><a href="${twitter}">Twitter/X</a></li>`;
    if (instagram) socialItems += `<li><a href="${instagram}">Instagram</a></li>`;
    if (facebook) socialItems += `<li><a href="${facebook}">Facebook</a></li>`;
    if (website) socialItems += `<li><a href="${website}">Portfolio/GitHub</a></li>`;

    // Education table
    const eduEntries = document.querySelectorAll('.education-entry');
    let eduRows = '';
    let eduHas = false;
    eduEntries.forEach(entry => {
        const q = entry.querySelector('.edu-qualification')?.value || '';
        const i = entry.querySelector('.edu-institution')?.value || '';
        const b = entry.querySelector('.edu-board')?.value || '';
        const y = entry.querySelector('.edu-year')?.value || '';
        const p = entry.querySelector('.edu-percentage')?.value || '';
        const d = entry.querySelector('.edu-desc')?.value || '';
        if (q || i) {
            eduHas = true;
            eduRows += `<tr><td>${q}</td><td>${i}</td><td>${b}</td><td>${p}</td><td>${y}</td><td>${d}</td></tr>`;
        }
    });

    // Experience (table-like but as divs for better spacing)
    const expEntries = document.querySelectorAll('.experience-entry');
    let expHTML = '';
    let expHas = false;
    expEntries.forEach(entry => {
        const job = entry.querySelector('.exp-title')?.value || '';
        const comp = entry.querySelector('.exp-company')?.value || '';
        const type = entry.querySelector('.exp-type')?.value || '';
        const start = entry.querySelector('.exp-start')?.value || '';
        const end = entry.querySelector('.exp-end')?.value || '';
        const desc = entry.querySelector('.exp-desc')?.value || '';
        if (job || comp) {
            expHas = true;
            expHTML += `<div class="exp-item">
                <div class="exp-period">${start} - ${end} | ${type}</div>
                <div class="exp-role">${job}</div>
                <div class="exp-company">${comp}</div>
                <div class="exp-desc">${desc}</div>
            </div>`;
        }
    });

    // Projects
    const projEntries = document.querySelectorAll('.project-entry');
    let projHTML = '';
    let projHas = false;
    projEntries.forEach(entry => {
        const n = entry.querySelector('.proj-name')?.value || '';
        const tech = entry.querySelector('.proj-tech')?.value || '';
        const link = entry.querySelector('.proj-link')?.value || '';
        const desc = entry.querySelector('.proj-desc')?.value || '';
        if (n) {
            projHas = true;
            projHTML += `<div class="exp-item">
                <div class="exp-role">${n} (${tech})</div>
                <div class="exp-desc">${desc} ${link ? `<a href="${link}">Link</a>` : ''}</div>
            </div>`;
        }
    });

    // Certifications table
    const certEntries = document.querySelectorAll('.certification-entry');
    let certRows = '';
    let certHas = false;
    certEntries.forEach(entry => {
        const n = entry.querySelector('.cert-name')?.value || '';
        const o = entry.querySelector('.cert-org')?.value || '';
        const d = entry.querySelector('.cert-date')?.value || '';
        const l = entry.querySelector('.cert-link')?.value || '';
        if (n) {
            certHas = true;
            certRows += `<tr><td>${n}</td><td>${o}</td><td>${d}</td><td>${l ? `<a href="${l}">View</a>` : ''}</td></tr>`;
        }
    });

    // Achievements
    const achieveEntries = document.querySelectorAll('.achievement-entry');
    let achieveRows = '';
    let achieveHas = false;
    achieveEntries.forEach(entry => {
        const t = entry.querySelector('.achieve-title')?.value || '';
        const y = entry.querySelector('.achieve-year')?.value || '';
        const d = entry.querySelector('.achieve-desc')?.value || '';
        if (t) {
            achieveHas = true;
            achieveRows += `<tr><td>${t}</td><td>${y}</td><td>${d}</td></tr>`;
        }
    });

    // Skills
    const skillInputs = document.querySelectorAll('.skill-input');
    let skillsArr = [];
    skillInputs.forEach(inp => { if (inp.value.trim()) skillsArr.push(inp.value.trim()); });
    const skillsText = skillsArr.length ? skillsArr.join(', ') : '';

    // Languages table
    const langEntries = document.querySelectorAll('.language-entry');
    let langRows = '';
    let langHas = false;
    langEntries.forEach(entry => {
        const l = entry.querySelector('.lang-name')?.value || '';
        const p = entry.querySelector('.lang-proficiency')?.value || '';
        if (l) {
            langHas = true;
            langRows += `<tr><td>${l}</td><td>${p}</td></tr>`;
        }
    });

    // Interests
    const interestInputs = document.querySelectorAll('.interest-input');
    let interestsArr = [];
    interestInputs.forEach(inp => { if (inp.value.trim()) interestsArr.push(inp.value.trim()); });
    const interestsText = interestsArr.length ? interestsArr.join(', ') : '';

    // Declaration
    const place = document.getElementById('declarationPlace')?.value || '';
    const date = getCurrentDateFormatted();

    // Build two-column layout
    let html = `<div class="resume-page">
        <div class="resume-sidebar">
            <div class="photo-container">
                ${photoSrc && !photoPreview.classList.contains('hidden') ? `<img src="${photoSrc}" class="profile-photo" alt="Profile">` : ''}
            </div>
            <div class="sidebar-section">
                <div class="pill-heading">Contact</div>
                <ul class="contact-list">${contactItems}</ul>
            </div>
            <div class="sidebar-section">
                <div class="pill-heading">Find Me Online</div>
                <ul class="social-list">${socialItems}</ul>
            </div>
        </div>
        <div class="resume-main">
            <h1 class="resume-name">${fullName}</h1>
            <p class="resume-title">${title}</p>`;

    // Profile summary
    html += `<div class="resume-section">
        <div class="pill-heading">Profile</div>
        <p class="summary-text">${profSummary || 'To work with an organization where I can utilize my skills, learn new technologies, improve my abilities, and contribute effectively towards organizational goals while achieving personal and professional growth.'}</p>
    </div>`;

    // Work Experience
    if (expHas) {
        html += `<div class="resume-section">
            <div class="pill-heading">Work Experience</div>
            ${expHTML}
        </div>`;
    }

    // Education (table)
    if (eduHas) {
        html += `<div class="resume-section">
            <div class="pill-heading">Education</div>
            <table class="data-table">
                <tr><th>Qualification</th><th>Institution</th><th>Board</th><th>Percentage/CGPA</th><th>Year</th><th>Description</th></tr>
                ${eduRows}
            </table>
        </div>`;
    }

    // Skills
    if (skillsText) {
        html += `<div class="resume-section">
            <div class="pill-heading">Skills</div>
            <p>${skillsText}</p>
        </div>`;
    }

    // Projects
    if (projHas) {
        html += `<div class="resume-section">
            <div class="pill-heading">Projects</div>
            ${projHTML}
        </div>`;
    }

    // Certifications
    if (certHas) {
        html += `<div class="resume-section">
            <div class="pill-heading">Certifications</div>
            <table class="data-table">
                <tr><th>Certificate</th><th>Organization</th><th>Date</th><th>Credential</th></tr>
                ${certRows}
            </table>
        </div>`;
    }

    // Achievements
    if (achieveHas) {
        html += `<div class="resume-section">
            <div class="pill-heading">Achievements</div>
            <table class="data-table">
                <tr><th>Title</th><th>Year</th><th>Description</th></tr>
                ${achieveRows}
            </table>
        </div>`;
    }

    // Languages
    if (langHas) {
        html += `<div class="resume-section">
            <div class="pill-heading">Languages</div>
            <table class="data-table">
                <tr><th>Language</th><th>Proficiency</th></tr>
                ${langRows}
            </table>
        </div>`;
    }

    // Interests
    if (interestsText) {
        html += `<div class="resume-section">
            <div class="pill-heading">Interests</div>
            <p>${interestsText}</p>
        </div>`;
    }

    // Declaration
    html += `<div class="resume-section">
        <div class="pill-heading">Declaration</div>
        <p class="declaration-text">I hereby declare that the above particulars of facts and information stated are true, correct and complete to the best of my belief and knowledge.</p>
        <div class="declaration-footer">
            <div>Date: ${date}<br>Place: ${place || '________'}</div>
            <div>${fullName}</div>
        </div>
    </div>`;

    html += `</div></div>`;

    resumeTemplate.innerHTML = html;
}

// ==================== PDF GENERATION ====================
function generatePDF() {
    if (!fullNameInput.value.trim()) {
        showToast('Please enter your full name.');
        return;
    }
    loadingOverlay.classList.remove('hidden');

    const element = document.getElementById('resume-template');
    const opt = {
        margin: 0,
        filename: `${fullNameInput.value.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        loadingOverlay.classList.add('hidden');
        showToast('Resume downloaded successfully!');
    }).catch(() => {
        loadingOverlay.classList.add('hidden');
        showToast('PDF generation failed. Please try again.');
    });
}
