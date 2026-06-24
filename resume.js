// ============================================================
// STATE
// ============================================================
let resumeData = {
    applicantName: '',
    fatherName: '',
    motherName: '',
    dob: '',
    gender: '',
    category: '',
    maritalStatus: '',
    knownLanguages: '',
    mobileNumber: '',
    emailAddress: '',
    address: '',
    experience: '',
    objective: '',
    place: '',
    education: [],      // { examName, board, passingYear, percentage, division }
    otherQualifications: [], // { qualificationName, institute, passingYear, scoreGrade, duration }
    photo: null
};

let visibilityState = {
    education: true,
    otherQualifications: true
};

let darkMode = false;
let currentTemplate = 'modern';
let accentColor = '#4f46e5';
let currentLayout = 'single';

// ============================================================
// DOM REFS
// ============================================================
const preview = document.getElementById('resumePreview');
const form = document.getElementById('resumeForm');

// ============================================================
// LOCAL STORAGE – LOAD / SAVE
// ============================================================
function loadData() {
    const saved = localStorage.getItem('resumeBuilderData');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            Object.assign(resumeData, parsed);
        } catch (e) {}
    }

    const savedVisibility = localStorage.getItem('resumeBuilderVisibility');
    if (savedVisibility) {
        try {
            Object.assign(visibilityState, JSON.parse(savedVisibility));
        } catch (e) {}
    }
    document.querySelectorAll('.section-toggle').forEach(cb => {
        const section = cb.dataset.section;
        if (section in visibilityState) {
            cb.checked = visibilityState[section];
            const label = cb.closest('.toggle-label');
            if (label) {
                const span = label.querySelector('span');
                if (span) span.textContent = cb.checked ? 'Show' : 'Hide';
            }
        }
    });

    const savedTemplate = localStorage.getItem('resumeBuilderTemplate');
    if (savedTemplate) {
        currentTemplate = savedTemplate;
        document.getElementById('templateSelector').value = currentTemplate;
    }

    const savedAccent = localStorage.getItem('resumeBuilderAccent');
    if (savedAccent) {
        accentColor = savedAccent;
        document.getElementById('accentColorPicker').value = accentColor;
    }

    const savedLayout = localStorage.getItem('resumeBuilderLayout');
    if (savedLayout) {
        currentLayout = savedLayout;
        const label = document.querySelector('#layoutToggle span');
        if (label) {
            label.textContent = currentLayout === 'two-column' ? 'Single Column' : 'Two Column';
        }
    }

    populateForm();
    renderPreview();
}

function saveData() {
    localStorage.setItem('resumeBuilderData', JSON.stringify(resumeData));
}

// ============================================================
// POPULATE FORM FROM DATA
// ============================================================
function populateForm() {
    document.getElementById('applicantName').value = resumeData.applicantName || '';
    document.getElementById('fatherName').value = resumeData.fatherName || '';
    document.getElementById('motherName').value = resumeData.motherName || '';
    document.getElementById('dob').value = resumeData.dob || '';
    document.getElementById('gender').value = resumeData.gender || '';
    document.getElementById('category').value = resumeData.category || '';
    document.getElementById('maritalStatus').value = resumeData.maritalStatus || '';
    document.getElementById('knownLanguages').value = resumeData.knownLanguages || '';
    document.getElementById('mobileNumber').value = resumeData.mobileNumber || '';
    document.getElementById('emailAddress').value = resumeData.emailAddress || '';
    document.getElementById('address').value = resumeData.address || '';
    document.getElementById('experience').value = resumeData.experience || '';
    document.getElementById('objective').value = resumeData.objective || '';
    document.getElementById('place').value = resumeData.place || '';

    renderEntries('educationList', resumeData.education, 'education');
    renderEntries('otherQualificationList', resumeData.otherQualifications, 'otherQualification');

    const previewEl = document.getElementById('photoPreview');
    if (resumeData.photo) {
        previewEl.innerHTML = `<img src="${resumeData.photo}" alt="Profile" />`;
    } else {
        previewEl.innerHTML = '<i class="fas fa-user"></i>';
    }
}

