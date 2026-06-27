// form.js - Multi-step form handling, validation, and resume generation

let currentStep = 1;
let eduCounter = 1;
let qualCounter = 1;

function initFormPage() {
    const form = document.getElementById('resumeForm');
    if (!form) return;

    // Navigation buttons
    document.querySelectorAll('.next-step').forEach(btn => {
        btn.addEventListener('click', () => {
            const next = parseInt(btn.dataset.next);
            if (validateStep(currentStep)) {
                goToStep(next);
            }
        });
    });

    document.querySelectorAll('.prev-step').forEach(btn => {
        btn.addEventListener('click', () => {
            const prev = parseInt(btn.dataset.prev);
            goToStep(prev);
        });
    });

    // Add more education
    document.getElementById('addMoreEducation')?.addEventListener('click', addEducationEntry);
    // Add more qualification
    document.getElementById('addMoreQualification')?.addEventListener('click', addQualificationEntry);

    // Remove buttons delegation
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-edu')) {
            e.target.closest('.education-entry').remove();
        }
        if (e.target.classList.contains('remove-qual')) {
            e.target.closest('.qualification-entry').remove();
        }
    });

    // Photo upload UI
    const photoArea = document.getElementById('photoUploadArea');
    const photoInput = document.getElementById('photoInput');
    if (photoArea && photoInput) {
        photoArea.addEventListener('click', () => photoInput.click());
        photoInput.addEventListener('change', handlePhotoUpload);
    }

    // Form submission
    form.addEventListener('submit', handleSubmit);

    // Set initial step
    goToStep(1);
}

function goToStep(step) {
    document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
    document.getElementById(`step${step}`).classList.add('active');
    currentStep = step;
    updateStepIndicator();
}

function updateStepIndicator() {
    document.querySelectorAll('.step').forEach(el => {
        const stepNum = parseInt(el.dataset.step);
        el.classList.remove('active', 'completed');
        if (stepNum === currentStep) el.classList.add('active');
        else if (stepNum < currentStep) el.classList.add('completed');
    });
}

function validateStep(step) {
    let isValid = true;
    const stepEl = document.getElementById(`step${step}`);
    // Clear previous errors
    stepEl.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
    stepEl.querySelectorAll('.error-msg').forEach(e => e.textContent = '');

    if (step === 1) {
        // Required: fullName, mobile, email
        const fullName = stepEl.querySelector('input[name="fullName"]');
        const mobile = stepEl.querySelector('input[name="mobile"]');
        const email = stepEl.querySelector('input[name="email"]');
        if (fullName && !fullName.value.trim()) {
            showError(fullName, 'Full name is required');
            isValid = false;
        }
        if (mobile && !mobile.value.trim()) {
            showError(mobile, 'Mobile number is required');
            isValid = false;
        }
        if (email && !email.value.trim()) {
            showError(email, 'Email is required');
            isValid = false;
        } else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            showError(email, 'Invalid email format');
            isValid = false;
        }
    } else if (step === 2) {
        const firstExam = stepEl.querySelector('input[name="eduExam_0"]');
        if (firstExam && !firstExam.value.trim()) {
            showError(firstExam, 'Exam name is required');
            isValid = false;
        }
    } else if (step === 4) {
        const declaration = document.getElementById('declaration');
        if (declaration && !declaration.checked) {
            document.getElementById('declarationError').textContent = 'You must agree to the declaration';
            isValid = false;
        } else {
            document.getElementById('declarationError').textContent = '';
        }
    }
    return isValid;
}

function showError(input, message) {
    const group = input.closest('.form-group');
    if (group) {
        group.classList.add('error');
        const errorEl = group.querySelector('.error-msg');
        if (errorEl) errorEl.textContent = message;
    }
}

function addEducationEntry() {
    const container = document.getElementById('educationContainer');
    const index = eduCounter++;
    const html = `
        <div class="education-entry" data-index="${index}">
            <h4 class="entry-label">Education #${index + 1}</h4>
            <div class="form-row">
                <div class="form-group required">
                    <label>Exam Name</label>
                    <input type="text" name="eduExam_${index}" placeholder="e.g., B.Tech">
                    <span class="error-msg"></span>
                </div>
                <div class="form-group">
                    <label>Board / University</label>
                    <input type="text" name="eduBoard_${index}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Year</label>
                    <input type="text" name="eduYear_${index}" placeholder="2024">
                </div>
                <div class="form-group">
                    <label>Percentage / CGPA</label>
                    <input type="text" name="eduPercent_${index}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Division</label>
                    <select name="eduDivision_${index}">
                        <option value="">Select Division</option>
                        <option value="First">First</option>
                        <option value="Second">Second</option>
                        <option value="Third">Third</option>
                    </select>
                </div>
            </div>
            <button type="button" class="btn btn-sm btn-outline remove-edu">Remove</button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
}

function addQualificationEntry() {
    const container = document.getElementById('qualificationsContainer');
    const index = qualCounter++;
    const html = `
        <div class="qualification-entry" data-index="${index}">
            <h4 class="entry-label">Qualification #${index + 1}</h4>
            <div class="form-row">
                <div class="form-group">
                    <label>Qualification Name</label>
                    <input type="text" name="qualName_${index}">
                </div>
                <div class="form-group">
                    <label>Institute</label>
                    <input type="text" name="qualInstitute_${index}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Year</label>
                    <input type="text" name="qualYear_${index}">
                </div>
                <div class="form-group">
                    <label>Grade / Score</label>
                    <input type="text" name="qualGrade_${index}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Duration</label>
                    <input type="text" name="qualDuration_${index}">
                </div>
            </div>
            <button type="button" class="btn btn-sm btn-outline remove-qual">Remove</button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', html);
}

