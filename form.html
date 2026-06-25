// form.js
document.addEventListener('DOMContentLoaded', () => {
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

    // Auth & Navbar
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
    ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'].forEach(e => document.addEventListener(e, resetInactivityTimer));
    resetInactivityTimer();

    auth.onAuthStateChanged(user => {
        if (user) {
            authLink.style.display = 'none';
            userDisplay.style.display = 'flex';
            userNameSpan.textContent = user.displayName || user.email;
            if (dashboardLink) dashboardLink.style.display = 'inline-block';
            const emailField = document.getElementById('email');
            if (emailField && !emailField.value) emailField.value = user.email || '';
            restoreFormData();
        } else {
            authLink.style.display = 'block';
            userDisplay.style.display = 'none';
            if (dashboardLink) dashboardLink.style.display = 'none';
        }
    });
    logoutBtn.addEventListener('click', () => auth.signOut().then(() => window.location.href = 'index.html'));
    document.getElementById('hamburgerBtn').addEventListener('click', () => document.getElementById('navLinks').classList.toggle('show'));

    // Photo preview
    document.getElementById('photoUpload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        const preview = document.getElementById('photoPreview');
        if (file && file.size <= 102400) {
            const reader = new FileReader();
            reader.onload = (e) => { preview.src = e.target.result; preview.style.display = 'block'; };
            reader.readAsDataURL(file);
            this.classList.remove('error');
        } else {
            preview.style.display = 'none';
            this.classList.add('error');
        }
    });

    // ---------- Multi‑select helper ----------
    function createMultiSelect(wrapperId, displayId, dropdownId, searchId, listId, countId, hiddenId, options, maxSelect) {
        const display = document.getElementById(displayId);
        const dropdown = document.getElementById(dropdownId);
        const search = document.getElementById(searchId);
        const list = document.getElementById(listId);
        const countSpan = document.getElementById(countId);
        const hidden = document.getElementById(hiddenId);
        let selected = [];

        function render(filter = '') {
            list.innerHTML = '';
            const filtered = options.filter(o => o.toLowerCase().includes(filter.toLowerCase()));
            filtered.forEach(opt => {
                const label = document.createElement('label');
                label.className = 'checkbox-item';
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.value = opt;
                cb.checked = selected.includes(opt);
                cb.addEventListener('change', () => {
                    if (cb.checked) {
                        if (selected.length >= maxSelect) { cb.checked = false; alert(`Max ${maxSelect} allowed`); return; }
                        selected.push(opt);
                    } else {
                        selected = selected.filter(s => s !== opt);
                    }
                    updateDisplay();
                    render(search.value);
                });
                label.appendChild(cb);
                label.appendChild(document.createTextNode(' ' + opt));
                list.appendChild(label);
            });
            countSpan.textContent = `${selected.length} / ${maxSelect} selected`;
        }

        function updateDisplay() {
            if (selected.length === 0) {
                display.innerHTML = '<span class="placeholder-text">Click to select...</span>';
            } else {
                display.innerHTML = selected.map(s => `<span class="selected-skill-tag">${s} <span class="remove-tag" data-value="${s}">×</span></span>`).join('');
                document.querySelectorAll(`#${displayId} .remove-tag`).forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        selected = selected.filter(s => s !== btn.dataset.value);
                        updateDisplay();
                        render(search.value);
                    });
                });
            }
            hidden.value = selected.join(', ');
            if (selected.length > 0) hidden.classList.remove('error'); else hidden.classList.add('error');
        }

        display.addEventListener('click', (e) => { e.stopPropagation(); dropdown.classList.toggle('open'); render(search.value); });
        document.addEventListener('click', () => dropdown.classList.remove('open'));
        dropdown.addEventListener('click', e => e.stopPropagation());
        search.addEventListener('input', () => render(search.value));
        render();
        return { getSelected: () => selected, setSelected: (arr) => { selected = arr; updateDisplay(); render(); } };
    }

    // Skills (max 3)
    const skillsMulti = createMultiSelect('skillsWrapper', 'skillsDisplay', 'skillsDropdown', 'skillSearch', 'skillsCheckboxList', 'skillCount', 'skillsHidden', [
        'Web Development','Graphic Design','Project Management','Digital Marketing','Content Writing','Data Analysis',
        'Public Speaking','Team Leadership','Microsoft Office','Communication','Problem Solving','Time Management',
        'Customer Service','Social Media','SEO','Programming','Database Management','Financial Analysis',
        'Event Planning','Research','Teaching','Languages','Java','Python','JavaScript','HTML/CSS','React','Node.js','SQL'
    ], 3);

    // Languages (max 5)
    const languagesMulti = createMultiSelect('langWrapper', 'langDisplay', 'langDropdown', 'langSearch', 'langCheckboxList', 'langCount', 'languagesHidden', [
        'English','Hindi','Bengali','Telugu','Marathi','Tamil','Urdu','Gujarati','Kannada','Odia','Punjabi','Assamese',
        'Maithili','Sanskrit','French','German','Spanish','Japanese','Russian','Chinese','Arabic'
    ], 5);

    // Interests (max 3)
    const interestsMulti = createMultiSelect('interestsWrapper', 'interestsDisplay', 'interestsDropdown', 'interestSearch', 'interestsCheckboxList', 'interestCount', 'interestsHidden', [
        'Reading','Traveling','Photography','Cooking','Sports','Music','Gaming','Gardening','Yoga','Painting',
        'Dancing','Volunteering','Blogging','Fitness','Movies'
    ], 3);

    // ---------- Save / Restore Form Data ----------
    function gatherFormData() {
        return {
            fullName: document.getElementById('fullName').value.trim(),
            professionalTitle: document.getElementById('professionalTitle').value,
            objective: document.getElementById('objective').value,
            mobile: document.getElementById('mobile').value.trim(),
            email: document.getElementById('email').value.trim(),
            address: document.getElementById('address').value.trim(),
            city: document.getElementById('city').value.trim(),
            state: document.getElementById('state').value.trim(),
            country: document.getElementById('country').value.trim(),
            postalCode: document.getElementById('postalCode').value.trim(),
            linkedin: document.getElementById('linkedin').value.trim(),
            github: document.getElementById('github').value.trim(),
            portfolio: document.getElementById('portfolio').value.trim(),
            gender: document.getElementById('gender').value,
            maritalStatus: document.getElementById('maritalStatus').value,
            nationality: document.getElementById('nationality').value.trim(),
            dob: document.getElementById('dob').value,
            skills: skillsMulti.getSelected(),
            languages: languagesMulti.getSelected(),
            interests: interestsMulti.getSelected(),
            place: document.getElementById('place').value.trim() || 'Guwahati',
            date: document.getElementById('dateAuto').value,
            education: [],
            experience: [],
            projects: [],
            certifications: [],
            achievements: []
        };
    }

    function saveFormData() {
        const data = gatherFormData();
        document.querySelectorAll('.education-entry').forEach(e => data.education.push({
            exam: e.querySelector('.examName')?.value, board: e.querySelector('.board')?.value,
            year: e.querySelector('.passYear')?.value, percent: e.querySelector('.percentage')?.value,
            division: e.querySelector('.division')?.value
        }));
        document.querySelectorAll('.experience-entry').forEach(e => data.experience.push({
            jobTitle: e.querySelector('.jobTitle')?.value, company: e.querySelector('.company')?.value,
            duration: e.querySelector('.duration')?.value, responsibilities: e.querySelector('.responsibilities')?.value
        }));
        document.querySelectorAll('.project-entry').forEach(e => data.projects.push({
            title: e.querySelector('.projectTitle')?.value, desc: e.querySelector('.projectDesc')?.value
        }));
        document.querySelectorAll('.certification-entry').forEach(e => data.certifications.push({
            name: e.querySelector('.certName')?.value, org: e.querySelector('.certOrg')?.value
        }));
        document.querySelectorAll('.achievement-entry').forEach(e => data.achievements.push(e.querySelector('.achievementDesc')?.value));
        localStorage.setItem('savedFormData', JSON.stringify(data));
    }

    function restoreFormData() {
        const saved = localStorage.getItem('savedFormData');
        if (!saved) return;
        const data = JSON.parse(saved);
        document.getElementById('fullName').value = data.fullName || '';
        document.getElementById('professionalTitle').value = data.professionalTitle || '';
        document.getElementById('objective').value = data.objective || '';
        document.getElementById('mobile').value = data.mobile || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('address').value = data.address || '';
        document.getElementById('city').value = data.city || '';
        document.getElementById('state').value = data.state || '';
        document.getElementById('country').value = data.country || '';
        document.getElementById('postalCode').value = data.postalCode || '';
        document.getElementById('linkedin').value = data.linkedin || '';
        document.getElementById('github').value = data.github || '';
        document.getElementById('portfolio').value = data.portfolio || '';
        document.getElementById('gender').value = data.gender || '';
        document.getElementById('maritalStatus').value = data.maritalStatus || '';
        document.getElementById('nationality').value = data.nationality || '';
        document.getElementById('dob').value = data.dob || '';
        skillsMulti.setSelected(data.skills || []);
        languagesMulti.setSelected(data.languages || []);
        interestsMulti.setSelected(data.interests || []);
        document.getElementById('place').value = data.place || '';
        document.getElementById('dateAuto').value = data.date || '';

        // Dynamic sections restore
        const eduContainer = document.getElementById('educationContainer');
        eduContainer.innerHTML = '';
        (data.education || []).forEach(edu => {
            const div = document.createElement('div');
            div.className = 'education-entry';
            div.innerHTML = `<div class="form-row">
                <div class="form-group"><label>Examination</label><input type="text" class="examName" value="${edu.exam||''}"></div>
                <div class="form-group"><label>Board/University</label><input type="text" class="board" value="${edu.board||''}"></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Passing Year</label><input type="text" class="passYear" value="${edu.year||''}"></div>
                <div class="form-group"><label>Percentage/CGPA</label><input type="text" class="percentage" value="${edu.percent||''}"></div>
            </div>
            <div class="form-group"><label>Division</label><input type="text" class="division" value="${edu.division||''}"></div>`;
            eduContainer.appendChild(div);
        });

        const expContainer = document.getElementById('experienceContainer');
        expContainer.innerHTML = '';
        (data.experience || []).forEach(exp => {
            const div = document.createElement('div');
            div.className = 'experience-entry';
            div.innerHTML = `<div class="form-row">
                <div class="form-group"><label>Job Title</label><input type="text" class="jobTitle" value="${exp.jobTitle||''}"></div>
                <div class="form-group"><label>Company</label><input type="text" class="company" value="${exp.company||''}"></div>
            </div>
            <div class="form-group"><label>Duration</label><input type="text" class="duration" value="${exp.duration||''}"></div>
            <div class="form-group"><label>Responsibilities</label><textarea class="responsibilities" rows="2">${exp.responsibilities||''}</textarea></div>`;
            expContainer.appendChild(div);
        });

        const projContainer = document.getElementById('projectsContainer');
        projContainer.innerHTML = '';
        (data.projects || []).forEach(proj => {
            const div = document.createElement('div');
            div.className = 'project-entry';
            div.innerHTML = `<div class="form-group"><label>Project Title</label><input type="text" class="projectTitle" value="${proj.title||''}"></div>
            <div class="form-group"><label>Description</label><textarea class="projectDesc" rows="2">${proj.desc||''}</textarea></div>`;
            projContainer.appendChild(div);
        });

        const certContainer = document.getElementById('certificationsContainer');
        certContainer.innerHTML = '';
        (data.certifications || []).forEach(cert => {
            const div = document.createElement('div');
            div.className = 'certification-entry';
            div.innerHTML = `<div class="form-group"><label>Certification Name</label><input type="text" class="certName" value="${cert.name||''}"></div>
            <div class="form-group"><label>Issuing Organization</label><input type="text" class="certOrg" value="${cert.org||''}"></div>`;
            certContainer.appendChild(div);
        });

        const achContainer = document.getElementById('achievementsContainer');
        achContainer.innerHTML = '';
        (data.achievements || []).forEach(ach => {
            const div = document.createElement('div');
            div.className = 'achievement-entry';
            div.innerHTML = `<div class="form-group"><label>Achievement</label><input type="text" class="achievementDesc" value="${ach||''}"></div>`;
            achContainer.appendChild(div);
        });
        localStorage.removeItem('savedFormData');
    }

    // ---------- Step Navigation ----------
    const steps = document.querySelectorAll('.form-step');
    const indicators = document.querySelectorAll('.step');
    let currentStep = 1;
    function showStep(n) {
        steps.forEach(s => s.classList.remove('active'));
        document.getElementById(`step${n}`).classList.add('active');
        indicators.forEach(ind => {
            const num = parseInt(ind.dataset.step);
            ind.classList.remove('active', 'completed');
            if (num === n) ind.classList.add('active');
            else if (num < n) ind.classList.add('completed');
        });
        currentStep = n;
        if (n === 6) document.getElementById('dateAuto').value = new Date().toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' });
    }

    function validateStep(n) {
        const stepEl = document.getElementById(`step${n}`);
        const required = stepEl.querySelectorAll('[required]');
        let valid = true;
        required.forEach(field => {
            const errorDiv = document.getElementById(field.id + 'Error');
            if (field.type === 'file') {
                if (!field.files || field.files.length === 0) {
                    if (errorDiv) errorDiv.textContent = 'Photo is required';
                    field.classList.add('error'); valid = false;
                } else if (field.files[0].size > 102400) {
                    if (errorDiv) errorDiv.textContent = 'File size must be less than 100KB';
                    field.classList.add('error'); valid = false;
                } else {
                    field.classList.remove('error');
                    if (errorDiv) errorDiv.textContent = '';
                }
            } else {
                if (!field.value.trim()) {
                    if (errorDiv) errorDiv.textContent = 'This field is required';
                    field.classList.add('error'); valid = false;
                } else {
                    field.classList.remove('error');
                    if (errorDiv) errorDiv.textContent = '';
                }
            }
        });

        if (n === 5) {
            const skillsErr = document.getElementById('skillsError');
            if (skillsMulti.getSelected().length === 0) { skillsErr.textContent = 'Select at least 1 skill'; valid = false; } else skillsErr.textContent = '';
            const langErr = document.getElementById('languagesError');
            if (languagesMulti.getSelected().length === 0) { langErr.textContent = 'Select at least 1 language'; valid = false; } else langErr.textContent = '';
        }
        return valid;
    }

    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', () => { if (validateStep(currentStep)) showStep(parseInt(btn.dataset.next)); });
    });
    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', () => showStep(parseInt(btn.dataset.prev)));
    });

    // Add More buttons
    document.getElementById('addEducation').addEventListener('click', () => {
        const entry = document.createElement('div');
        entry.className = 'education-entry';
        entry.innerHTML = `<div class="form-row">
            <div class="form-group"><label>Examination</label><input type="text" class="examName"></div>
            <div class="form-group"><label>Board/University</label><input type="text" class="board"></div>
        </div>
        <div class="form-row">
            <div class="form-group"><label>Passing Year</label><input type="text" class="passYear"></div>
            <div class="form-group"><label>Percentage/CGPA</label><input type="text" class="percentage"></div>
        </div>
        <div class="form-group"><label>Division</label><input type="text" class="division"></div>`;
        document.getElementById('educationContainer').appendChild(entry);
    });
    document.getElementById('addExperience').addEventListener('click', () => {
        const entry = document.createElement('div');
        entry.className = 'experience-entry';
        entry.innerHTML = `<div class="form-row">
            <div class="form-group"><label>Job Title</label><input type="text" class="jobTitle"></div>
            <div class="form-group"><label>Company</label><input type="text" class="company"></div>
        </div>
        <div class="form-group"><label>Duration</label><input type="text" class="duration"></div>
        <div class="form-group"><label>Responsibilities</label><textarea class="responsibilities" rows="2"></textarea></div>`;
        document.getElementById('experienceContainer').appendChild(entry);
    });
    document.getElementById('addProject').addEventListener('click', () => {
        const entry = document.createElement('div');
        entry.className = 'project-entry';
        entry.innerHTML = `<div class="form-group"><label>Project Title</label><input type="text" class="projectTitle"></div>
        <div class="form-group"><label>Description</label><textarea class="projectDesc" rows="2"></textarea></div>`;
        document.getElementById('projectsContainer').appendChild(entry);
    });
    document.getElementById('addCertification').addEventListener('click', () => {
        const entry = document.createElement('div');
        entry.className = 'certification-entry';
        entry.innerHTML = `<div class="form-group"><label>Certification Name</label><input type="text" class="certName"></div>
        <div class="form-group"><label>Issuing Organization</label><input type="text" class="certOrg"></div>`;
        document.getElementById('certificationsContainer').appendChild(entry);
    });
    document.getElementById('addAchievement').addEventListener('click', () => {
        const entry = document.createElement('div');
        entry.className = 'achievement-entry';
        entry.innerHTML = `<div class="form-group"><label>Achievement</label><input type="text" class="achievementDesc"></div>`;
        document.getElementById('achievementsContainer').appendChild(entry);
    });

    // ---------- Generate PDF & Save ----------
    document.getElementById('generateBtn').addEventListener('click', async () => {
        if (!validateStep(6)) return;
        const user = auth.currentUser;
        if (!user) {
            saveFormData();
            window.location.href = 'login.html';
            return;
        }

        const data = gatherFormData();
        data.education = [];
        document.querySelectorAll('.education-entry').forEach(e => {
            const exam = e.querySelector('.examName')?.value;
            if (exam) data.education.push({
                exam,
                board: e.querySelector('.board')?.value || '',
                year: e.querySelector('.passYear')?.value || '',
                percent: e.querySelector('.percentage')?.value || '',
                division: e.querySelector('.division')?.value || ''
            });
        });
        data.experience = [];
        document.querySelectorAll('.experience-entry').forEach(e => {
            const jobTitle = e.querySelector('.jobTitle')?.value;
            const company = e.querySelector('.company')?.value;
            if (jobTitle || company) data.experience.push({
                jobTitle: jobTitle || '', company: company || '',
                duration: e.querySelector('.duration')?.value || '',
                responsibilities: e.querySelector('.responsibilities')?.value || ''
            });
        });
        data.projects = [];
        document.querySelectorAll('.project-entry').forEach(e => {
            const title = e.querySelector('.projectTitle')?.value;
            if (title) data.projects.push({ title, desc: e.querySelector('.projectDesc')?.value || '' });
        });
        data.certifications = [];
        document.querySelectorAll('.certification-entry').forEach(e => {
            const name = e.querySelector('.certName')?.value;
            if (name) data.certifications.push({ name, org: e.querySelector('.certOrg')?.value || '' });
        });
        data.achievements = [];
        document.querySelectorAll('.achievement-entry').forEach(e => {
            const val = e.querySelector('.achievementDesc')?.value;
            if (val) data.achievements.push(val);
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
            pdf.save(`${data.fullName.replace(/\s+/g, '_')}_CV.pdf`);
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

// ---------- Helpers ----------
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
        name: data.fullName,
        template: 'formal',
        data: cleanData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        console.log('Resume saved');
        alert('Resume saved to your dashboard successfully!');
    }).catch(err => console.error('Firestore save error:', err));
}

function buildFormalResume(data) {
    // Photo – oval shape via CSS
    const photoHtml = data.photo
        ? `<img src="${data.photo}" class="photo-oval" alt="Passport Photo">`
        : `<div class="photo-oval" style="background:#ddd;"></div>`;

    // Education rows
    let eduRows = data.education.map(e => `
        <tr>
            <td>${e.exam || ''}</td>
            <td>${e.board || ''}</td>
            <td>${e.year || ''}</td>
            <td>${e.percent || ''}</td>
            <td>${e.division || ''}</td>
        </tr>`).join('');

    // Experience list
    let expHtml = data.experience.map(exp => `
        <div class="info-row">
            <span class="info-label">Job Title</span><span class="info-value">${exp.jobTitle || ''}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Company</span><span class="info-value">${exp.company || ''}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Duration</span><span class="info-value">${exp.duration || ''}</span>
        </div>
        <div class="full-width-text"><strong>Responsibilities:</strong> ${exp.responsibilities || ''}</div>
    `).join('');

    // Projects list
    let projHtml = data.projects.map(p => `
        <div class="info-row">
            <span class="info-label">Project Title</span><span class="info-value">${p.title || ''}</span>
        </div>
        <div class="full-width-text"><strong>Description:</strong> ${p.desc || ''}</div>
    `).join('');

    // Certifications list
    let certHtml = data.certifications.map(c => `
        <div class="info-row">
            <span class="info-label">Certification</span><span class="info-value">${c.name || ''}</span>
        </div>
        <div class="info-row">
            <span class="info-label">Issuing Org.</span><span class="info-value">${c.org || ''}</span>
        </div>
    `).join('');

    // Achievements list
    let achHtml = data.achievements.length
        ? '<ul class="achievement-list">' + data.achievements.map(a => `<li>${a}</li>`).join('') + '</ul>'
        : '';

    // Optional sections visibility
    const showSection = (content, heading) => content ? `<div class="section-heading">${heading}</div>${content}` : '';

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: Arial, sans-serif;
            background: #f0f0f0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        .resume-page {
            width: 794px;
            min-height: 1123px;
            background: linear-gradient(135deg, #f6d5f7, #fbe2e5, #d4f0f0, #e0f0ff, #f5e6ff);
            background-size: 400% 400%;
            animation: aurora 10s ease infinite;
            padding: 40px 45px;
            position: relative;
            box-shadow: 0 0 30px rgba(0,0,0,0.2);
            color: #2c3e50;
        }
        @keyframes aurora {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .photo-wrapper { text-align: center; margin-bottom: 20px; }
        .photo-oval {
            width: 140px;
            height: 180px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid white;
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        .applicant-name {
            text-align: center;
            font-size: 2.6rem;
            font-weight: 700;
            letter-spacing: 2px;
            margin-bottom: 6px;
            color: #1a2a3a;
        }
        .professional-title {
            text-align: center;
            font-size: 1.1rem;
            text-transform: uppercase;
            letter-spacing: 3px;
            color: #4a5568;
            margin-bottom: 20px;
        }
        .section-heading {
            font-size: 1rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 2px;
            border-bottom: 2px solid #cbd5e0;
            padding-bottom: 4px;
            margin: 18px 0 10px;
            color: #2d3748;
        }
        .info-row { display: flex; margin-bottom: 5px; font-size: 0.9rem; }
        .info-label { width: 150px; font-weight: 600; flex-shrink: 0; color: #4a5568; }
        .info-value { flex: 1; }
        .full-width-text { margin-bottom: 8px; font-size: 0.9rem; line-height: 1.5; }
        .edu-table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        .edu-table th, .edu-table td { border: 1px solid #cbd5e0; padding: 6px 8px; text-align: left; font-size: 0.85rem; }
        .edu-table th { background: rgba(255,255,255,0.6); font-weight: 600; }
        .achievement-list { list-style: disc; margin-left: 20px; font-size: 0.9rem; margin-bottom: 8px; }
        .achievement-list li { margin-bottom: 3px; }
        .declaration { margin-top: 30px; font-size: 0.9rem; line-height: 1.5; }
        .signature { text-align: right; margin-top: 15px; font-size: 0.9rem; }
    </style>
</head>
<body>
    <div class="resume-page">
        <div class="photo-wrapper">${photoHtml}</div>
        <div class="applicant-name">${data.fullName || 'Your Name'}</div>
        <div class="professional-title">${data.professionalTitle || ''}</div>

        <div class="section-heading">Career Objective</div>
        <div class="full-width-text">${data.objective || ''}</div>

        <div class="section-heading">Contact Details</div>
        <div class="info-row"><span class="info-label">Mobile</span><span class="info-value">${data.mobile || ''}</span></div>
        <div class="info-row"><span class="info-label">Email</span><span class="info-value">${data.email || ''}</span></div>
        <div class="info-row"><span class="info-label">Address</span><span class="info-value">${data.address || ''}</span></div>
        <div class="info-row"><span class="info-label">City / State</span><span class="info-value">${data.city || ''}, ${data.state || ''}</span></div>
        <div class="info-row"><span class="info-label">Country / ZIP</span><span class="info-value">${data.country || ''} – ${data.postalCode || ''}</span></div>
        ${data.linkedin ? `<div class="info-row"><span class="info-label">LinkedIn</span><span class="info-value">${data.linkedin}</span></div>` : ''}
        ${data.github ? `<div class="info-row"><span class="info-label">GitHub</span><span class="info-value">${data.github}</span></div>` : ''}
        ${data.portfolio ? `<div class="info-row"><span class="info-label">Portfolio</span><span class="info-value">${data.portfolio}</span></div>` : ''}

        ${showSection(`<table class="edu-table"><tr><th>Examination</th><th>Board/University</th><th>Year</th><th>Percentage</th><th>Division</th></tr>${eduRows}</table>`, 'Education')}
        ${showSection(expHtml, 'Work Experience')}
        ${showSection(projHtml, 'Projects')}
        ${showSection(certHtml, 'Certifications')}
        ${showSection(`<div class="full-width-text">${data.skills.join(', ')}</div>`, 'Skills')}
        ${showSection(`<div class="full-width-text">${data.languages.join(', ')}</div>`, 'Languages')}
        ${showSection(`<div class="full-width-text">${data.interests.join(', ')}</div>`, 'Interests')}
        ${showSection(achHtml, 'Achievements')}

        <div class="section-heading">Additional Information</div>
        <div class="info-row"><span class="info-label">Gender</span><span class="info-value">${data.gender || ''}</span></div>
        <div class="info-row"><span class="info-label">Marital Status</span><span class="info-value">${data.maritalStatus || ''}</span></div>
        <div class="info-row"><span class="info-label">Nationality</span><span class="info-value">${data.nationality || ''}</span></div>
        <div class="info-row"><span class="info-label">Date of Birth</span><span class="info-value">${data.dob || ''}</span></div>

        <div class="declaration">
            I hereby declare that the above particulars of facts and information stated are true, correct and complete to the best of my belief and knowledge.
        </div>
        <div class="signature">
            <p>Place: ${data.place || ''}</p>
            <p>Date: ${data.date || ''}</p>
            <p>Signature: <em>${data.fullName || ''}</em></p>
        </div>
    </div>
</body>
</html>`;
}