// ============================================================
// RENDER ENTRIES
// ============================================================
function renderEntries(containerId, entries, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let fields = [];
    if (type === 'education') {
        fields = [
            { key: 'examName', label: 'Exam Name' },
            { key: 'board', label: 'Board/University' },
            { key: 'passingYear', label: 'Passing Year' },
            { key: 'percentage', label: 'Percentage' },
            { key: 'division', label: 'Division' }
        ];
    } else if (type === 'otherQualification') {
        fields = [
            { key: 'qualificationName', label: 'Qualification Name' },
            { key: 'institute', label: 'Institute/Organization' },
            { key: 'passingYear', label: 'Passing Year' },
            { key: 'scoreGrade', label: 'Score/Grade' },
            { key: 'duration', label: 'Duration' }
        ];
    }

    container.innerHTML = entries.map((entry, idx) => `
        <div class="entry-item" data-type="${type}" data-index="${idx}">
            <button class="entry-remove" data-type="${type}" data-index="${idx}"><i class="fas fa-times"></i></button>
            ${fields.map(f => `
                <div class="form-group">
                    <label>${f.label}</label>
                    <input type="text" value="${entry[f.key] || ''}" data-field="${f.key}" data-type="${type}" data-index="${idx}" class="entry-field" />
                </div>
            `).join('')}
        </div>
    `).join('');

    container.querySelectorAll('.entry-field').forEach(inp => {
        inp.addEventListener('input', function() {
            const idx = parseInt(this.dataset.index);
            const field = this.dataset.field;
            const type = this.dataset.type;
            const arr = (type === 'education') ? resumeData.education : resumeData.otherQualifications;
            arr[idx][field] = this.value;
            saveData();
            renderPreview();
        });
    });

    container.querySelectorAll('.entry-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.index);
            const type = this.dataset.type;
            if (type === 'education') {
                resumeData.education.splice(idx, 1);
            } else {
                resumeData.otherQualifications.splice(idx, 1);
            }
            saveData();
            populateForm();
            renderPreview();
        });
    });
}

// ============================================================
// ADD ENTRY
// ============================================================
document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const section = this.dataset.section;
        if (section === 'education') {
            resumeData.education.push({ examName: '', board: '', passingYear: '', percentage: '', division: '' });
        } else if (section === 'otherQualification') {
            resumeData.otherQualifications.push({ qualificationName: '', institute: '', passingYear: '', scoreGrade: '', duration: '' });
        }
        saveData();
        populateForm();
        renderPreview();
    });
});

// ============================================================
// PHOTO UPLOAD
// ============================================================
document.getElementById('photoUpload')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            resumeData.photo = ev.target.result;
            saveData();
            renderPreview();
            const previewEl = document.getElementById('photoPreview');
            previewEl.innerHTML = `<img src="${ev.target.result}" alt="Profile" />`;
        };
        reader.readAsDataURL(file);
    }
});

// ============================================================
// REAL-TIME FORM INPUTS
// ============================================================
form.querySelectorAll('input:not(.entry-field):not([type="file"]), select, textarea').forEach(el => {
    if (el.id && el.id !== 'photoUpload' && el.id !== 'declaration') {
        el.addEventListener('input', function() {
            const key = this.id;
            if (key in resumeData) {
                resumeData[key] = this.value;
                saveData();
                renderPreview();
            }
        });
        el.addEventListener('change', function() {
            const key = this.id;
            if (key in resumeData) {
                resumeData[key] = this.value;
                saveData();
                renderPreview();
            }
        });
    }
});

// ============================================================
// SECTION VISIBILITY TOGGLES
// ============================================================
document.querySelectorAll('.section-toggle').forEach(cb => {
    cb.addEventListener('change', function() {
        const section = this.dataset.section;
        visibilityState[section] = this.checked;
        const label = this.closest('.toggle-label');
        if (label) {
            const span = label.querySelector('span');
            if (span) span.textContent = this.checked ? 'Show' : 'Hide';
        }
        localStorage.setItem('resumeBuilderVisibility', JSON.stringify(visibilityState));
        renderPreview();
    });
});

