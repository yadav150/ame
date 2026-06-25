// form.js
document.addEventListener('DOMContentLoaded', () => {
    // ---------- Firebase Init ----------
    const firebaseConfig = {
        apiKey: "AIzaSyBLX-DBrAZZgi7OGRW3-oeno0PJsZ9hzEg",
        authDomain: "its-me-ame.firebaseapp.com",
        projectId: "its-me-ame",
        storageBucket: "its-me-ame.firebasestorage.app",
        messagingSenderId: "832380884001",
        appId: "1:832380884001:web:0c9239588ceb8d8995bf60",
        measurementId: "G-L12EEJG7L9"
    };
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    // ---------- Auth State & Navbar ----------
    const authLink = document.getElementById('authLink');
    const userDisplay = document.getElementById('userDisplay');
    const userNameSpan = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');

    auth.onAuthStateChanged((user) => {
        if (user) {
            // Logged in
            authLink.style.display = 'none';
            userDisplay.style.display = 'flex';
            userNameSpan.textContent = user.displayName || user.email;
            // Pre-fill email if field exists and empty
            const emailField = document.getElementById('email');
            if (emailField && !emailField.value) {
                emailField.value = user.email;
            }
        } else {
            // Logged out
            authLink.style.display = 'block';
            userDisplay.style.display = 'none';
        }
    });

    logoutBtn.addEventListener('click', () => {
        auth.signOut().then(() => {
            window.location.href = 'index.html';
        });
    });

    // ---------- Step Navigation ----------
    const steps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step');
    let currentStep = 1;

    function showStep(stepNumber) {
        steps.forEach(step => step.classList.remove('active'));
        document.getElementById(`step${stepNumber}`).classList.add('active');
        stepIndicators.forEach(ind => {
            const num = parseInt(ind.dataset.step);
            ind.classList.remove('active', 'completed');
            if (num === stepNumber) ind.classList.add('active');
            else if (num < stepNumber) ind.classList.add('completed');
        });
        currentStep = stepNumber;
        if (stepNumber === 4) {
            const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
            document.getElementById('dateAuto').value = today;
        }
    }

    function validateStep(stepNumber) {
        const currentStepEl = document.getElementById(`step${stepNumber}`);
        const requiredFields = currentStepEl.querySelectorAll('[required]');
        let isValid = true;
        requiredFields.forEach(field => {
            if (field.type === 'checkbox' && !field.checked) {
                field.classList.add('error');
                isValid = false;
            } else if (field.type === 'file' && field.files.length === 0) {
                field.classList.add('error');
                isValid = false;
            } else if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });
        if (!isValid) {
            const firstInvalid = currentStepEl.querySelector('.error');
            if (firstInvalid) firstInvalid.focus();
        }
        return isValid;
    }

    // Next buttons
    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextStep = parseInt(btn.dataset.next);
            if (validateStep(currentStep)) showStep(nextStep);
        });
    });

    // Previous buttons
    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', () => {
            const prevStep = parseInt(btn.dataset.prev);
            showStep(prevStep);
        });
    });

    // Add education
    document.getElementById('addEducation').addEventListener('click', () => {
        const container = document.getElementById('educationContainer');
        const newEntry = document.createElement('div');
        newEntry.className = 'education-entry';
        newEntry.innerHTML = `
            <div class="form-row">
                <div class="form-group"><label>Exam Name <span class="req">*</span></label><input type="text" class="examName" required></div>
                <div class="form-group"><label>Board/University <span class="req">*</span></label><input type="text" class="board" required></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Passing Year <span class="req">*</span></label><input type="text" class="passYear" required placeholder="YYYY"></div>
                <div class="form-group"><label>Percentage <span class="req">*</span></label><input type="text" class="percentage" required placeholder="e.g. 85%"></div>
            </div>
            <div class="form-group"><label>Division <span class="req">*</span></label>
                <select class="division" required>
                    <option value="">-- Division --</option>
                    <option value="First">First</option>
                    <option value="Second">Second</option>
                    <option value="Third">Third</option>
                </select>
            </div>
        `;
        container.appendChild(newEntry);
    });

    // Add other qualifications
    document.getElementById('addOtherQual').addEventListener('click', () => {
        const container = document.getElementById('otherQualContainer');
        const newEntry = document.createElement('div');
        newEntry.className = 'other-entry';
        newEntry.innerHTML = `
            <div class="form-row">
                <div class="form-group"><label>Qualification Name <span class="req">*</span></label><input type="text" class="qualName" required></div>
                <div class="form-group"><label>Institute/Organization <span class="req">*</span></label><input type="text" class="institute" required></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Passing Year <span class="req">*</span></label><input type="text" class="qualYear" required placeholder="YYYY"></div>
                <div class="form-group"><label>Score/Grade <span class="req">*</span></label><input type="text" class="score" required></div>
            </div>
            <div class="form-group"><label>Duration <span class="req">*</span></label><input type="text" class="duration" required placeholder="e.g., 6 months"></div>
        `;
        container.appendChild(newEntry);
    });

    // Photo upload feedback
    document.getElementById('photoUpload')?.addEventListener('change', function(e) {
        const file = e.target.files[0];
        const status = document.getElementById('photoStatus');
        if (file) {
            status.textContent = `File: ${file.name} (${(file.size/1024).toFixed(1)} KB) - Ready to upload`;
        } else {
            status.textContent = 'No file chosen';
        }
    });

    // ---------- Generate Button (Login required) ----------
    document.getElementById('generateBtn').addEventListener('click', () => {
        if (!validateStep(4)) return;

        const user = auth.currentUser;
        if (!user) {
            // Redirect to login if not logged in
            alert('Please log in first to download your resume.');
            window.location.href = 'login.html';
            return;
        }
        // User is logged in, show success
        document.getElementById('successMessage').style.display = 'flex';
    });

    document.getElementById('closeSuccess').addEventListener('click', () => {
        document.getElementById('successMessage').style.display = 'none';
    });

    // Read template from URL
    const urlParams = new URLSearchParams(window.location.search);
    const template = urlParams.get('template');
    if (template) {
        localStorage.setItem('selectedTemplate', template);
    }

    showStep(1);
});
