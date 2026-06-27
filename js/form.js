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

    // ---------- Auth & Navbar ----------
    const authLink = document.getElementById('authLink');
    const userDisplay = document.getElementById('userDisplay');
    const userNameSpan = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');
    const dashboardLink = document.getElementById('dashboardLink');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');

    hamburgerBtn.addEventListener('click', () => navLinks.classList.toggle('show'));

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
            dashboardLink.style.display = 'inline-block';
            const emailField = document.getElementById('email');
            if (emailField && !emailField.value) emailField.value = user.email || '';
        } else {
            authLink.style.display = 'block';
            userDisplay.style.display = 'none';
            dashboardLink.style.display = 'none';
        }
    });
    logoutBtn.addEventListener('click', () => auth.signOut().then(() => window.location.href = 'index.html'));

    // ---------- Multi‑select Helper ----------
    function createMultiSelect(wrapperId, displayId, dropdownId, searchId, listId, countId, hiddenId, options, maxSelect, minSelect = 0) {
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
                        if (selected.length >= maxSelect) { cb.checked = false; alert(`Maximum ${maxSelect} allowed.`); return; }
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
            countSpan.textContent = `${selected.length} selected`;
        }

        function updateDisplay() {
            if (selected.length === 0) {
                display.innerHTML = '<span class="placeholder-text">Click to select...</span>';
            } else {
                display.innerHTML = selected.map(s => `<span class="selected-tag">${s} <span class="remove-tag" data-value="${s}">×</span></span>`).join('');
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
            validateField(hiddenId);
        }

        display.addEventListener('click', (e) => { e.stopPropagation(); dropdown.classList.toggle('open'); render(search.value); });
        document.addEventListener('click', () => dropdown.classList.remove('open'));
        dropdown.addEventListener('click', e => e.stopPropagation());
        search.addEventListener('input', () => render(search.value));
        render();
        return { getSelected: () => selected, setSelected: (arr) => { selected = arr; updateDisplay(); render(); } };
    }

    // ---------- Field Validation ----------
    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.getElementById(fieldId + 'Error');
        if (field) field.classList.add('error');
        if (errorDiv) errorDiv.textContent = message || '';
    }
    function clearFieldError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorDiv = document.getElementById(fieldId + 'Error');
        if (field) field.classList.remove('error');
        if (errorDiv) errorDiv.textContent = '';
    }
    function validateField(fieldId) {
        const field = document.getElementById(fieldId);
        if (!field) return true;
        if (field.type === 'hidden' || field.tagName === 'SELECT') {
            if (!field.value.trim()) { showFieldError(fieldId, 'This field is required'); return false; }
            else { clearFieldError(fieldId); return true; }
        }
        if (field.type === 'file') {
            if (!field.files || field.files.length === 0) { showFieldError(fieldId, 'Please upload a photo'); return false; }
            else { clearFieldError(fieldId); return true; }
        }
        if (!field.value.trim()) { showFieldError(fieldId, 'This field is required'); return false; }
        else { clearFieldError(fieldId); return true; }
        return true;
    }

    // ---------- Skills & Languages Multi‑Selects ----------
    const skillsOptions = ['Communication','Leadership','Teamwork','Problem Solving','Critical Thinking','Public Speaking','Research','Writing','MS Office','Excel','PowerPoint','Java','Python','C++','HTML','CSS','JavaScript','React','Node.js','SQL','Project Management','Teaching','Data Analysis','Time Management','Creativity'];
    const skillsMulti = createMultiSelect('skillsWrapper','skillsDisplay','skillsDropdown','skillSearch','skillsCheckboxList','skillCount','skillsHidden', skillsOptions, 5, 2);

    const languagesOptions = ['English','Hindi','Assamese','Bengali','Nepali','Bodo','Marathi','Gujarati','Punjabi','Tamil','Telugu','Kannada','Malayalam','Urdu','Sanskrit','Odia','Manipuri','Khasi','Garo','Mizo','Kokborok','Dogri','Kashmiri','Sindhi','Maithili','Bhojpuri','Rajasthani','Konkani','Tulu','Santhali','French','German','Spanish','Japanese','Chinese','Korean','Russian','Arabic','Persian','Portuguese'];
    const languagesMulti = createMultiSelect('langWrapper','langDisplay','langDropdown','langSearch','langCheckboxList','langCount','languagesHidden', languagesOptions, 3, 3);

    // ---------- Dynamic Education ----------
    const eduContainer = document.getElementById('educationContainer');
    let eduCount = 0;
    function createEducationBlock(index) {
        const block = document.createElement('div');
        block.className = 'education-entry';
        block.innerHTML = `
            <h4>Education ${index + 1}</h4>
            <div class="form-row">
                <div class="form-group"><label>Degree <span class="req">*</span></label><input type="text" class="eduDegree" id="edu${index+1}Degree" required></div>
                <div class="form-group"><label>Institute <span class="req">*</span></label><input type="text" class="eduInstitute" id="edu${index+1}Institute" required></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Passing Year <span class="req">*</span></label><input type="text" class="eduYear" id="edu${index+1}Year" required></div>
                <div class="form-group"><label>Score/Percentage/CGPA <span class="req">*</span></label><input type="text" class="eduScore" id="edu${index+1}Score" required></div>
            </div>
            <button type="button" class="btn-remove-edu">Remove</button>
            <hr>
        `;
        eduContainer.appendChild(block);
        block.querySelector('.btn-remove-edu').addEventListener('click', () => {
            block.remove();
            updateEducationIndices();
        });
    }
    function updateEducationIndices() {
        const blocks = eduContainer.querySelectorAll('.education-entry');
        eduCount = blocks.length;
        blocks.forEach((block, idx) => {
            block.querySelector('h4').textContent = `Education ${idx + 1}`;
            block.querySelector('.eduDegree').id = `edu${idx+1}Degree`;
            block.querySelector('.eduInstitute').id = `edu${idx+1}Institute`;
            block.querySelector('.eduYear').id = `edu${idx+1}Year`;
            block.querySelector('.eduScore').id = `edu${idx+1}Score`;
        });
    }
    document.getElementById('addEducation').addEventListener('click', () => {
        if (eduCount >= 4) { alert('Maximum 4 education entries.'); return; }
        createEducationBlock(eduCount);
        eduCount++;
    });
    createEducationBlock(0);
    eduCount = 1;

    // ---------- Dynamic Experience ----------
    const expContainer = document.getElementById('experienceContainer');
    let expCount = 0;
    function createExperienceBlock(index) {
        const block = document.createElement('div');
        block.className = 'experience-entry';
        block.innerHTML = `
            <h4>Experience ${index + 1}</h4>
            <div class="form-group"><label>Job Title</label>
                <select class="expPosition" id="exp${index+1}Position">
                    <option value="">-- Select --</option>
                    <option>Intern</option><option>Teacher</option><option>Lecturer</option><option>Software Developer</option>
                    <option>Engineer</option><option>Manager</option><option>Accountant</option><option>Volunteer</option>
                    <option>Consultant</option><option>Research Assistant</option><option>Content Writer</option>
                    <option>Coordinator</option><option>Executive</option><option>Analyst</option><option>Supervisor</option>
                </select>
            </div>
            <div class="form-group"><label>Organization Name</label><input type="text" class="expCompany" id="exp${index+1}Company"></div>
            <div class="form-row">
                <div class="form-group"><label>Start Date</label><input type="text" class="expStart" id="exp${index+1}Start"></div>
                <div class="form-group"><label>End Date</label><input type="text" class="expEnd" id="exp${index+1}End"></div>
            </div>
            <div class="form-group"><label>Experience Summary</label>
                <select class="expDescription" id="exp${index+1}Description">
                    <option value="">-- Select --</option>
                    <option>Successfully completed assigned tasks and projects.</option>
                    <option>Improved team efficiency and collaboration.</option>
                    <option>Delivered high-quality results under tight deadlines.</option>
                    <option>Managed multiple projects simultaneously with excellent outcomes.</option>
                    <option>Enhanced customer satisfaction through effective communication.</option>
                    <option>Led a team to achieve operational goals.</option>
                    <option>Streamlined processes resulting in cost savings.</option>
                    <option>Developed innovative solutions to complex problems.</option>
                    <option>Mentored junior staff and facilitated knowledge sharing.</option>
                    <option>Consistently exceeded performance targets.</option>
                </select>
                <textarea class="expDescEdit" rows="2" placeholder="Or edit summary..."></textarea>
            </div>
            <button type="button" class="btn-remove-exp">Remove</button>
            <hr>
        `;
        expContainer.appendChild(block);
        block.querySelector('.btn-remove-exp').addEventListener('click', () => {
            block.remove();
            updateExperienceIndices();
        });
    }
    function updateExperienceIndices() {
        const blocks = expContainer.querySelectorAll('.experience-entry');
        expCount = blocks.length;
        blocks.forEach((block, idx) => {
            block.querySelector('h4').textContent = `Experience ${idx + 1}`;
            block.querySelector('.expPosition').id = `exp${idx+1}Position`;
            block.querySelector('.expCompany').id = `exp${idx+1}Company`;
            block.querySelector('.expStart').id = `exp${idx+1}Start`;
            block.querySelector('.expEnd').id = `exp${idx+1}End`;
            block.querySelector('.expDescription').id = `exp${idx+1}Description`;
        });
    }
    document.getElementById('addExperience').addEventListener('click', () => {
        if (expCount >= 4) { alert('Maximum 4 experience entries.'); return; }
        createExperienceBlock(expCount);
        expCount++;
    });

    // ---------- Professional Summary Editable ----------
    const summarySelect = document.getElementById('professionalSummary');
    const summaryEdit = document.getElementById('professionalSummaryEdit');
    summarySelect.addEventListener('change', () => { summaryEdit.value = ''; });
    summaryEdit.addEventListener('input', () => { if (summaryEdit.value.trim()) summarySelect.value = ''; });

    // ---------- Declaration Auto‑Generation ----------
    function updateDeclarationPreview() {
        const name = document.getElementById('fullName').value.trim();
        const place = document.getElementById('declarationPlace').value.trim();
        const date = new Date().toLocaleDateString('en-IN', { year:'numeric', month:'long', day:'numeric' });
        document.getElementById('declarationDate').value = date;
        const text = `I, ${name || '[Your Name]'}, hereby declare that the information provided above is true to the best of my knowledge and belief.`;
        document.getElementById('declarationTextPreview').textContent = text;
    }
    document.getElementById('fullName').addEventListener('input', updateDeclarationPreview);
    document.getElementById('declarationPlace').addEventListener('input', updateDeclarationPreview);

    // ---------- Photo Preview (no size limit) ----------
    document.getElementById('photoUpload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        const preview = document.getElementById('photoPreview');
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => { preview.src = e.target.result; preview.style.display = 'block'; };
            reader.readAsDataURL(file);
        } else {
            preview.style.display = 'none';
        }
    });

    // ---------- GENERATE TYPED PDF (print) ----------
    document.getElementById('generateBtn').addEventListener('click', async () => {
        // Validate all required fields
        let isValid = true;
        ['fullName','jobTitle','mobile','email','fatherName','gender','village','district','state','dob','nationality','maritalStatus','casteCategory','declarationPlace','photoUpload'].forEach(id => {
            if (!validateField(id)) isValid = false;
        });
        if (!summarySelect.value && !summaryEdit.value.trim()) {
            showFieldError('professionalSummary', 'Required');
            isValid = false;
        } else clearFieldError('professionalSummary');
        if (skillsMulti.getSelected().length < 2) {
            document.getElementById('skillsError').textContent = 'Select at least 2 skills';
            isValid = false;
        } else document.getElementById('skillsError').textContent = '';
        if (languagesMulti.getSelected().length !== 3) {
            document.getElementById('languagesError').textContent = 'Select exactly 3 languages';
            isValid = false;
        } else document.getElementById('languagesError').textContent = '';
        const firstDegree = document.getElementById('edu1Degree');
        if (!firstDegree || !firstDegree.value.trim()) {
            showFieldError('edu1Degree', 'At least one education entry required');
            isValid = false;
        } else clearFieldError('edu1Degree');
        if (!document.getElementById('declarationCheck').checked) {
            alert('Please confirm the declaration.');
            isValid = false;
        }
        if (!isValid) return;

        // Gather data
        const fullName = document.getElementById('fullName').value.trim();
        const jobTitle = document.getElementById('jobTitle').value;
        const professionalSummary = summaryEdit.value.trim() || summarySelect.value;
        const mobile = document.getElementById('mobile').value;
        const email = document.getElementById('email').value;
        const fatherName = document.getElementById('fatherName').value;
        const gender = document.getElementById('gender').value;
        const village = document.getElementById('village').value;
        const district = document.getElementById('district').value;
        const state = document.getElementById('state').value;
        const dob = document.getElementById('dob').value;
        const nationality = document.getElementById('nationality').value;
        const maritalStatus = document.getElementById('maritalStatus').value;
        const casteCategory = document.getElementById('casteCategory').value;
        const declarationPlace = document.getElementById('declarationPlace').value;
        const declarationDate = document.getElementById('declarationDate').value;
        const declarationName = fullName;
        const declarationText = `I, ${fullName}, hereby declare that the information provided above is true to the best of my knowledge and belief.`;

        const photoFile = document.getElementById('photoUpload').files[0];
        let profileImageDataUrl = '';
        if (photoFile) profileImageDataUrl = await readFileAsDataURL(photoFile);

        const skills = skillsMulti.getSelected();
        const languages = languagesMulti.getSelected();

        const education = [];
        for (let i = 1; i <= 4; i++) {
            const deg = document.getElementById(`edu${i}Degree`);
            if (deg && deg.value.trim()) {
                education.push({
                    degree: deg.value,
                    institute: document.getElementById(`edu${i}Institute`).value,
                    year: document.getElementById(`edu${i}Year`).value,
                    score: document.getElementById(`edu${i}Score`).value
                });
            }
        }

        const experiences = [];
        for (let i = 1; i <= 4; i++) {
            const pos = document.getElementById(`exp${i}Position`);
            if (pos && pos.value) {
                const start = document.getElementById(`exp${i}Start`)?.value || '';
                const end = document.getElementById(`exp${i}End`)?.value || '';
                const yearRange = [start, end].filter(Boolean).join(' - ');
                const descSelect = document.getElementById(`exp${i}Description`);
                const descTextarea = document.querySelector(`#exp${i}Description + textarea`);
                let desc = descSelect ? descSelect.value : '';
                if (descTextarea && descTextarea.value.trim()) desc = descTextarea.value;
                experiences.push({
                    position: pos.value,
                    company: document.getElementById(`exp${i}Company`)?.value || '',
                    year: yearRange,
                    description: desc
                });
            }
        }

        // Show spinner
        document.getElementById('spinnerOverlay').style.display = 'flex';

        // Build filled resume HTML
        const filledHTML = buildFilledResumeHTML({
            fullName, jobTitle, professionalSummary, mobile, email,
            fatherName, gender, village, district, state, dob, nationality,
            maritalStatus, casteCategory, declarationPlace, declarationDate,
            declarationName, declarationText, profileImageDataUrl,
            education, experiences, skills, languages
        });

        // Open new window and print
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Please allow pop‑ups to print the resume.');
            document.getElementById('spinnerOverlay').style.display = 'none';
            return;
        }
        printWindow.document.write(filledHTML);
        printWindow.document.close();

        printWindow.onload = function() {
            setTimeout(() => {
                printWindow.print();
                printWindow.onafterprint = function() {
                    printWindow.close();
                };
                document.getElementById('spinnerOverlay').style.display = 'none';
                alert('Your resume is ready! Use the print dialog to save as PDF.');
            }, 800);
        };

        // Save to Firestore (if logged in)
        if (auth.currentUser) {
            const cleanData = { fullName, jobTitle, professionalSummary, mobile, email, fatherName, gender, village, district, state, skills: skills.join(', '), languages: languages.join(', '), dob, nationality, maritalStatus, casteCategory, declarationPlace, declarationDate, declarationName, declarationText };
            db.collection('resumes').add({
                uid: auth.currentUser.uid,
                name: fullName,
                template: 'formal',
                data: cleanData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            }).catch(err => console.error('Firestore save error:', err));
        }
    });

    // Helper to read file as Data URL
    function readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    updateDeclarationPreview();
});