// ============================================================
// THEME TOGGLE
// ============================================================
document.getElementById('themeToggle')?.addEventListener('click', () => {
    darkMode = !darkMode;
    document.getElementById('themeToggle').innerHTML = darkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    renderPreview();
});

// ============================================================
// TEMPLATE SWITCHER
// ============================================================
document.getElementById('templateSelector')?.addEventListener('change', function(e) {
    currentTemplate = e.target.value;
    localStorage.setItem('resumeBuilderTemplate', currentTemplate);
    renderPreview();
});

// ============================================================
// ACCENT COLOR PICKER
// ============================================================
document.getElementById('accentColorPicker')?.addEventListener('input', function(e) {
    accentColor = e.target.value;
    localStorage.setItem('resumeBuilderAccent', accentColor);
    applyAccentColor(accentColor);
});

function applyAccentColor(color) {
    preview.style.setProperty('--preview-primary', color);
}

// ============================================================
// LAYOUT TOGGLE
// ============================================================
document.getElementById('layoutToggle')?.addEventListener('click', function() {
    currentLayout = (currentLayout === 'single') ? 'two-column' : 'single';
    localStorage.setItem('resumeBuilderLayout', currentLayout);
    const label = this.querySelector('span');
    if (label) {
        label.textContent = currentLayout === 'two-column' ? 'Single Column' : 'Two Column';
    }
    renderPreview();
});

// ============================================================
// FONT & SIZE
// ============================================================
document.getElementById('fontSelector')?.addEventListener('change', (e) => {
    preview.style.fontFamily = e.target.value;
});
document.getElementById('fontSizeSelector')?.addEventListener('change', (e) => {
    preview.style.fontSize = e.target.value;
});

// ============================================================
// CLEAR FORM
// ============================================================
document.getElementById('clearFormBtn')?.addEventListener('click', () => {
    if (confirm('Clear all form fields?')) {
        form.querySelectorAll('input:not(.entry-field):not([type="file"]), select, textarea').forEach(el => {
            if (el.id && el.id !== 'declaration') {
                el.value = '';
                if (el.id in resumeData) resumeData[el.id] = '';
            }
        });
        resumeData.education = [];
        resumeData.otherQualifications = [];
        resumeData.photo = null;
        document.getElementById('photoPreview').innerHTML = '<i class="fas fa-user"></i>';
        saveData();
        populateForm();
        renderPreview();
    }
});

// ============================================================
// RESET RESUME
// ============================================================
document.getElementById('resetResumeBtn')?.addEventListener('click', () => {
    if (confirm('Reset everything? This will clear all data.')) {
        localStorage.removeItem('resumeBuilderData');
        localStorage.removeItem('resumeBuilderTemplate');
        localStorage.removeItem('resumeBuilderVisibility');
        localStorage.removeItem('resumeBuilderAccent');
        localStorage.removeItem('resumeBuilderLayout');
        location.reload();
    }
});