function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const preview = document.getElementById('photoPreview');
            const placeholder = document.querySelector('.upload-placeholder');
            preview.src = event.target.result;
            preview.style.display = 'block';
            if (placeholder) placeholder.style.display = 'none';
        };
        reader.readAsDataURL(file);
    }
}

function collectFormData() {
    const form = document.getElementById('resumeForm');
    const data = {
        personal: {},
        education: [],
        qualifications: [],
        declaration: document.getElementById('declaration')?.checked || false,
        photo: document.getElementById('photoPreview')?.src || ''
    };

    // Personal
    const personalFields = ['fullName', 'fatherName', 'motherName', 'mobile', 'email', 'dob', 'gender', 'languages', 'address', 'category', 'maritalStatus', 'experience'];
    personalFields.forEach(field => {
        const input = form.querySelector(`[name="${field}"]`);
        if (input) data.personal[field] = input.value;
    });

    // Education
    document.querySelectorAll('.education-entry').forEach(entry => {
        const index = entry.dataset.index;
        const edu = {
            exam: entry.querySelector(`[name="eduExam_${index}"]`)?.value || '',
            board: entry.querySelector(`[name="eduBoard_${index}"]`)?.value || '',
            year: entry.querySelector(`[name="eduYear_${index}"]`)?.value || '',
            percent: entry.querySelector(`[name="eduPercent_${index}"]`)?.value || '',
            division: entry.querySelector(`[name="eduDivision_${index}"]`)?.value || ''
        };
        data.education.push(edu);
    });

    // Qualifications
    document.querySelectorAll('.qualification-entry').forEach(entry => {
        const index = entry.dataset.index;
        const qual = {
            name: entry.querySelector(`[name="qualName_${index}"]`)?.value || '',
            institute: entry.querySelector(`[name="qualInstitute_${index}"]`)?.value || '',
            year: entry.querySelector(`[name="qualYear_${index}"]`)?.value || '',
            grade: entry.querySelector(`[name="qualGrade_${index}"]`)?.value || '',
            duration: entry.querySelector(`[name="qualDuration_${index}"]`)?.value || ''
        };
        data.qualifications.push(qual);
    });

    return data;
}

function handleSubmit(e) {
    e.preventDefault();
    if (!validateStep(4)) return;

    const formData = collectFormData();
    const templateId = localStorage.getItem('selectedTemplate') || '1';

    // Render template
    let resumeHTML = '';
    switch (templateId) {
        case '1': resumeHTML = renderTemplate1(formData); break;
        case '2': resumeHTML = renderTemplate2(formData); break;
        case '3': resumeHTML = renderTemplate3(formData); break;
        default: resumeHTML = renderTemplate1(formData);
    }

    // Show preview
    document.getElementById('resumePreviewContent').innerHTML = resumeHTML;
    document.getElementById('resumePreviewSection').style.display = 'block';
    document.getElementById('formContainer').style.display = 'none';
    document.getElementById('stepIndicator').style.display = 'none';

    // Edit button
    document.getElementById('editResumeBtn')?.addEventListener('click', () => {
        document.getElementById('resumePreviewSection').style.display = 'none';
        document.getElementById('formContainer').style.display = 'block';
        document.getElementById('stepIndicator').style.display = 'flex';
    });

    // Print button
    document.getElementById('printResumeBtn')?.addEventListener('click', () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Resume</title>');
        printWindow.document.write('<link rel="stylesheet" href="css/style.css">');
        printWindow.document.write('<style>body { padding: 20px; }</style></head><body>');
        printWindow.document.write(document.getElementById('resumePreviewContent').innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    });

    // --- Save button (UPDATED with Firebase auth) ---
    document.getElementById('saveResumeBtn')?.addEventListener('click', () => {
        const user = auth.currentUser;   // Firebase Auth instance
        if (!user) {
            alert('Please login to save your resume.');
            window.location.href = 'login.html';
            return;
        }
        const userEmail = user.email;
        const key = `resumes_${userEmail}`;
        let resumes = JSON.parse(localStorage.getItem(key) || '[]');
        resumes.push({
            id: Date.now(),
            template: templateId,
            data: formData,
            created: new Date().toISOString()
        });
        localStorage.setItem(key, JSON.stringify(resumes));
        alert('Resume saved to dashboard!');
    });
}
