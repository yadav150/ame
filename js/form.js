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
    const db = firebase.firestore();

    // ---------- Auth & Navbar ----------
    const authLink = document.getElementById('authLink');
    const userDisplay = document.getElementById('userDisplay');
    const userNameSpan = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');
    const dashboardLink = document.getElementById('dashboardLink');

    let inactivityTimer;
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            auth.signOut().then(() => {
                alert('Logged out due to inactivity.');
                window.location.href = 'index.html';
            });
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
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => document.querySelector('.nav-links').classList.toggle('show'));
    }

    // ---------- Form Data Persistence ----------
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
            skills: document.getElementById('skills').value,
            address: document.getElementById('address').value,
            category: document.getElementById('category').value,
            marital: document.getElementById('maritalStatus').value,
            education: [],
            experience: [],
            otherQual: []
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
            data.experience.push({
                company: entry.querySelector('.expCompany')?.value,
                role: entry.querySelector('.expRole')?.value,
                duration: entry.querySelector('.expDuration')?.value,
                description: entry.querySelector('.expDesc')?.value
            });
        });
        document.querySelectorAll('.other-entry').forEach(entry => {
            data.otherQual.push({
                qual: entry.querySelector('.qualName')?.value,
                inst: entry.querySelector('.institute')?.value,
                year: entry.querySelector('.qualYear')?.value,
                score: entry.querySelector('.score')?.value,
                duration: entry.querySelector('.duration')?.value
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
        document.getElementById('skills').value = data.skills || '';
        document.getElementById('address').value = data.address || '';
        document.getElementById('category').value = data.category || '';
        document.getElementById('maritalStatus').value = data.marital || '';

        const eduContainer = document.getElementById('educationContainer');
        eduContainer.innerHTML = '';
        data.education.forEach(edu => {
            const div = document.createElement('div');
            div.className = 'education-entry';
            div.innerHTML = `
                <div class="form-row">
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
                    </select>
                </div>`;
            eduContainer.appendChild(div);
        });

        const expContainer = document.getElementById('experienceContainer');
        expContainer.innerHTML = '';
        data.experience.forEach(exp => {
            const div = document.createElement('div');
            div.className = 'experience-entry';
            div.innerHTML = `
                <div class="form-row">
                    <div class="form-group"><label>Company/Organization <span class="req">*</span></label><input type="text" class="expCompany" required value="${exp.company||''}"></div>
                    <div class="form-group"><label>Role/Designation <span class="req">*</span></label><input type="text" class="expRole" required value="${exp.role||''}"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Duration <span class="req">*</span></label><input type="text" class="expDuration" required value="${exp.duration||''}"></div>
                    <div class="form-group"><label>Description</label><input type="text" class="expDesc" value="${exp.description||''}"></div>
                </div>`;
            expContainer.appendChild(div);
        });

        const qualContainer = document.getElementById('otherQualContainer');
        qualContainer.innerHTML = '';
        data.otherQual.forEach(q => {
            const div = document.createElement('div');
            div.className = 'other-entry';
            div.innerHTML = `
                <div class="form-row">
                    <div class="form-group"><label>Qualification Name</label><input type="text" class="qualName" value="${q.qual||''}"></div>
                    <div class="form-group"><label>Institute/Organization</label><input type="text" class="institute" value="${q.inst||''}"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Passing Year</label><input type="text" class="qualYear" value="${q.year||''}"></div>
                    <div class="form-group"><label>Score/Grade</label><input type="text" class="score" value="${q.score||''}"></div>
                </div>
                <div class="form-group"><label>Duration</label><input type="text" class="duration" value="${q.duration||''}"></div>`;
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
        if (stepNumber === 4) return true; // Other Qualifications is optional
        const stepEl = document.getElementById(`step${stepNumber}`);
        const requiredFields = stepEl.querySelectorAll('[required]');
        let valid = true;
        requiredFields.forEach(field => {
            if (field.type === 'checkbox' && !field.checked) {
                field.classList.add('error'); valid = false;
            } else if (field.type === 'file' && field.files.length === 0) {
                field.classList.add('error'); valid = false;
            } else if (!field.value.trim()) {
                field.classList.add('error'); valid = false;
            } else {
                field.classList.remove('error');
            }
        });
        if (!valid) {
            const firstError = stepEl.querySelector('.error');
            if (firstError) firstError.focus();
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
        entry.innerHTML = `
            <div class="form-row">
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
        entry.innerHTML = `
            <div class="form-row">
                <div class="form-group"><label>Company/Organization <span class="req">*</span></label><input type="text" class="expCompany" required></div>
                <div class="form-group"><label>Role/Designation <span class="req">*</span></label><input type="text" class="expRole" required></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Duration <span class="req">*</span></label><input type="text" class="expDuration" required></div>
                <div class="form-group"><label>Description</label><input type="text" class="expDesc"></div>
            </div>`;
        document.getElementById('experienceContainer').appendChild(entry);
    });

    document.getElementById('addOtherQual').addEventListener('click', () => {
        const entry = document.createElement('div');
        entry.className = 'other-entry';
        entry.innerHTML = `
            <div class="form-row">
                <div class="form-group"><label>Qualification Name</label><input type="text" class="qualName"></div>
                <div class="form-group"><label>Institute/Organization</label><input type="text" class="institute"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Passing Year</label><input type="text" class="qualYear"></div>
                <div class="form-group"><label>Score/Grade</label><input type="text" class="score"></div>
            </div>
            <div class="form-group"><label>Duration</label><input type="text" class="duration" placeholder="6 months"></div>`;
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
            alert('Please log in to download your resume. Your data will be restored after login.');
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
            skills: document.getElementById('skills').value,
            address: document.getElementById('address').value,
            category: document.getElementById('category').value,
            marital: document.getElementById('maritalStatus').value,
            place: document.getElementById('place').value || 'Guwahati',
            date: document.getElementById('dateAuto').value,
            education: [],
            experience: [],
            otherQual: [],
            photo: null
        };

        document.querySelectorAll('.education-entry').forEach(entry => {
            const exam = entry.querySelector('.examName')?.value;
            const board = entry.querySelector('.board')?.value;
            if (exam && board) data.education.push({
                exam, board,
                year: entry.querySelector('.passYear')?.value,
                percent: entry.querySelector('.percentage')?.value,
                division: entry.querySelector('.division')?.value
            });
        });
        document.querySelectorAll('.experience-entry').forEach(entry => {
            const company = entry.querySelector('.expCompany')?.value;
            const role = entry.querySelector('.expRole')?.value;
            if (company && role) data.experience.push({
                company, role,
                duration: entry.querySelector('.expDuration')?.value,
                description: entry.querySelector('.expDesc')?.value
            });
        });
        document.querySelectorAll('.other-entry').forEach(entry => {
            const qual = entry.querySelector('.qualName')?.value;
            const inst = entry.querySelector('.institute')?.value;
            if (qual && inst) data.otherQual.push({
                qual, inst,
                year: entry.querySelector('.qualYear')?.value,
                score: entry.querySelector('.score')?.value,
                duration: entry.querySelector('.duration')?.value
            });
        });

        const photoFile = document.getElementById('photoUpload').files[0];
        if (photoFile) data.photo = await readFileAsDataURL(photoFile);

        const template = localStorage.getItem('selectedTemplate') || 'elf';
        const html = buildResumeHTML(data, template);

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
            const imgWidth = 210 - margin*2;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = margin;

            const themeColors = {
                elf:'#c9a84c', dwarf:'#d4782f', fae:'#e891b9', dragon:'#d4a017', necro:'#b8a9d4',
                angel:'#f0d78c', mermaid:'#7ec8c8', celestial:'#b39dd8', modern:'#2c3e50'
            };
            const borderColor = themeColors[template] || '#c9a84c';

            pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
            pdf.setDrawColor(borderColor);
            pdf.setLineWidth(0.8);
            pdf.rect(margin-1, margin-1, imgWidth+2, 297 - margin*2 + 2, 'S');
            heightLeft -= (297 - margin*2);
            while (heightLeft > 0) {
                position = margin - (imgHeight - heightLeft);
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                pdf.setDrawColor(borderColor);
                pdf.rect(margin-1, margin-1, imgWidth+2, 297 - margin*2 + 2, 'S');
                heightLeft -= (297 - margin*2);
            }
            pdf.save(`${data.name.replace(/\s+/g, '_')}_Resume.pdf`);
            document.getElementById('successMessage').style.display = 'flex';
            document.querySelector('#successMessage h3').textContent = '✅ Resume Downloaded & Saved!';
            document.querySelector('#successMessage p').textContent = 'Your resume has been saved to your dashboard.';
            saveResumeToFirestore(user.uid, data, template);
        }).catch(err => {
            console.error('PDF error:', err);
            alert('Something went wrong while generating PDF.');
        });
    });

    document.getElementById('closeSuccess').addEventListener('click', () => {
        document.getElementById('successMessage').style.display = 'none';
    });

    const urlParams = new URLSearchParams(window.location.search);
    const template = urlParams.get('template');
    if (!template) {
        window.location.href = 'templates.html';
        return;
    }
    localStorage.setItem('selectedTemplate', template);
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

function saveResumeToFirestore(uid, data, template) {
    const { photo, ...cleanData } = data;
    firebase.firestore().collection('resumes').add({
        uid,
        name: data.name,
        template,
        data: cleanData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        console.log('Resume saved');
        alert('Resume saved to your dashboard successfully!');
    }).catch(err => {
        console.error('Firestore save error:', err);
        alert('Failed to save resume to cloud. Please try again.');
    });
}

function buildResumeHTML(data, template) {
    if (template === 'modern') return buildModernResume(data);

    const themes = {
        elf: { bg: '#f5f1e3', border: '#c9a84c', text: '#2d5a27', accent: '#c9a84c', headerBg: '#fdfcf5', font: "'Georgia', serif" },
        dwarf: { bg: '#fdf5e6', border: '#d4782f', text: '#4a2c17', accent: '#d4782f', headerBg: '#fdf0e0', font: "'Georgia', serif" },
        fae: { bg: '#fef9ff', border: '#e891b9', text: '#8b5cf6', accent: '#e891b9', headerBg: '#fdf0fa', font: "'Georgia', serif" },
        dragon: { bg: '#1c0f0f', border: '#d4a017', text: '#e0d5c0', accent: '#d4a017', headerBg: '#2a1515', font: "'Georgia', serif", dark: true },
        necro: { bg: '#111016', border: '#b8a9d4', text: '#d5cde8', accent: '#b8a9d4', headerBg: '#1a1822', font: "'Georgia', serif", dark: true },
        angel: { bg: '#fdfcff', border: '#f0d78c', text: '#4a3b2f', accent: '#f0d78c', headerBg: '#fff9ef', font: "'Georgia', serif" },
        mermaid: { bg: '#f0faff', border: '#7ec8c8', text: '#2e4a4a', accent: '#7ec8c8', headerBg: '#e8f7f7', font: "'Georgia', serif" },
        celestial: { bg: '#f9f4ff', border: '#b39dd8', text: '#3d2b4f', accent: '#b39dd8', headerBg: '#f3ecff', font: "'Georgia', serif" }
    };
    const t = themes[template] || themes.elf;
    const sectionStyle = `background:${t.accent};color:#fff;font-family:Arial;padding:8px 10px;margin:5px 0;border-radius:5px;`;
    const tableStyle = `border:1px solid #555;border-radius:5px;border-collapse:separate;border-spacing:0;width:100%;`;
    const photoStyle = `width:110px;height:130px;border:2px solid ${t.border};border-radius:5px;float:right;margin-left:20px;object-fit:cover;`;

    let eduRows = data.education.map(e => `<tr><td>${e.exam}</td><td>${e.board}</td><td>${e.year}</td><td>${e.percent}</td><td>${e.division}</td></tr>`).join('');
    let qualRows = data.otherQual.map(q => `<tr><td>${q.qual}</td><td>${q.inst}</td><td>${q.year}</td><td>${q.score}</td><td>${q.duration}</td></tr>`).join('');

    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
        *{box-sizing:border-box}body{font-family:${t.font};background:${t.bg};color:${t.text};margin:0;padding:0}
        .resume-page{width:780px;margin:0 auto;padding:30px;border:3px solid ${t.border};border-radius:4px;background:${t.bg};page-break-after:always}
        .resume-page:last-child{page-break-after:auto}
        .resume-header{text-align:center;margin-bottom:15px}
        .resume-header h1{margin:0;font-size:2rem;color:${t.accent};text-transform:uppercase;letter-spacing:3px;font-family:Arial}
        .applicant-name{font-size:1.5rem;font-weight:bold;color:${t.text};text-align:left;margin-bottom:15px}
        .photo-container{float:right;margin-left:20px}
        .photo-container img{${photoStyle}}
        .section-heading{${sectionStyle}}
        table{${tableStyle}}
        th,td{border:1px solid #555;padding:6px 8px;text-align:left;font-size:0.85rem;font-family:${t.font}}
        th{background:${t.headerBg}}
        .info-table td:first-child{font-weight:bold;width:30%}
        .declaration{margin-top:20px;font-size:0.9rem}
        .signature{margin-top:30px;text-align:right}
        .clearfix::after{content:"";display:table;clear:both}
    </style></head><body>
    <div class="resume-page">
        <div class="resume-header"><h1>Resume</h1></div>
        <div class="applicant-name">${data.name||'Your Name'}</div>
        <div class="clearfix">
            ${data.photo ? `<div class="photo-container"><img src="${data.photo}"></div>`:''}
            <div class="section-heading">Personal Details</div>
            <table class="info-table">
                <tr><td>Father's Name</td><td>${data.father||''}</td></tr>
                <tr><td>Mother's Name</td><td>${data.mother||''}</td></tr>
                <tr><td>Mobile</td><td>${data.mobile||''}</td></tr>
                <tr><td>Email</td><td>${data.email||''}</td></tr>
                <tr><td>Date of Birth</td><td>${data.dob||''}</td></tr>
                <tr><td>Gender</td><td>${data.gender||''}</td></tr>
                <tr><td>Languages</td><td>${data.languages||''}</td></tr>
                <tr><td>Skills</td><td>${data.skills||''}</td></tr>
                <tr><td>Address</td><td>${data.address||''}</td></tr>
                <tr><td>Category</td><td>${data.category||''}</td></tr>
                <tr><td>Marital Status</td><td>${data.marital||''}</td></tr>
            </table>
        </div>
        <div class="section-heading">Educational Qualifications</div>
        <table><tr><th>Exam</th><th>Board/University</th><th>Year</th><th>Percentage</th><th>Division</th></tr>${eduRows}</table>
        ${data.otherQual.length ? `<div class="section-heading">Other Qualifications</div><table><tr><th>Qualification</th><th>Institute</th><th>Year</th><th>Score</th><th>Duration</th></tr>${qualRows}</table>` : ''}
        <div class="declaration"><p>I declare that all information provided is true and correct.</p></div>
        <div class="signature"><p>Place: ${data.place||''}</p><p>Date: ${data.date||''}</p><p>Signature: ${data.name||''}</p></div>
    </div></body></html>`;
}

function buildModernResume(data) {
    const sidebarBg = '#f8f9fa';
    const darkBar = '#2c3e50';
    const textLight = '#555';
    const timelineColor = '#bdc3c7';

    let eduTimeline = data.education.map(e => `
        <div class="tl-item">
            <div class="tl-marker"></div>
            <div class="tl-content">
                <span class="tl-year">${e.year||''}</span>
                <h4>${e.exam||''}</h4>
                <p>${e.board||''} — ${e.percent||''}%, ${e.division||''}</p>
            </div>
        </div>`).join('');

    let expTimeline = data.experience.map(exp => `
        <div class="tl-item">
            <div class="tl-marker"></div>
            <div class="tl-content">
                <span class="tl-year">${exp.duration||''}</span>
                <h4>${exp.role||''}</h4>
                <p>${exp.company||''} — ${exp.description||''}</p>
            </div>
        </div>`).join('');

    let qualTimeline = data.otherQual.map(q => `
        <div class="tl-item">
            <div class="tl-marker"></div>
            <div class="tl-content">
                <span class="tl-year">${q.year||''}</span>
                <h4>${q.qual||''}</h4>
                <p>${q.inst||''} — ${q.score||''}, ${q.duration||''}</p>
            </div>
        </div>`).join('');

    let skillsTags = data.skills ? data.skills.split(',').map(s => `<span class="skill-tag">${s.trim()}</span>`).join('') : '';
    let langTags = data.languages ? data.languages.split(',').map(l => `<span class="skill-tag">${l.trim()}</span>`).join('') : '';

    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'Segoe UI',Arial,sans-serif;background:white;color:#2c3e50;margin:0;padding:0}
        .resume-page{width:780px;margin:0 auto;display:flex;border:1px solid #ddd;background:white;page-break-after:always}
        .resume-page:last-child{page-break-after:auto}
        .sidebar{width:40%;background:${sidebarBg};padding:25px 18px;text-align:center;display:flex;flex-direction:column;align-items:center}
        .profile-photo{width:120px;height:120px;border-radius:50%;object-fit:cover;border:3px solid ${darkBar};margin-bottom:15px}
        .sidebar h2{font-size:1.8rem;color:${darkBar};margin-bottom:5px;font-family:Georgia,serif}
        .sidebar .job-title{font-size:0.9rem;text-transform:uppercase;letter-spacing:2px;color:${textLight};margin-bottom:20px}
        .contact-info{text-align:left;margin-bottom:25px;font-size:0.85rem}
        .contact-row{display:flex;align-items:center;margin-bottom:8px}
        .contact-icon{width:20px;margin-right:8px;font-weight:bold;color:${darkBar}}
        .sidebar-section{width:100%;margin-bottom:20px}
        .sidebar-bar{background:${darkBar};color:white;padding:6px 12px;font-size:0.9rem;font-weight:bold;text-transform:uppercase;letter-spacing:1px;border-radius:3px;margin-bottom:10px}
        .skill-tag{display:inline-block;background:white;border:1px solid #ccc;padding:3px 10px;margin:4px;border-radius:20px;font-size:0.8rem;color:#2c3e50}
        .main{width:60%;background:white;padding:25px}
        .main-bar{background:${darkBar};color:white;padding:7px 14px;font-size:0.95rem;font-weight:bold;text-transform:uppercase;letter-spacing:1px;border-radius:3px;margin-bottom:15px}
        .timeline{position:relative;padding-left:30px;margin-bottom:15px}
        .timeline::before{content:'';position:absolute;left:14px;top:5px;bottom:0;width:2px;background:${timelineColor}}
        .tl-item{position:relative;margin-bottom:18px}
        .tl-marker{position:absolute;left:-30px;top:4px;width:10px;height:10px;border-radius:50%;background:${darkBar};border:2px solid white;box-shadow:0 0 0 2px ${darkBar}}
        .tl-year{font-size:0.75rem;color:${textLight};font-weight:bold}
        .tl-content h4{font-size:0.95rem;margin:3px 0 2px;color:#2c3e50}
        .tl-content p{font-size:0.8rem;color:${textLight};line-height:1.4}
        .declaration{margin-top:20px;font-size:0.85rem;color:${textLight}}
        .signature{margin-top:20px;text-align:right;font-size:0.85rem}
    </style></head><body>
    <div class="resume-page">
        <div class="sidebar">
            ${data.photo ? `<img src="${data.photo}" class="profile-photo">`: '<div class="profile-photo" style="background:#ccc;"></div>'}
            <h2>${data.name||'Full Name'}</h2>
            <div class="job-title">${data.experience?.[0]?.role || 'Professional'}</div>
            <div class="contact-info">
                <div class="contact-row"><span class="contact-icon">📞</span> ${data.mobile||''}</div>
                <div class="contact-row"><span class="contact-icon">✉️</span> ${data.email||''}</div>
                <div class="contact-row"><span class="contact-icon">📍</span> ${data.address||''}</div>
            </div>
            <div class="sidebar-section"><div class="sidebar-bar">Skills</div><div>${skillsTags}</div></div>
            <div class="sidebar-section"><div class="sidebar-bar">Languages</div><div>${langTags}</div></div>
            <div class="sidebar-section"><div class="sidebar-bar">Personal Info</div>
                <p style="font-size:0.8rem;">DOB: ${data.dob||''}</p>
                <p style="font-size:0.8rem;">Gender: ${data.gender||''}</p>
                <p style="font-size:0.8rem;">Category: ${data.category||''}</p>
                <p style="font-size:0.8rem;">Marital: ${data.marital||''}</p>
            </div>
        </div>
        <div class="main">
            ${data.education.length ? `<div><div class="main-bar">Education</div><div class="timeline">${eduTimeline}</div></div>` : ''}
            ${data.experience.length ? `<div><div class="main-bar">Experience</div><div class="timeline">${expTimeline}</div></div>` : ''}
            ${data.otherQual.length ? `<div><div class="main-bar">Other Qualifications</div><div class="timeline">${qualTimeline}</div></div>` : ''}
            <div class="declaration"><p>I declare that the above information is true and correct.</p></div>
            <div class="signature"><p>Place: ${data.place||''}</p><p>Date: ${data.date||''}</p><p>${data.name||''}</p></div>
        </div>
    </div></body></html>`;
}