// ============================================================
// LOAD SAMPLE DATA
// ============================================================
document.getElementById('loadSampleBtn')?.addEventListener('click', function() {
    if (!confirm('Load sample resume data? This will overwrite your current data.')) return;

    resumeData = {
        applicantName: 'YADAV SUBBA',
        fatherName: 'LT DILLI SINGH SUBBA',
        motherName: 'DIL MAYA SUBBA',
        dob: '08/09/2003',
        gender: 'MALE',
        category: 'OBC/MOBC',
        maritalStatus: 'UNMARRIED',
        knownLanguages: 'NEPALI, ENGLISH, HINDI, ASSAMESE',
        mobileNumber: '7896579939',
        emailAddress: 'yadavsubba2003@gmail.com',
        address: 'HAWAIPUR, PO Dayagmukh',
        experience: 'FRESHER',
        objective: 'To work with an organization where I can learn new skills and increase my abilities for the organizational goals as well as myself.',
        place: 'Guwahati',
        education: [
            { examName: 'Assam High School Leaving Certificate (HSLC)', board: 'SEBA', passingYear: '2020', percentage: '39', division: '3rd Division' },
            { examName: 'Assam Higher Secondary Examination (HS)', board: 'AHSEC', passingYear: '2023', percentage: '81', division: '1st Division' }
        ],
        otherQualifications: [
            { qualificationName: 'BA English (HONS)', institute: 'Gauhati University', passingYear: '2026', scoreGrade: 'Result Pending', duration: '3 Years' }
        ],
        photo: null
    };

    Object.keys(visibilityState).forEach(key => visibilityState[key] = true);
    localStorage.setItem('resumeBuilderVisibility', JSON.stringify(visibilityState));
    document.querySelectorAll('.section-toggle').forEach(cb => {
        cb.checked = true;
        const label = cb.closest('.toggle-label');
        if (label) {
            const span = label.querySelector('span');
            if (span) span.textContent = 'Show';
        }
    });

    saveData();
    populateForm();
    renderPreview();
    alert('Sample resume loaded successfully!');
});

