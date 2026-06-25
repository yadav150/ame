// form.js
document.addEventListener('DOMContentLoaded', () => {
    // ---------- Firebase Init ----------
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

    // ---------- Auth State & Navbar ----------
    const authLink = document.getElementById('authLink');
    const userDisplay = document.getElementById('userDisplay');
    const userNameSpan = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');
    const dashboardLink = document.getElementById('dashboardLink');

    let inactivityTimer;
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            auth.signOut().then(() => window.location.href = 'index.html');
        }, 60000);
    }
    ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetInactivityTimer);
    });
    resetInactivityTimer();

    auth.onAuthStateChanged((user) => {
        if (user) {
            authLink.style.display = 'none';
            userDisplay.style.display = 'flex';
            userNameSpan.textContent = user.displayName || user.email;
            if (dashboardLink) dashboardLink.style.display = 'inline-block';
            const emailField = document.getElementById('email');
            if (emailField && !emailField.value) emailField.value = user.email;
            restoreFormData();
        } else {
            authLink.style.display = 'block';
            userDisplay.style.display = 'none';
            if (dashboardLink) dashboardLink.style.display = 'none';
        }
    });

    logoutBtn.addEventListener('click', () => auth.signOut().then(() => window.location.href = 'index.html'));
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    if (hamburgerBtn) hamburgerBtn.addEventListener('click', () => document.getElementById('navLinks').classList.toggle('show'));

    // ---------- MULTI-SELECT SKILLS (max 5) ----------
    const skillsDisplay = document.getElementById('skillsDisplay');
    const skillsDropdown = document.getElementById('skillsDropdown');
    const skillsCheckboxList = document.getElementById('skillsCheckboxList');
    const skillsHidden = document.getElementById('skillsHidden');
    const skillSearch = document.getElementById('skillSearch');
    const skillCount = document.getElementById('skillCount');
    const MAX_SKILLS = 5;
    let selectedSkills = [];

    const predefinedSkills = [
        'Web Development', 'Graphic Design', 'Project Management', 'Digital Marketing',
        'Content Writing', 'Data Analysis', 'Public Speaking', 'Team Leadership',
        'Microsoft Office', 'Communication', 'Problem Solving', 'Time Management',
        'Customer Service', 'Social Media', 'SEO', 'Programming', 'Database Management',
        'Financial Analysis', 'Event Planning', 'Research', 'Teaching', 'Languages',
        'Java', 'Python', 'JavaScript', 'HTML/CSS', 'React', 'Node.js', 'SQL',
        'Cloud Computing', 'Machine Learning', 'UI/UX Design', 'Video Editing'
    ];

    function renderSkillsDropdown(filter = '') {
        skillsCheckboxList.innerHTML = '';
        const filtered = predefinedSkills.filter(s => s.toLowerCase().includes(filter.toLowerCase()));
        filtered.forEach(skill => {
            const label = document.createElement('label');
            label.className = 'checkbox-item';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = skill;
            checkbox.checked = selectedSkills.includes(skill);
            checkbox.addEventListener('change', () => {
                if (checkbox.checked) {
                    if (selectedSkills.length >= MAX_SKILLS) {
                        checkbox.checked = false;
                        alert(`You can select a maximum of ${MAX_SKILLS} skills.`);
                        return;
                    }
                    selectedSkills.push(skill);
                } else {
                    selectedSkills = selectedSkills.filter(s => s !== skill);
                }
                updateSkillsDisplay();
            });
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(' ' + skill));
            skillsCheckboxList.appendChild(label);
        });
        skillCount.textContent = `${selectedSkills.length} / ${MAX_SKILLS} selected`;
    }

    function updateSkillsDisplay() {
        if (selectedSkills.length === 0) {
            skillsDisplay.innerHTML = '<span class="placeholder-text">Click to select skills...</span>';
        } else {
            skillsDisplay.innerHTML = selectedSkills.map(s => `<span class="selected-skill-tag">${s} <span class="remove-skill" data-skill="${s}">×</span></span>`).join('');
            document.querySelectorAll('.remove-skill').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const skill = btn.dataset.skill;
                    selectedSkills = selectedSkills.filter(s => s !== skill);
                    updateSkillsDisplay();
                    renderSkillsDropdown(skillSearch.value);
                });
            });
        }
        skillsHidden.value = selectedSkills.join(', ');
        if (selectedSkills.length > 0) skillsHidden.classList.remove('error');
        else skillsHidden.classList.add('error');
        skillCount.textContent = `${selectedSkills.length} / ${MAX_SKILLS} selected`;
    }

    // Toggle dropdown
    skillsDisplay.addEventListener('click', (e) => {
        e.stopPropagation();
        skillsDropdown.classList.toggle('open');
        if (skillsDropdown.classList.contains('open')) {
            renderSkillsDropdown(skillSearch.value);
        }
    });
    document.addEventListener('click', () => skillsDropdown.classList.remove('open'));
    skillsDropdown.addEventListener('click', (e) => e.stopPropagation());

    // Search
    skillSearch.addEventListener('input', () => renderSkillsDropdown(skillSearch.value));

    // Initial render
    renderSkillsDropdown();

    // ---------- Save / Restore Form Data ----------
    function saveFormData() {
        const data = {
            applicantName: document.getElementById('applicantName').value,
            fatherName: document.getElementById('fatherName').value,
            motherName: document.getElementById('motherName').value,
            mobile: document.getElementById('mobile').value,
            email: document.getElementById('email').value,
            dob: document.getElementById('dob').value,
            gender: document.getElementById('gender').value,
            languages: document.getElementById('languages').value,
            category: document.getElementById('category').value,
            marital: document.getElementById('maritalStatus').value,
            experience: document.getElementById('experience').value,
            village: document.getElementById('village').value,
            postOffice: document.getElementById('postOffice').value,
            mouza: document.getElementById('mouza').value,
            district: document.getElementById('district').value,
            state: document.getElementById('state').value,
            pin: document.getElementById('pin').value,
            education: [],
            objective: document.getElementById('objective').value,
            selectedSkills: [...selectedSkills],
            experienceEntries: [],
            otherQual: [],
            place: document.getElementById('place').value,
            date: document.getElementById('dateAuto').value
        };
        document.querySelectorAll('.education-entry').forEach(entry => {
            data.education.push({
                exam: entry.querySelector('.examName')?.value,
                board: entry.querySelector('.board')?.value,
                year: entry.querySelector('.passYear')?.value,
                percent: entry.querySelector('.percentage')?.value,
                division: entry.querySelector('.division')?.value
            });
        });
        document.querySelectorAll('.experience-entry').forEach(entry => {
            data.experienceEntries.push({
                jobTitle: entry.querySelector('.jobTitle')?.value,
                company: entry.querySelector('.company')?.value,
                duration: entry.querySelector('.duration')?.value,
                responsibilities: entry.querySelector('.responsibilities')?.value,
                achievements: entry.querySelector('.achievements')?.value
            });
        });
        document.querySelectorAll('.other-entry').forEach(entry => {
            data.otherQual.push({
                qual: entry.querySelector('.qualName')?.value,
                inst: entry.querySelector('.institute')?.value,
                year: entry.querySelector('.qualYear')?.value,
                score: entry.querySelector('.score')?.value,
                duration: entry.querySelector('.oDuration')?.value
            });
        });
        localStorage.setItem('savedFormData', JSON.stringify(data));
    }

    function restoreFormData() {
        const saved = localStorage.getItem('savedFormData');
        if (!saved) return;
        const data = JSON.parse(saved);
        document.getElementById('applicantName').value = data.applicantName || '';
        document.getElementById('fatherName').value = data.fatherName || '';
        document.getElementById('motherName').value = data.motherName || '';
        document.getElementById('mobile').value = data.mobile || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('dob').value = data.dob || '';
        document.getElementById('gender').value = data.gender || '';
        document.getElementById('languages').value = data.languages || '';
        document.getElementById('category').value = data.category || '';
        document.getElementById('maritalStatus').value = data.marital || '';
        document.getElementById('experience').value = data.experience || '';
        document.getElementById('village').value = data.village || '';
        document.getElementById('postOffice').value = data.postOffice || '';
        document.getElementById('mouza').value = data.mouza || '';
        document.getElementById('district').value = data.district || '';
        document.getElementById('state').value = data.state || '';
        document.getElementById('pin').value = data.pin || '';
        document.getElementById('objective').value = data.objective || '';
        // Restore skills
        selectedSkills = data.selectedSkills || [];
        updateSkillsDisplay();
        renderSkillsDropdown();
        // Restore education entries
        const eduContainer = document.getElementById('educationContainer');
        eduContainer.innerHTML = '';
        data.education.forEach(edu => {
            const div = document.createElement('div');
            div.className = 'education-entry';
            div.innerHTML = `<div class="form-row">
                <div class="form-group"><label>Exam Name <span class="req">*</span></label><input type="text" class="examName" required value="${edu.exam||''}"></div>
                <div class="form-group"><label>Board/University <span class="req">*</span></label><input type="text" class="board" required value="${edu.board||''}"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Passing Year <span class="req">*</span></label><input type="text" class="passYear" required value="${edu.year||''}"></div>
                <div class="form-group"><label>Percentage <span class="req">*</span></label><input type="text" class="percentage" required value="${edu.percent||''}"></div>
            </div>
            <div class="form-group"><label>Division <span class="req">*</span></label>
                <select class="division" required>
                    <option value="">-- Division --</option>
                    <option value="First" ${edu.division==='First'?'selected':''}>First</option>
                    <option value="Second" ${edu.division==='Second'?'selected':''}>Second</option>
                    <option value="Third" ${edu.division==='Third'?'selected':''}>Third</option>
                </select></div>`;
            eduContainer.appendChild(div);
        });
        const expContainer = document.getElementById('experienceContainer');
        expContainer.innerHTML = '';
        data.experienceEntries.forEach(exp => {
            const div = document.createElement('div');
            div.className = 'experience-entry';
            div.innerHTML = `<div class="form-row">
                <div class="form-group"><label>Job Title</label><input type="text" class="jobTitle" value="${exp.jobTitle||''}"></div>
                <div class="form-group"><label>Company Name</label><input type="text" class="company" value="${exp.company||''}"></div>
            </div>
            <div class="form-group"><label>Duration</label><input type="text" class="duration" value="${exp.duration||''}"></div>
            <div class="form-group"><label>Responsibilities</label><textarea class="responsibilities" rows="3">${exp.responsibilities||''}</textarea></div>
            <div class="form-group"><label>Achievements</label><input type="text" class="achievements" value="${exp.achievements||''}"></div>`;
            expContainer.appendChild(div);
        });
        const qualContainer = document.getElementById('otherQualContainer');
        qualContainer.innerHTML = '';
        data.otherQual.forEach(q => {
            const div = document.createElement('div');
            div.className = 'other-entry';
            div.innerHTML = `<div class="form-row">
                <div class="form-group"><label>Qualification Name</label><input type="text" class="qualName" value="${q.qual||''}"></div>
                <div class="form-group"><label>Institute/Organization</label><input type="text" class="institute" value="${q.inst||''}"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Passing Year</label><input type="text" class="qualYear" value="${q.year||''}"></div>
                <div class="form-group"><label>Score/Grade</label><input type="text" class="score" value="${q.score||''}"></div>
            </div>
            <div class="form-group"><label>Duration</label><input type="text" class="oDuration" value="${q.duration||''}"></div>`;
            qualContainer.appendChild(div);
        });
        localStorage.removeItem('savedFormData');
    }

    // ---------- Step Navigation ----------
    const steps = document.querySelectorAll('.form-step');
    const indicators = document.querySelectorAll('.step');
    let currentStep = 1;

    function showStep(stepNumber) {
        steps.forEach(s => s.classList.remove('active'));
        document.getElementById(`step${stepNumber}`).classList.add('active');
        indicators.forEach(ind => {
            const num = parseInt(ind.dataset.step);
            ind.classList.remove('active', 'completed');
            if (num === stepNumber) ind.classList.add('active');
            else if (num < stepNumber) ind.classList.add('completed');
        });
        currentStep = stepNumber;
        if (stepNumber === 5) {
            document.getElementById('dateAuto').value = new Date().toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' });
        }
    }

    function validateStep(stepNumber) {
        const stepEl = document.getElementById(`step${stepNumber}`);
        const requiredFields = stepEl.querySelectorAll('[required]');
        let valid = true;
        let missing = [];
        requiredFields.forEach(field => {
            if (field.id === 'skillsHidden') {
                if (!field.value.trim()) { missing.push('Skills'); valid = false; }
                return;
            }
            const label = field.closest('.form-group')?.querySelector('label')?.textContent?.replace(/\*/g,'').trim() || 'field';
            if (field.type === 'checkbox' && !field.checked) { missing.push(label); field.classList.add('error'); valid = false; }
            else if (field.type === 'file' && field.files.length === 0) { missing.push(label); field.classList.add('error'); valid = false; }
            else if (field.tagName === 'SELECT' && field.value === '') { missing.push(label); field.classList.add('error'); valid = false; }
            else if (!field.value.trim()) { missing.push(label); field.classList.add('error'); valid = false; }
            else { field.classList.remove('error'); }
        });
        const errorDiv = document.getElementById(`step${stepNumber}Error`);
        if (!valid) {
            errorDiv.textContent = 'Please fill in: ' + missing.join(', ');
            errorDiv.style.display = 'block';
            const firstError = stepEl.querySelector('.error');
            if (firstError) firstError.focus();
        } else {
            if (errorDiv) errorDiv.style.display = 'none';
        }
        return valid;
    }

    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', () => {
            const next = parseInt(btn.dataset.next);
            if (validateStep(currentStep)) showStep(next);
        });
    });
    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', () => {
            const prev = parseInt(btn.dataset.prev);
            showStep(prev);
        });
    });

    // Add More buttons
    document.getElementById('addEducation').addEventListener('click', () => {
        const entry = document.createElement('div');
        entry.className = 'education-entry';
        entry.innerHTML = `<div class="form-row">
            <div class="form-group"><label>Exam Name <span class="req">*</span></label><input type="text" class="examName" required></div>
            <div class="form-group"><label>Board/University <span class="req">*</span></label><input type="text" class="board" required></div>
        </div>
        <div class="form-row">
            <div class="form-group"><label>Passing Year <span class="req">*</span></label><input type="text" class="passYear" required></div>
            <div class="form-group"><label>Percentage <span class="req">*</span></label><input type="text" class="percentage" required></div>
        </div>
        <div class="form-group"><label>Division <span class="req">*</span></label>
            <select class="division" required>
                <option value="">-- Division --</option>
                <option value="First">First</option>
                <option value="Second">Second</option>
                <option value="Third">Third</option>
            </select></div>`;
        document.getElementById('educationContainer').appendChild(entry);
    });

    document.getElementById('addExperience').addEventListener('click', () => {
        const entry = document.createElement('div');
        entry.className = 'experience-entry';
        entry.innerHTML = `<div class="form-row">
            <div class="form-group"><label>Job Title</label><input type="text" class="jobTitle"></div>
            <div class="form-group"><label>Company Name</label><input type="text" class="company"></div>
        </div>
        <div class="form-group"><label>Duration</label><input type="text" class="duration"></div>
        <div class="form-group"><label>Responsibilities</label><textarea class="responsibilities" rows="3"></textarea></div>
        <div class="form-group"><label>Achievements</label><input type="text" class="achievements"></div>`;
        document.getElementById('experienceContainer').appendChild(entry);
    });

    document.getElementById('addOtherQual').addEventListener('click', () => {
        const entry = document.createElement('div');
        entry.className = 'other-entry';
        entry.innerHTML = `<div class="form-row">
            <div class="form-group"><label>Qualification Name</label><input type="text" class="qualName"></div>
            <div class="form-group"><label>Institute/Organization</label><input type="text" class="institute"></div>
        </div>
        <div class="form-row">
            <div class="form-group"><label>Passing Year</label><input type="text" class="qualYear"></div>
            <div class="form-group"><label>Score/Grade</label><input type="text" class="score"></div>
        </div>
        <div class="form-group"><label>Duration</label><input type="text" class="oDuration"></div>`;
        document.getElementById('otherQualContainer').appendChild(entry);
    });

    // Photo upload feedback
    document.getElementById('photoUpload')?.addEventListener('change', function(e) {
        const file = e.target.files[0];
        const status = document.getElementById('photoStatus');
        status.textContent = file ? `File: ${file.name} (${(file.size/1024).toFixed(1)} KB)` : 'No file chosen';
    });

    // ---------- Generate PDF & Save ----------
    document.getElementById('generateBtn').addEventListener('click', async () => {
        if (!validateStep(5)) return;
        const user = auth.currentUser;
        if (!user) {
            saveFormData();
            window.location.href = 'login.html';
            return;
        }

        const data = {
            name: document.getElementById('applicantName').value,
            father: document.getElementById('fatherName').value,
            mother: document.getElementById('motherName').value,
            mobile: document.getElementById('mobile').value,
            email: document.getElementById('email').value,
            dob: document.getElementById('dob').value,
            gender: document.getElementById('gender').value,
            languages: document.getElementById('languages').value,
            category: document.getElementById('category').value,
            marital: document.getElementById('maritalStatus').value,
            experience: document.getElementById('experience').value,
            village: document.getElementById('village').value,
            postOffice: document.getElementById('postOffice').value,
            mouza: document.getElementById('mouza').value,
            district: document.getElementById('district').value,
            state: document.getElementById('state').value,
            pin: document.getElementById('pin').value,
            objective: document.getElementById('objective').value,
            skills: skillsHidden.value,
            education: [],
            experienceEntries: [],
            otherQual: [],
            place: document.getElementById('place').value || 'Guwahati',
            date: document.getElementById('dateAuto').value,
            photo: null
        };

        document.querySelectorAll('.education-entry').forEach(entry => {
            const exam = entry.querySelector('.examName')?.value;
            if (exam) data.education.push({
                exam,
                board: entry.querySelector('.board')?.value,
                year: entry.querySelector('.passYear')?.value,
                percent: entry.querySelector('.percentage')?.value,
                division: entry.querySelector('.division')?.value
            });
        });
        document.querySelectorAll('.experience-entry').forEach(entry => {
            const jobTitle = entry.querySelector('.jobTitle')?.value;
            const company = entry.querySelector('.company')?.value;
            if (jobTitle || company) data.experienceEntries.push({
                jobTitle, company,
                duration: entry.querySelector('.duration')?.value,
                responsibilities: entry.querySelector('.responsibilities')?.value,
                achievements: entry.querySelector('.achievements')?.value
            });
        });
        document.querySelectorAll('.other-entry').forEach(entry => {
            const qual = entry.querySelector('.qualName')?.value;
            const inst = entry.querySelector('.institute')?.value;
            if (qual || inst) data.otherQual.push({
                qual, inst,
                year: entry.querySelector('.qualYear')?.value,
                score: entry.querySelector('.score')?.value,
                duration: entry.querySelector('.oDuration')?.value
            });
        });

        const photoFile = document.getElementById('photoUpload').files[0];
        if (photoFile) data.photo = await readFileAsDataURL(photoFile);

        const html = buildFormalResume(data);
        const element = document.createElement('div');
        element.innerHTML = html;
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        element.style.width = '800px';
        document.body.appendChild(element);

        html2canvas(element, { scale: 2, useCORS: true }).then(canvas => {
            document.body.removeChild(element);
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const margin = 10;
            const imgWidth = 210 - margin * 2;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = margin;
            const borderColor = '#7f8c8d';
            pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
            pdf.setDrawColor(borderColor);
            pdf.setLineWidth(0.6);
            pdf.rect(margin - 1, margin - 1, imgWidth + 2, 297 - margin * 2 + 2, 'S');
            heightLeft -= (297 - margin * 2);
            while (heightLeft > 0) {
                position = margin - (imgHeight - heightLeft);
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                pdf.setDrawColor(borderColor);
                pdf.rect(margin - 1, margin - 1, imgWidth + 2, 297 - margin * 2 + 2, 'S');
                heightLeft -= (297 - margin * 2);
            }
            pdf.save(`${data.name.replace(/\s+/g, '_')}_CV.pdf`);
            document.getElementById('successMessage').style.display = 'flex';
            document.querySelector('#successMessage h3').textContent = '✅ Resume Downloaded & Saved!';
            document.querySelector('#successMessage p').textContent = 'Your resume has been saved to your dashboard.';
            saveResumeToFirestore(user.uid, data);
        }).catch(err => {
            console.error('PDF error:', err);
            alert('Something went wrong while generating PDF.');
        });
    });

    document.getElementById('closeSuccess').addEventListener('click', () => {
        document.getElementById('successMessage').style.display = 'none';
    });

    const urlParams = new URLSearchParams(window.location.search);
    const template = urlParams.get('template') || 'formal';
    if (template !== 'formal') window.location.href = 'templates.html';
    localStorage.setItem('selectedTemplate', 'formal');
    showStep(1);
});