// ---------- Build Filled Resume HTML (typed, printable) ----------
function buildFilledResumeHTML(data) {
    const css = `
        <style>
            @page { size: A4 portrait; margin: 0; }
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', sans-serif; }
            body { background: #e5e7eb; padding: 0; }
            .resume { width: 210mm; height: 297mm; background: #fff; margin: auto; padding: 20px 28px; overflow: hidden; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,.12); }
            .resume::before { content: ''; position: absolute; width: 380px; height: 380px; border-radius: 50%; background: linear-gradient(135deg,#2563eb,#06b6d4); top: -230px; right: -180px; opacity: .08; }
            .resume::after { content: ''; position: absolute; width: 280px; height: 280px; border-radius: 50%; background: linear-gradient(135deg,#8b5cf6,#ec4899); bottom: -150px; left: -150px; opacity: .08; }
            .header { text-align: center; padding-top: 10px; position: relative; z-index: 2; }
            .profile-frame { width: 170px; height: 170px; border-radius: 50%; margin: 0 auto 15px; border: 8px solid #2563eb; overflow: hidden; background: #f3f4f6; box-shadow: 0 8px 20px rgba(37,99,235,.25); }
            .profile-frame img { width: 100%; height: 100%; object-fit: cover; }
            .name { font-size: 28px; font-weight: 700; color: #111827; }
            .title { font-size: 18px; color: #2563eb; font-weight: 600; margin-top: 6px; }
            .contact { margin-top: 10px; font-size: 13px; color: #4b5563; line-height: 1.7; }
            .section { margin-top: 16px; position: relative; z-index: 2; }
            .section-title { font-size: 15px; font-weight: 700; color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 4px; margin-bottom: 10px; text-transform: uppercase; }
            .summary { font-size: 11.5px; color: #374151; line-height: 1.7; text-align: justify; }
            .two-column { display: grid; grid-template-columns: 1.6fr 1fr; gap: 20px; }
            .card { background: #f8fafc; border-left: 4px solid #2563eb; border-radius: 10px; padding: 12px; }
            .item { margin-bottom: 12px; }
            .item h3 { font-size: 13px; color: #111827; }
            .meta { font-size: 10.5px; color: #6b7280; margin: 4px 0; }
            .item p { font-size: 11px; color: #374151; line-height: 1.5; }
            .personal-row { margin-bottom: 8px; font-size: 11.5px; color: #374151; }
            .personal-row strong { color: #111827; }
            .skills { display: flex; flex-wrap: wrap; gap: 8px; }
            .skill { background: linear-gradient(135deg,#2563eb,#06b6d4); color: #fff; padding: 6px 12px; border-radius: 20px; font-size: 10.5px; }
            .education-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 20px; }
            .language-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 20px; }
            .language-item { font-size: 11.5px; color: #374151; padding-left: 14px; position: relative; }
            .language-item::before { content: '•'; position: absolute; left: 0; color: #2563eb; }
            .declaration-container { display: flex; justify-content: space-between; align-items: flex-end; gap: 25px; }
            .declaration-text { flex: 1; font-size: 11px; line-height: 1.7; color: #374151; text-align: justify; }
            .declaration-signature { min-width: 180px; text-align: right; font-size: 11px; color: #374151; line-height: 1.8; }
            .declaration-signature strong { font-weight: 700; color: #111827; }
            @media print { body { background: none; } .resume { box-shadow: none; } }
        </style>
    `;

    let eduHTML = '';
    data.education.forEach((edu, i) => {
        if (!edu.degree) return;
        eduHTML += `
            <div class="item">
                <h3>${edu.degree}</h3>
                <div class="meta">
                    <span>${edu.institute}</span> |
                    <span>${edu.year}</span>
                </div>
                <p>${edu.score}</p>
            </div>`;
    });

    let expHTML = '';
    data.experiences.forEach(exp => {
        if (!exp.position) return;
        expHTML += `
            <div class="item">
                <h3>${exp.position}</h3>
                <div class="meta">
                    <span>${exp.company}</span> |
                    <span>${exp.year}</span>
                </div>
                <p>${exp.description}</p>
            </div>`;
    });

    const skillsHTML = data.skills.map(s => `<div class="skill">${s}</div>`).join('');
    const languagesHTML = data.languages.map(l => `<div class="language-item">${l}</div>`).join('');

    return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>${data.fullName} Resume</title>${css}</head>
<body>
<div class="resume">
    <div class="header">
        <div class="profile-frame">
            <img src="${data.profileImageDataUrl || 'https://via.placeholder.com/300'}" alt="Profile">
        </div>
        <div class="name">${data.fullName}</div>
        <div class="title">${data.jobTitle}</div>
        <div class="contact">
            <span>📞 ${data.mobile}</span> |
            <span>📧 ${data.email}</span>
        </div>
    </div>
    <div class="section">
        <div class="section-title">Professional Summary</div>
        <div class="summary">${data.professionalSummary}</div>
    </div>
    <div class="section">
        <div class="two-column">
            <div>
                <div class="section-title">Education</div>
                <div class="card">
                    <div class="education-grid">${eduHTML}</div>
                </div>
            </div>
            <div>
                <div class="section-title">Personal Details</div>
                <div class="card">
                    <div class="personal-row"><strong>Name:</strong> ${data.fullName}</div>
                    <div class="personal-row"><strong>Father Name:</strong> ${data.fatherName}</div>
                    <div class="personal-row"><strong>Gender:</strong> ${data.gender}</div>
                    <div class="personal-row"><strong>Village:</strong> ${data.village}</div>
                    <div class="personal-row"><strong>District:</strong> ${data.district}</div>
                    <div class="personal-row"><strong>State:</strong> ${data.state}</div>
                </div>
            </div>
        </div>
    </div>
    <div class="section">
        <div class="section-title">Skills</div>
        <div class="skills">${skillsHTML}</div>
    </div>
    <div class="section">
        <div class="two-column">
            <div>
                <div class="section-title">Experience</div>
                <div class="card">${expHTML}</div>
            </div>
            <div>
                <div class="section-title">Languages Known</div>
                <div class="card">
                    <div class="language-grid">${languagesHTML}</div>
                </div>
                <div style="height:12px"></div>
                <div class="section-title">Other Details</div>
                <div class="card">
                    <div class="personal-row"><strong>DOB:</strong> ${data.dob}</div>
                    <div class="personal-row"><strong>Nationality:</strong> ${data.nationality}</div>
                    <div class="personal-row"><strong>Marital Status:</strong> ${data.maritalStatus}</div>
                    <div class="personal-row"><strong>Caste Category:</strong> ${data.casteCategory}</div>
                </div>
            </div>
        </div>
    </div>
    <div class="section">
        <div class="section-title">Declaration</div>
        <div class="card">
            <div class="declaration-container">
                <div class="declaration-text">${data.declarationText}</div>
                <div class="declaration-signature">
                    <span><strong>Date & Place:</strong> ${data.declarationDate}, ${data.declarationPlace}</span><br>
                    <span><strong>Name:</strong> ${data.declarationName}</span>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>`;
}
