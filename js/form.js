// form.js
document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step');
    let currentStep = 1;
    const totalSteps = 4;

    // Navigation buttons
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');
    const generateBtn = document.getElementById('generateBtn');
    const successMessage = document.getElementById('successMessage');

    // Add dynamic education & qualification rows
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

    // Show step
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

        // Auto-fill name and date on final step
        if (stepNumber === 4) {
            const applicantName = document.getElementById('applicantName')?.value || '';
            document.getElementById('place').value = applicantName ? 'Guwahati' : '';
            const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
            document.getElementById('dateAuto').value = today;
        }
    }

    // Validate current step's required fields
    function validateStep(stepNumber) {
        const currentStepEl = document.getElementById(`step${stepNumber}`);
        const requiredFields = currentStepEl.querySelectorAll('[required]');
        let isValid = true;
        requiredFields.forEach(field => {
            // Skip file input if it's the photo and we treat as optional for demo? We'll enforce required.
            if (field.type === 'file' && field.files.length === 0) {
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
            // Focus first invalid field
            const firstInvalid = currentStepEl.querySelector('.error');
            if (firstInvalid) firstInvalid.focus();
        }
        return isValid;
    }

    // Next button click
    nextButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const nextStep = parseInt(btn.dataset.next);
            if (validateStep(currentStep)) {
                showStep(nextStep);
            }
        });
    });

    // Previous button click
    prevButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const prevStep = parseInt(btn.dataset.prev);
            showStep(prevStep);
        });
    });

    // Generate button
    generateBtn.addEventListener('click', () => {
        if (validateStep(4)) {
            // Show success overlay
            successMessage.style.display = 'flex';
            // Optionally store form data to localStorage for later use
        }
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

    // Read template parameter from URL
    const urlParams = new URLSearchParams(window.location.search);
    const template = urlParams.get('template');
    if (template) {
        console.log('Selected template:', template);
        // Store it for future PDF generation (e.g., localStorage)
        localStorage.setItem('selectedTemplate', template);
    }

    // Initialize first step
    showStep(1);
});