// ---------- Helper Functions ----------
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function saveResumeToFirestore(uid, data) {
    const { photo, ...cleanData } = data;
    firebase.firestore().collection('resumes').add({
        uid,
        name: data.name,
        template: 'formal',
        data: cleanData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        console.log('Resume saved');
        alert('Resume saved to your dashboard successfully!');
    }).catch(err => console.error('Firestore save error:', err));
}

function buildFormalResume(data) {
    const greyBar = '#d5d8dc';
    const textColor = '#2c3e50';
    let eduRows = data.education.map(e => `<tr><td>${e.exam||''}</td><td>${e.year||''}</td><td>${e.board||''}</td><td>${e.percent||''}</td><td>${e.division||''}</td></tr>`).join('');
    let expBlocks = data.experienceEntries.map(exp => `<div style="margin-bottom:10px;"><strong>${exp.jobTitle||''}</strong> – ${exp.company||''}<br><em>${exp.duration||''}</em><p style="white-space:pre-line;">${exp.responsibilities||''}</p>${exp.achievements ? `<p><strong>Achievements:</strong> ${exp.achievements}</p>` : ''}</div>`).join('');
    const fullAddress = [data.village, data.postOffice, data.mouza, data.district, data.state, data.pin].filter(Boolean).join(', ');

    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
        *{box-sizing:border-box;margin:0;padding:0}body{font-family:'Segoe UI',Arial,sans-serif;color:${textColor};background:white;margin:0;padding:0}
        .page{width:780px;margin:0 auto;padding:25px;background:white;border:1px solid #aaa;page-break-after:always}
        .page:last-child{page-break-after:auto}
        .header{text-align:center;margin-bottom:20px;position:relative}
        .header h1{font-size:2rem;text-decoration:underline;margin-bottom:10px}
        .photo{position:absolute;right:0;top:0;width:110px;height:130px;border:1px solid #aaa;object-fit:cover}
        .section-bar{background:${greyBar};padding:6px 10px;font-weight:bold;margin:15px 0 10px;text-transform:uppercase;font-size:0.9rem}
        table{width:100%;border-collapse:collapse;margin-bottom:10px}
        th,td{border:1px solid #aaa;padding:5px 8px;text-align:left;font-size:0.85rem}
        th{background:#f0f0f0}
        .profile-table td:first-child{font-weight:bold;width:35%}
        .declaration{margin-top:30px;font-size:0.9rem}
        .signature{margin-top:20px;text-align:right}
    </style></head><body>
    <div class="page">
        <div class="header"><h1>Curriculum Vitae</h1>${data.photo ? `<img src="${data.photo}" class="photo">` : ''}</div>
        <div class="section-bar">Personal Profile</div>
        <table class="profile-table">
            <tr><td>Name</td><td>${data.name||''}</td></tr>
            <tr><td>Father's Name</td><td>${data.father||''}</td></tr>
            <tr><td>Mother's Name</td><td>${data.mother||''}</td></tr>
            <tr><td>Date of Birth</td><td>${data.dob||''}</td></tr>
            <tr><td>Gender</td><td>${data.gender||''}</td></tr>
            <tr><td>Mobile</td><td>${data.mobile||''}</td></tr>
            <tr><td>Email</td><td>${data.email||''}</td></tr>
            <tr><td>Address</td><td>${fullAddress}</td></tr>
            <tr><td>Category</td><td>${data.category||''}</td></tr>
            <tr><td>Marital Status</td><td>${data.marital||''}</td></tr>
            <tr><td>Languages Known</td><td>${data.languages||''}</td></tr>
            <tr><td>Experience</td><td>${data.experience||''}</td></tr>
        </table>
        <div class="section-bar">Career Objective</div>
        <p>${data.objective||''}</p>
        <div class="section-bar">Academic Qualifications</div>
        <table><tr><th>Qualification</th><th>Year</th><th>Board/University</th><th>Percentage</th><th>Division</th></tr>${eduRows}</table>
        ${expBlocks ? `<div class="section-bar">Professional Experience</div>${expBlocks}` : ''}
        ${data.skills ? `<div class="section-bar">Skills</div><p>${data.skills}</p>` : ''}
        <div class="declaration"><p>I hereby declare that the above information is true and correct to the best of my knowledge.</p></div>
        <div class="signature"><p>Place: ${data.place||''}</p><p>Date: ${data.date||''}</p><p>Signature: ${data.name||''}</p></div>
    </div></body></html>`;
}
