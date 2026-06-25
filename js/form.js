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
            if (emailField && !emailField.value) {
                emailField.value = user.email;
            }
            restoreFormData();
        } else {
            authLink.style.display = 'block';
            userDisplay.style.display = 'none';
            if (dashboardLink) dashboardLink.style.display = 'none';
        }
    });

    logoutBtn.addEventListener('click', () => {
        auth.signOut().then(() => {
            window.location.href = 'index.html';
        });
    });

    // Hamburger toggle
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', () => {
            document.getElementById('navLinks').classList.toggle('show');
        });
    }

    // ---------- Save / Restore Form Data ----------
    function saveFormData() {
        const formData = {
            applicantName: document.getElementById('applicantName').value,
            fatherName: document.getElementById('fatherName').value,
            dob: document.getElementById('dob').value,
            marital: document.getElementById('maritalStatus').value,
            permanentAddress: document.getElementById('permanentAddress').value,
            temporaryAddress: document.getElementById('temporaryAddress').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            nationality: document.getElementById('nationality').value,
            objective: document.getElementById('objective').value,
            education: [],
            experience: [],
            skills: document.getElementById('skills').value,
            languages: document.getElementById('languages').value,
            certifications: document.getElementById('certifications').value,
            training: document.getElementById('training').value,
            projects: document.getElementById('projects').value,
            awards: document.getElementById('awards').value,
            references: document.getElementById('references').value,
            interests: document.getElementById('interests').value,
            place: document.getElementById('place').value,
            date: document.getElementById('dateAuto').value
        };
        document.querySelectorAll('.education-entry').forEach(entry => {
            formData.education.push({
                qualification: entry.querySelector('.qualification')?.value,
                passYear: entry.querySelector('.passYear')?.value,
                institute: entry.querySelector('.institute')?.value,
                board: entry.querySelector('.board')?.value,
                percentage: entry.querySelector('.percentage')?.value
            });
        });
        document.querySelectorAll('.experience-entry').forEach(entry => {
            formData.experience.push({
                jobTitle: entry.querySelector('.jobTitle')?.value,
                company: entry.querySelector('.company')?.value,
                duration: entry.querySelector('.duration')?.value,
                responsibilities: entry.querySelector('.responsibilities')?.value,
                achievements: entry.querySelector('.achievements')?.value
            });
        });
        localStorage.setItem('savedFormData', JSON.stringify(formData));
    }

    function restoreFormData() {
        const saved = localStorage.getItem('savedFormData');
        if (!saved) return;
        const data = JSON.parse(saved);
        document.getElementById('applicantName').value = data.applicantName || '';
        document.getElementById('fatherName').value = data.fatherName || '';
        document.getElementById('dob').value = data.dob || '';
        document.getElementById('maritalStatus').value = data.marital || '';
        document.getElementById('permanentAddress').value = data.permanentAddress || '';
        document.getElementById('temporaryAddress').value = data.temporaryAddress || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('phone').value = data.phone || '';
        document.getElementById('nationality').value = data.nationality || '';
        document.getElementById('objective').value = data.objective || '';
        document.getElementById('skills').value = data.skills || '';
        document.getElementById('languages').value = data.languages || '';
        document.getElementById('certifications').value = data.certifications || '';
        document.getElementById('training').value = data.training || '';
        document.getElementById('projects').value = data.projects || '';
        document.getElementById('awards').value = data.awards || '';
        document.getElementById('references').value = data.references || '';
        document.getElementById('interests').value = data.interests || '';
        document.getElementById('place').value = data.place || '';
        document.getElementById('dateAuto').value = data.date || '';

        const eduContainer = document.getElementById('educationContainer');
        eduContainer.innerHTML = '';
        data.education.forEach(edu => {
            const div = document.createElement('div');
            div.className = 'education-entry';
            div.innerHTML = `
                <div class="form-row">
                    <div class="form-group"><label>Qualification <span class="req">*</span></label><input type="text" class="qualification" required value="${edu.qualification||''}"></div>
                    <div class="form-group"><label>Year of Passing <span class="req">*</span></label><input type="text" class="passYear" required value="${edu.passYear||''}"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Institute <span class="req">*</span></label><input type="text" class="institute" required value="${edu.institute||''}"></div>
                    <div class="form-group"><label>Board / University <span class="req">*</span></label><input type="text" class="board" required value="${edu.board||''}"></div>
                </div>
                <div class="form-group"><label>Percentage / CGPA <span class="req">*</span></label><input type="text" class="percentage" required value="${edu.percentage||''}"></div>`;
            eduContainer.appendChild(div);
        });

        const expContainer = document.getElementById('experienceContainer');
        expContainer.innerHTML = '';
        data.experience.forEach(exp => {
            const div = document.createElement('div');
            div.className = 'experience-entry';
            div.innerHTML = `
                <div class="form-row">
                    <div class="form-group"><label>Job Title <span class="req">*</span></label><input type="text" class="jobTitle" required value="${exp.jobTitle||''}"></div>
                    <div class="form-group"><label>Company Name <span class="req">*</span></label><input type="text" class="company" required value="${exp.company||''}"></div>
                </div>
                <div class="form-group"><label>Duration <span class="req">*</span></label><input type="text" class="duration" required value="${exp.duration||''}"></div>
                <div class="form-group"><label>Responsibilities <span class="req">*</span></label><textarea class="responsibilities" required rows="4">${exp.responsibilities||''}</textarea></div>
                <div class="form-group"><label>Achievements (optional)</label><input type="text" class="achievements" value="${exp.achievements||''}"></div>`;
            expContainer.appendChild(div);
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
            const label = field.closest('.form-group')?.querySelector('label')?.textContent?.replace(/\*/g,'').trim() || 'field';
            if (field.type === 'checkbox' && !field.checked) {
                missing.push(label);
                field.classList.add('error');
                valid = false;
            } else if (field.type === 'file' && field.files.length === 0) {
                missing.push(label);
                field.classList.add('error');
                valid = false;
            } else if (field.tagName === 'SELECT' && field.value === '') {
                missing.push(label);
                field.classList.add('error');
                valid = false;
            } else if (!field.value.trim()) {
                missing.push(label);
                field.classList.add('error');
                valid = false;
            } else {
                field.classList.remove('error');
            }
        });
        if (!valid) {
            alert('Please fill in these fields:\n• ' + missing.join('\n• '));
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
                <div class="form-group"><label>Qualification <span class="req">*</span></label><input type="text" class="qualification" required></div>
                <div class="form-group"><label>Year of Passing <span class="req">*</span></label><input type="text" class="passYear" required></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Institute <span class="req">*</span></label><input type="text" class="institute" required></div>
                <div class="form-group"><label>Board / University <span class="req">*</span></label><input type="text" class="board" required></div>
            </div>
            <div class="form-group"><label>Percentage / CGPA <span class="req">*</span></label><input type="text" class="percentage" required></div>`;
        document.getElementById('educationContainer').appendChild(entry);
    });

    document.getElementById('addExperience').addEventListener('click', () => {
        const entry = document.createElement('div');
        entry.className = 'experience-entry';
        entry.innerHTML = `
            <div class="form-row">
                <div class="form-group"><label>Job Title <span class="req">*</span></label><input type="text" class="jobTitle" required></div>
                <div class="form-group"><label>Company Name <span class="req">*</span></label><input type="text" class="company" required></div>
            </div>
            <div class="form-group"><label>Duration <span class="req">*</span></label><input type="text" class="duration" required></div>
            <div class="form-group"><label>Responsibilities <span class="req">*</span></label><textarea class="responsibilities" required rows="4"></textarea></div>
            <div class="form-group"><label>Achievements (optional)</label><input type="text" class="achievements"></div>`;
        document.getElementById('experienceContainer').appendChild(entry);
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
            dob: document.getElementById('dob').value,
            marital: document.getElementById('maritalStatus').value,
            permanentAddress: document.getElementById('permanentAddress').value,
            temporaryAddress: document.getElementById('temporaryAddress').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            nationality: document.getElementById('nationality').value,
            objective: document.getElementById('objective').value,
            education: [],
            experience: [],
            skills: document.getElementById('skills').value,
            languages: document.getElementById('languages').value,
            certifications: document.getElementById('certifications').value,
            training: document.getElementById('training').value,
            projects: document.getElementById('projects').value,
            awards: document.getElementById('awards').value,
            references: document.getElementById('references').value,
            interests: document.getElementById('interests').value,
            place: document.getElementById('place').value || 'Guwahati',
            date: document.getElementById('dateAuto').value,
            photo: null
        };

        document.querySelectorAll('.education-entry').forEach(entry => {
            const qualification = entry.querySelector('.qualification')?.value;
            const passYear = entry.querySelector('.passYear')?.value;
            if (qualification) data.education.push({
                qualification,
                passYear,
                institute: entry.querySelector('.institute')?.value,
                board: entry.querySelector('.board')?.value,
                percentage: entry.querySelector('.percentage')?.value
            });
        });

        document.querySelectorAll('.experience-entry').forEach(entry => {
            const jobTitle = entry.querySelector('.jobTitle')?.value;
            const company = entry.querySelector('.company')?.value;
            if (jobTitle && company) data.experience.push({
                jobTitle,
                company,
                duration: entry.querySelector('.duration')?.value,
                responsibilities: entry.querySelector('.responsibilities')?.value,
                achievements: entry.querySelector('.achievements')?.value
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
            const borderColor = '#7f8c8d'; // formal grey

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

    // Only support formal template now
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
    }).catch(err => {
        console.error('Firestore save error:', err);
        alert('Failed to save resume to cloud. Please try again.');
    });
}

function buildFormalResume(data) {
    const greyBar = '#d5d8dc';
    const borderColor = '#7f8c8d';
    const textColor = '#2c3e50';

    // Education rows
    let eduRows = data.education.map(e => `
        <tr>
            <td>${e.qualification || ''}</td>
            <td>${e.passYear || ''}</td>
            <td>${e.institute || ''}</td>
            <td>${e.board || ''}</td>
            <td>${e.percentage || ''}</td>
        </tr>`).join('');

    // Experience blocks
    let expBlocks = data.experience.map(exp => `
        <div style="margin-bottom: 15px;">
            <strong>${exp.jobTitle || ''}</strong> – ${exp.company || ''}<br>
            <em>${exp.duration || ''}</em>
            <p style="white-space: pre-line; margin: 5px 0;">${exp.responsibilities || ''}</p>
            ${exp.achievements ? `<p><strong>Achievements:</strong> ${exp.achievements}</p>` : ''}
        </div>`).join('');

    // Optional sections helper
    function optionalSection(title, content) {
        if (!content) return '';
        return `<div style="margin-bottom: 15px;">
            <div style="background: ${greyBar}; padding: 5px 10px; font-weight: bold; margin: 10px 0;">${title}</div>
            <p>${content}</p>
        </div>`;
    }

    let additionalSections = '';
    additionalSections += optionalSection('Skills', data.skills);
    additionalSections += optionalSection('Languages', data.languages);
    additionalSections += optionalSection('Certifications', data.certifications);
    additionalSections += optionalSection('Training / Workshops', data.training);
    additionalSections += optionalSection('Projects', data.projects);
    additionalSections += optionalSection('Awards', data.awards);
    additionalSections += optionalSection('References', data.references);
    additionalSections += optionalSection('Interests / Hobbies', data.interests);

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            color: ${textColor};
            background: white;
            margin: 0;
            padding: 0;
        }
        .page {
            width: 780px;
            margin: 0 auto;
            padding: 25px;
            background: white;
            border: 1px solid #aaa;
            page-break-after: always;
        }
        .page:last-child { page-break-after: auto; }
        .header {
            text-align: center;
            margin-bottom: 20px;
            position: relative;
        }
        .header h1 {
            font-size: 2rem;
            text-decoration: underline;
            margin-bottom: 10px;
            color: ${textColor};
        }
        .photo {
            position: absolute;
            right: 0;
            top: 0;
            width: 110px;
            height: 130px;
            border: 1px solid #aaa;
            object-fit: cover;
        }
        .section-bar {
            background: ${greyBar};
            padding: 6px 10px;
            font-weight: bold;
            margin: 15px 0 10px;
            text-transform: uppercase;
            font-size: 0.9rem;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 10px;
        }
        th, td {
            border: 1px solid #aaa;
            padding: 5px 8px;
            text-align: left;
            font-size: 0.85rem;
        }
        th {
            background: #f0f0f0;
        }
        .profile-table td:first-child {
            font-weight: bold;
            width: 35%;
        }
        .declaration {
            margin-top: 30px;
            font-size: 0.9rem;
        }
        .signature {
            margin-top: 20px;
            text-align: right;
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            <h1>Curriculum Vitae</h1>
            ${data.photo ? `<img src="${data.photo}" class="photo" alt="photo">` : ''}
        </div>

        <div class="section-bar">Personal Profile</div>
        <table class="profile-table">
            <tr><td>Name</td><td>${data.name || ''}</td></tr>
            <tr><td>Father's Name</td><td>${data.father || ''}</td></tr>
            <tr><td>Date of Birth</td><td>${data.dob || ''}</td></tr>
            <tr><td>Permanent Address</td><td>${data.permanentAddress || ''}</td></tr>
            <tr><td>Temporary Address</td><td>${data.temporaryAddress || ''}</td></tr>
            <tr><td>Email</td><td>${data.email || ''}</td></tr>
            <tr><td>Phone</td><td>${data.phone || ''}</td></tr>
            <tr><td>Nationality</td><td>${data.nationality || ''}</td></tr>
            <tr><td>Marital Status</td><td>${data.marital || ''}</td></tr>
        </table>

        <div class="section-bar">Professional Objective</div>
        <p>${data.objective || ''}</p>

        <div class="section-bar">Academic Qualifications</div>
        <table>
            <tr><th>Qualification</th><th>Year</th><th>Institute</th><th>Board/University</th><th>Percentage/CGPA</th></tr>
            ${eduRows}
        </table>

        ${data.experience.length > 0 ? `
        <div class="section-bar">Professional Experience</div>
        ${expBlocks}
        ` : ''}

        ${additionalSections}

        <div class="declaration">
            <p>I hereby declare that all the information provided above is true and correct to the best of my knowledge.</p>
        </div>
        <div class="signature">
            <p>Place: ${data.place || ''}</p>
            <p>Date: ${data.date || ''}</p>
            <p>Signature: ${data.name || ''}</p>
        </div>
    </div>
</body>
</html>`;
}