// ============================================================
// RENDER PREVIEW (Exact Resume Format)
// ============================================================
function renderPreview() {
    const d = resumeData;

    // Photo
    const photoHtml = d.photo ? `<img src="${d.photo}" alt="Profile" class="preview-avatar" />` : `<div class="preview-avatar" style="display:flex;align-items:center;justify-content:center;background:#e2e8f0;color:#94a3b8;font-size:2.5rem;"><i class="fas fa-user"></i></div>`;

    // Contact (mobile & email - right side)
    const contactHtml = [
        d.mobileNumber ? `Mobile: ${d.mobileNumber}` : '',
        d.emailAddress ? `Email: ${d.emailAddress}` : ''
    ].filter(Boolean).join(' &nbsp;|&nbsp; ');

    // ---- OBJECTIVE ----
    const objectiveHtml = d.objective ? `
        <div class="resume-section">
            <h3 class="resume-section-title">OBJECTIVE</h3>
            <p>${d.objective}</p>
        </div>
    ` : '';

    // ---- EDUCATION TABLE ----
    let eduHtml = '';
    if (visibilityState.education && d.education.length) {
        eduHtml = `
            <div class="resume-section">
                <h3 class="resume-section-title">EDUCATIONAL QUALIFICATIONS</h3>
                <table class="resume-table">
                    <thead>
                        <tr>
                            <th>Exam Name</th>
                            <th>Board/University</th>
                            <th>Year</th>
                            <th>Percentage</th>
                            <th>Division</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${d.education.map(e => `
                            <tr>
                                <td>${e.examName || ''}</td>
                                <td>${e.board || ''}</td>
                                <td>${e.passingYear || ''}</td>
                                <td>${e.percentage || ''}</td>
                                <td>${e.division || ''}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    // ---- OTHER QUALIFICATIONS TABLE ----
    let otherQualHtml = '';
    if (visibilityState.otherQualifications && d.otherQualifications.length) {
        otherQualHtml = `
            <div class="resume-section">
                <h3 class="resume-section-title">OTHER QUALIFICATIONS</h3>
                <table class="resume-table">
                    <thead>
                        <tr>
                            <th>Qualification</th>
                            <th>Institute/Organization</th>
                            <th>Year</th>
                            <th>Score/Grade</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${d.otherQualifications.map(q => `
                            <tr>
                                <td>${q.qualificationName || ''}</td>
                                <td>${q.institute || ''}</td>
                                <td>${q.passingYear || ''}</td>
                                <td>${q.scoreGrade || ''}</td>
                                <td>${q.duration || ''}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    // ---- PERSONAL INFORMATION TABLE ----
    const personalInfoRows = [
        ['Name', d.applicantName || ''],
        ['Date of Birth', d.dob || ''],
        ["Father's Name", d.fatherName || ''],
        ["Mother's Name", d.motherName || ''],
        ['Gender', d.gender || ''],
        ['Category', d.category || ''],
        ['Marital Status', d.maritalStatus || ''],
        ['Known Languages', d.knownLanguages || ''],
        ['Experience', d.experience || ''],
        ['Address', d.address || '']
    ].filter(row => row[1]); // Only show rows with data

    let personalInfoHtml = '';
    if (personalInfoRows.length) {
        personalInfoHtml = `
            <div class="resume-section">
                <h3 class="resume-section-title">PERSONAL INFORMATION</h3>
                <table class="resume-table personal-table">
                    <tbody>
                        ${personalInfoRows.map(row => `
                            <tr>
                                <td class="label">${row[0]}</td>
                                <td>${row[1]}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    // ---- DECLARATION ----
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const declarationHtml = `
        <div class="resume-section declaration-section">
            <h3 class="resume-section-title">DECLARATION</h3>
            <p>I hereby declare that the above particulars of facts and information stated are true, correct and complete to the best of my belief and knowledge.</p>
            <div class="declaration-footer">
                <span>Date: ${dateStr}</span>
                <span>Place: ${d.place || ''}</span>
                <span class="signature">(${d.applicantName || ''})</span>
            </div>
        </div>
    `;

    // ---- ASSEMBLE FINAL HTML ----
    const html = `
        <div class="resume-preview">
            <div class="resume-header">
                <div class="header-left">
                    <h1 class="resume-title">RESUME</h1>
                    <h2 class="applicant-name">${d.applicantName || 'Your Name'}</h2>
                    <div class="contact-info">${contactHtml}</div>
                </div>
                <div class="header-right">
                    ${photoHtml}
                </div>
            </div>

            ${objectiveHtml}
            ${eduHtml}
            ${otherQualHtml}
            ${personalInfoHtml}
            ${declarationHtml}
        </div>
    `;

    preview.innerHTML = html;

    // Apply UI classes
    preview.className = 'builder__preview-content';
    preview.classList.add('template-' + currentTemplate);
    if (darkMode) preview.classList.add('dark');
    if (currentLayout === 'two-column') preview.classList.add('layout-two-column');
    applyAccentColor(accentColor);
}

// ============================================================
// PDF EXPORT
// ============================================================
document.getElementById('downloadPdfBtn')?.addEventListener('click', function() {
    const previewEl = document.getElementById('resumePreview');
    const originalOverflow = document.body.style.overflow;
    const originalHeight = previewEl.style.height;

    previewEl.style.height = 'auto';
    document.body.style.overflow = 'hidden';

    html2canvas(previewEl, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
        width: previewEl.scrollWidth,
        height: previewEl.scrollHeight,
        windowWidth: previewEl.scrollWidth,
        windowHeight: previewEl.scrollHeight
    }).then(canvas => {
        previewEl.style.height = originalHeight;
        document.body.style.overflow = originalOverflow;

        const imgData = canvas.toDataURL('image/png');
        const pdf = new window.jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = 210;
        const margin = 12;
        const imgWidth = pdfWidth - 2 * margin;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const pageHeight = 297 - 2 * margin;
        let heightLeft = imgHeight;
        let position = margin;

        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
            position = margin - (imgHeight - heightLeft);
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save('resume.pdf');
    }).catch(err => {
        console.error('PDF generation failed:', err);
        alert('Could not generate PDF. Please try again.');
        previewEl.style.height = originalHeight;
        document.body.style.overflow = originalOverflow;
    });
});

// ============================================================
// GENERATE RESUME BUTTON
// ============================================================
document.getElementById('generateResumeBtn')?.addEventListener('click', function() {
    const declaration = document.getElementById('declaration');
    if (declaration && !declaration.checked) {
        alert('Please accept the declaration before generating your resume.');
        return;
    }
    document.getElementById('downloadPdfBtn').click();
});

// ============================================================
// INIT
// ============================================================
loadData();
renderPreview();
