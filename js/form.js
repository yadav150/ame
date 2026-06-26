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
        } else {
            authLink.style.display = 'block';
            userDisplay.style.display = 'none';
            if (dashboardLink) dashboardLink.style.display = 'none';
        }
    });
    logoutBtn.addEventListener('click', () => auth.signOut().then(() => window.location.href = 'index.html'));
    document.getElementById('hamburgerBtn').addEventListener('click', () => document.getElementById('navLinks').classList.toggle('show'));

    // ---------- Multi‑select helper ----------
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

    // ---------- Skills Multi‑Select ----------
    const skillsOptions = ['Communication','Leadership','Teamwork','Problem Solving','Critical Thinking','Public Speaking','Research','Writing','MS Office','Excel','PowerPoint','Java','Python','C++','HTML','CSS','JavaScript','React','Node.js','SQL','Project Management','Teaching','Data Analysis','Time Management','Creativity'];
    const skillsMulti = createMultiSelect('skillsWrapper','skillsDisplay','skillsDropdown','skillSearch','skillsCheckboxList','skillCount','skillsHidden', skillsOptions, 5, 2);

    // ---------- Languages Multi‑Select ----------
    const languagesOptions = ['English','Hindi','Assamese','Bengali','Nepali','Bodo','Marathi','Gujarati','Punjabi','Tamil','Telugu','Kannada','Malayalam','Urdu','Sanskrit','Odia','Manipuri','Khasi','Garo','Mizo','Kokborok','Dogri','Kashmiri','Sindhi','Maithili','Bhojpuri','Rajasthani','Konkani','Tulu','Santhali','French','German','Spanish','Japanese','Chinese','Korean','Russian','Arabic','Persian','Portuguese'];
    const languagesMulti = createMultiSelect('langWrapper','langDisplay','langDropdown','langSearch','langCheckboxList','langCount','languagesHidden', languagesOptions, 3, 3);

    // ---------- Dynamic Education Blocks ----------
    const eduContainer = document.getElementById('educationContainer');
    let eduCount = 0;
    function createEducationBlock(index) {
        const block = document.createElement('div');
        block.className = 'education-entry';
        block.dataset.index = index;
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
            <button type="button" class="btn-remove-edu" style="background:#e74c3c;color:white;border:none;padding:0.3rem 1rem;border-radius:20px;cursor:pointer;">Remove</button>
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
        if (eduCount >= 4) { alert('Maximum 4 education entries allowed.'); return; }
        createEducationBlock(eduCount);
        eduCount++;
    });

    createEducationBlock(0);
    eduCount = 1;

    // ---------- Dynamic Experience Blocks ----------
    const expContainer = document.getElementById('experienceContainer');
    let expCount = 0;
    function createExperienceBlock(index) {
        const block = document.createElement('div');
        block.className = 'experience-entry';
        block.dataset.index = index;
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
                <textarea class="expDescEdit" rows="2" style="margin-top:5px;" placeholder="Or edit summary..."></textarea>
            </div>
            <button type="button" class="btn-remove-exp" style="background:#e74c3c;color:white;border:none;padding:0.3rem 1rem;border-radius:20px;cursor:pointer;">Remove</button>
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
        if (expCount >= 4) { alert('Maximum 4 experience entries allowed.'); return; }
        createExperienceBlock(expCount);
        expCount++;
    });

    const summarySelect = document.getElementById('professionalSummary');
    const summaryEdit = document.getElementById('professionalSummaryEdit');
    summarySelect.addEventListener('change', () => { summaryEdit.value = ''; });
    summaryEdit.addEventListener('input', () => { if (summaryEdit.value.trim()) summarySelect.value = ''; });

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

    document.getElementById('photoUpload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        const preview = document.getElementById('photoPreview');
        if (file && file.size <= 102400) {
            const reader = new FileReader();
            reader.onload = (e) => { preview.src = e.target.result; preview.style.display = 'block'; };
            reader.readAsDataURL(file);
        } else {
            preview.style.display = 'none';
        }
    });

    document.getElementById('generateBtn').addEventListener('click', async () => {
        // Quick validation before proceeding
        let isValid = true;
        ['fullName','mobile','email','jobTitle','fatherName','gender','village','district','state','dob','nationality','maritalStatus','casteCategory','declarationPlace','photoUpload'].forEach(id => {
            if (!validateField(id)) isValid = false;
        });
        if (summarySelect.value === '' && summaryEdit.value.trim() === '') {
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
        const eduDegrees = document.querySelectorAll('.eduDegree');
        if (eduDegrees.length === 0 || !eduDegrees[0].value.trim()) {
            showFieldError('edu1Degree', 'At least one education entry is required');
            isValid = false;
        } else clearFieldError('edu1Degree');
        if (!document.getElementById('declarationCheck').checked) {
            alert('Please confirm the declaration.');
            isValid = false;
        }
        if (!isValid) return;

        document.getElementById('spinnerOverlay').style.display = 'flex';

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
        if (photoFile) {
            profileImageDataUrl = await readFileAsDataURL(photoFile);
        }

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
                const start = document.getElementById(`exp${i}Start`).value;
                const end = document.getElementById(`exp${i}End`).value;
                const yearRange = [start, end].filter(Boolean).join(' - ');
                const descSelect = document.getElementById(`exp${i}Description`);
                const descTextarea = document.querySelector(`#exp${i}Description + textarea`);
                let desc = descSelect ? descSelect.value : '';
                if (descTextarea && descTextarea.value.trim()) desc = descTextarea.value;
                experiences.push({
                    position: pos.value,
                    company: document.getElementById(`exp${i}Company`).value,
                    year: yearRange,
                    description: desc
                });
            }
        }

        try {
            const response = await fetch('/resume/pdf.html');
            let templateHTML = await response.text();

            const iframe = document.createElement('iframe');
            iframe.style.width = '794px';
            iframe.style.height = '1123px';
            iframe.style.position = 'absolute';
            iframe.style.left = '-9999px';
            document.body.appendChild(iframe);
            const doc = iframe.contentDocument || iframe.contentWindow.document;
            doc.open();
            doc.write(templateHTML);
            doc.close();

            const nameEl = doc.getElementById('fullName');
            if (nameEl) nameEl.textContent = fullName;
            const pdNameEl = doc.getElementById('pdName');
            if (pdNameEl) pdNameEl.textContent = fullName;
            const jobTitleEl = doc.getElementById('jobTitle');
            if (jobTitleEl) jobTitleEl.textContent = jobTitle;
            const summaryEl = doc.getElementById('professionalSummary');
            if (summaryEl) summaryEl.textContent = professionalSummary;
            const mobileEl = doc.getElementById('mobile');
            if (mobileEl) mobileEl.innerHTML = `📞 ${mobile}`;
            const emailEl = doc.getElementById('email');
            if (emailEl) emailEl.innerHTML = `📧 ${email}`;

            const fatherEl = doc.getElementById('fatherName');
            if (fatherEl) fatherEl.textContent = fatherName;
            const genderEl = doc.getElementById('gender');
            if (genderEl) genderEl.textContent = gender;
            const villageEl = doc.getElementById('village');
            if (villageEl) villageEl.textContent = village;
            const districtEl = doc.getElementById('district');
            if (districtEl) districtEl.textContent = district;
            const stateEl = doc.getElementById('state');
            if (stateEl) stateEl.textContent = state;
            const dobEl = doc.getElementById('dob');
            if (dobEl) dobEl.textContent = dob;
            const nationalityEl = doc.getElementById('nationality');
            if (nationalityEl) nationalityEl.textContent = nationality;
            const maritalEl = doc.getElementById('maritalStatus');
            if (maritalEl) maritalEl.textContent = maritalStatus;
            const hobbiesEl = doc.getElementById('hobbies');
            if (hobbiesEl) hobbiesEl.textContent = casteCategory;

            const photoImg = doc.getElementById('profileImage');
            if (photoImg && profileImageDataUrl) {
                photoImg.src = profileImageDataUrl;
            }

            for (let i = 1; i <= 4; i++) {
                const eduItem = doc.getElementById(`education${i}`);
                if (!eduItem) continue;
                if (i <= education.length) {
                    eduItem.style.display = 'block';
                    const degEl = doc.getElementById(`edu${i}Degree`);
                    const instEl = doc.getElementById(`edu${i}Institute`);
                    const yearEl = doc.getElementById(`edu${i}Year`);
                    const scoreEl = doc.getElementById(`edu${i}Score`);
                    if (degEl) degEl.textContent = education[i-1].degree;
                    if (instEl) instEl.textContent = education[i-1].institute;
                    if (yearEl) yearEl.textContent = education[i-1].year;
                    if (scoreEl) scoreEl.textContent = education[i-1].score;
                } else {
                    eduItem.style.display = 'none';
                }
            }

            const skillsContainer = doc.getElementById('skillsContainer');
            if (skillsContainer) {
                skillsContainer.innerHTML = skills.map(s => `<div class="skill">${s}</div>`).join('');
            }

            const expContainerDoc = doc.getElementById('experienceContainer');
            if (expContainerDoc) {
                expContainerDoc.innerHTML = '';
                experiences.forEach(exp => {
                    const item = document.createElement('div');
                    item.className = 'item';
                    item.innerHTML = `
                        <h3>${exp.position}</h3>
                        <div class="meta">
                            <span>${exp.company}</span> |
                            <span>${exp.year}</span>
                        </div>
                        <p>${exp.description}</p>
                    `;
                    expContainerDoc.appendChild(item);
                });
            }

            const langContainer = doc.getElementById('languageContainer');
            if (langContainer) {
                langContainer.innerHTML = languages.map(l => `<div class="language-item">${l}</div>`).join('');
            }

            const declTextEl = doc.getElementById('declarationText');
            if (declTextEl) declTextEl.textContent = declarationText;
            const declDateEl = doc.getElementById('declarationDate');
            if (declDateEl) declDateEl.textContent = declarationDate;
            const declPlaceEl = doc.getElementById('declarationPlace');
            if (declPlaceEl) declPlaceEl.textContent = declarationPlace;
            const declNameEl = doc.getElementById('declarationName');
            if (declNameEl) declNameEl.textContent = declarationName;

            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(doc.body, { scale: 2, useCORS: true });
            document.body.removeChild(iframe);

            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            while (heightLeft > 0) {
                position -= pageHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            const filename = (fullName || 'Resume').replace(/\s+/g, '_') + '.pdf';
            pdf.save(filename);

            document.getElementById('spinnerOverlay').style.display = 'none';
            alert('Resume generated successfully!');

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
        } catch (err) {
            console.error('PDF generation error:', err);
            document.getElementById('spinnerOverlay').style.display = 'none';
            alert('Something went wrong. Please try again.');
        }
    });

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
