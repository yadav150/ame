// ============================================================
// STATE – In-memory only, no persistence
// ============================================================
let resumeData = {
    applicantName: '',
    designation: '',
    village: '',
    mouza: '',
    po: '',
    ps: '',
    revenue: '',
    subDivision: '',
    district: '',
    state: '',
    mobileNumber: '',
    emailAddress: '',
    objective: '',
    education: [],      // { qualification, board, year, percentage }
    otherQualifications: '',
    workExperience: '',
    skills: '',
    fatherName: '',
    dob: '',
    languageKnown: '',
    gender: '',
    nationality: '',
    maritalStatus: '',
    place: ''
};

// ============================================================
// DOM REFS
// ============================================================
const form = document.getElementById('resumeForm');
const generateBtn = document.getElementById('generateBtn');
const spinner = document.getElementById('spinnerContainer');

// ============================================================
// POPULATE FORM (empty on load)
// ============================================================
function populateForm() {
    const fields = [
        'applicantName', 'designation', 'village', 'mouza', 'po', 'ps',
        'revenue', 'subDivision', 'district', 'state',
        'mobileNumber', 'emailAddress', 'objective',
        'otherQualifications', 'workExperience', 'skills',
        'fatherName', 'dob', 'languageKnown', 'gender',
        'nationality', 'maritalStatus', 'place'
    ];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = resumeData[id] || '';
    });
    renderEducationEntries();
}

// ============================================================
// RENDER EDUCATION ENTRIES (with all fields)
// ============================================================
function renderEducationEntries() {
    const container = document.getElementById('educationList');
    if (!container) return;

    container.innerHTML = resumeData.education.map((entry, idx) => `
        <div class="entry-item" data-index="${idx}">
            <button class="entry-remove" data-index="${idx}"><i class="fas fa-times"></i></button>
            <div class="form-group"><label>Qualification</label><input type="text" value="${entry.qualification || ''}" data-field="qualification" data-index="${idx}" class="entry-field" /></div>
            <div class="form-group"><label>University/Board</label><input type="text" value="${entry.board || ''}" data-field="board" data-index="${idx}" class="entry-field" /></div>
            <div class="form-group"><label>Year</label><input type="text" value="${entry.year || ''}" data-field="year" data-index="${idx}" class="entry-field" /></div>
            <div class="form-group"><label>Per %</label><input type="text" value="${entry.percentage || ''}" data-field="percentage" data-index="${idx}" class="entry-field" /></div>
        </div>
    `).join('');

    // Attach input events to update data
    container.querySelectorAll('.entry-field').forEach(inp => {
        inp.removeEventListener('input', handleFieldInput);
        inp.addEventListener('input', handleFieldInput);
    });

    // Remove buttons
    container.querySelectorAll('.entry-remove').forEach(btn => {
        btn.removeEventListener('click', handleRemove);
        btn.addEventListener('click', handleRemove);
    });
}

// ===== Helper for education field input =====
function handleFieldInput(e) {
    const idx = parseInt(this.dataset.index);
    const field = this.dataset.field;
    if (!isNaN(idx) && field) {
        resumeData.education[idx][field] = this.value;
    }
}

// ===== Helper for education remove =====
function handleRemove(e) {
    const idx = parseInt(this.dataset.index);
    if (!isNaN(idx)) {
        resumeData.education.splice(idx, 1);
        renderEducationEntries();
    }
}

// ============================================================
// ADD EDUCATION ROW (plus icon works)
// ============================================================
document.getElementById('addEducationBtn')?.addEventListener('click', function() {
    resumeData.education.push({ qualification: '', board: '', year: '', percentage: '' });
    renderEducationEntries();
});

// ============================================================
// REAL-TIME DATA COLLECTION (no preview)
// ============================================================
form.querySelectorAll('input:not(.entry-field), textarea, select').forEach(el => {
    if (el.id && el.id !== 'declaration') {
        const updateData = () => {
            const key = el.id;
            if (key in resumeData) {
                resumeData[key] = el.value;
            }
        };
        el.addEventListener('input', updateData);
        el.addEventListener('change', updateData);
    }
});

// ============================================================
// GENERATE RESUME – spinner and PDF download
// ============================================================
generateBtn.addEventListener('click', function() {
    const declaration = document.getElementById('declaration');
    if (declaration && !declaration.checked) {
        alert('Please accept the declaration before generating your resume.');
        return;
    }

    // Show spinner, disable button
    spinner.style.display = 'block';
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

    // Random delay 3-7 seconds
    const delay = 3000 + Math.random() * 4000;
    setTimeout(() => {
        generatePDF();
        spinner.style.display = 'none';
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Generate Resume';
        // Clear all data after generation
        clearAllData();
    }, delay);
});

// ============================================================
// GENERATE PDF – full width A4 with all fields
// ============================================================
function generatePDF() {
    const container = document.getElementById('pdfContainer');
    container.innerHTML = buildResumeHTML();

    html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: container.scrollWidth,
        height: container.scrollHeight,
        windowWidth: container.scrollWidth,
        windowHeight: container.scrollHeight
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new window.jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pdfWidth = 210;
        const margin = 0; // padding is handled inside container
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

        // Filename based on applicant name
        let fileName = 'resume.pdf';
        const name = resumeData.applicantName.trim();
        if (name) {
            fileName = name.replace(/\s+/g, '_') + '.pdf';
        }
        pdf.save(fileName);
    }).catch(err => {
        console.error('PDF generation failed:', err);
        alert('Could not generate PDF. Please try again.');
    });
}

// ============================================================
// BUILD RESUME HTML (exact match to reference, with all fields)
// ============================================================
function buildResumeHTML() {
    const d = resumeData;

    // Address lines
    const addressParts = [];
    if (d.village) addressParts.push(`Village: ${d.village}`);
    if (d.mouza) addressParts.push(`Mouza: ${d.mouza}`);
    if (d.po) addressParts.push(`P.O.: ${d.po}`);
    if (d.ps) addressParts.push(`P.S.: ${d.ps}`);
    if (d.revenue) addressParts.push(`Revenue: ${d.revenue}`);
    if (d.subDivision) addressParts.push(`Sub Division: ${d.subDivision}`);
    if (d.district) addressParts.push(`District: ${d.district}`);
    if (d.state) addressParts.push(`State: ${d.state}`);
    const addressHtml = addressParts.length ? `<div class="resume-address">${addressParts.join('<br>')}</div>` : '';

    // Contact
    const contactParts = [];
    if (d.mobileNumber) contactParts.push(`Mob No. : ${d.mobileNumber}`);
    if (d.emailAddress) contactParts.push(`Email Id : ${d.emailAddress}`);
    const contactHtml = contactParts.length ? `<div class="resume-contact">${contactParts.join(' &nbsp;|&nbsp; ')}</div>` : '';

    // Objective
    const objectiveHtml = d.objective ? `
        <div class="resume-section">
            <div class="resume-section-title">CAREER OBJECTIVE</div>
            <p>${d.objective}</p>
        </div>
    ` : '';

    // Academic Qualifications
    let eduHtml = '';
    if (d.education.length) {
        const rows = d.education.map((e, i) => `
            <tr>
                <td class="sno">${i+1}</td>
                <td>${e.qualification || ''}</td>
                <td>${e.board || ''}</td>
                <td>${e.year || ''}</td>
                <td>${e.percentage || ''}</td>
            </tr>
        `).join('');
        eduHtml = `
            <div class="resume-section">
                <div class="resume-section-title">ACADEMIC QUALIFICATION</div>
                <table class="resume-table">
                    <thead>
                        <tr><th>S.No.</th><th>Qualification</th><th>University / Board</th><th>Year</th><th>Per %</th></tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;
    }

    // Other Qualifications
    let otherHtml = '';
    if (d.otherQualifications) {
        const items = d.otherQualifications.split('\n').filter(line => line.trim());
        if (items.length) {
            otherHtml = `
                <div class="resume-section">
                    <div class="resume-section-title">OTHER QUALIFICATION</div>
                    <ul>
                        ${items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    }

    // Work Experience
    let workHtml = '';
    if (d.workExperience) {
        const items = d.workExperience.split('\n').filter(line => line.trim());
        if (items.length) {
            workHtml = `
                <div class="resume-section">
                    <div class="resume-section-title">WORK EXPERIENCE</div>
                    <ul>
                        ${items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    }

    // Skills
    let skillsHtml = '';
    if (d.skills) {
        const items = d.skills.split('\n').filter(line => line.trim());
        if (items.length) {
            skillsHtml = `
                <div class="resume-section">
                    <div class="resume-section-title">SKILLS</div>
                    <ul>
                        ${items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
    }

    // Personal Information
    const personalFields = [
        { label: "Father's Name", value: d.fatherName },
        { label: 'Date of Birth', value: d.dob },
        { label: 'Language Known', value: d.languageKnown },
        { label: 'Gender', value: d.gender },
        { label: 'Nationality', value: d.nationality },
        { label: 'Marital Status', value: d.maritalStatus }
    ].filter(f => f.value);

    let personalHtml = '';
    if (personalFields.length) {
        personalHtml = `
            <div class="resume-section">
                <div class="resume-section-title">PERSONAL INFORMATION</div>
                <div class="personal-info-grid">
                    ${personalFields.map(f => `
                        <div class="personal-info-item">
                            <span class="label">${f.label} :</span>
                            <span class="value">${f.value}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    // Declaration
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const declarationHtml = `
        <div class="resume-section">
            <div class="resume-section-title">DECLARATION</div>
            <p>I hereby declared that the above information given by me is true to best of my Knowledge.</p>
            <div class="declaration-footer">
                <span>Date : ${dateStr}</span>
                <span>Place : ${d.place || ''}</span>
                <span class="signature">(${d.applicantName || ''})</span>
            </div>
        </div>
    `;

    // ---- Assemble full resume ----
    return `
        <div class="resume-pdf" style="font-family:Arial, sans-serif; color:#000; line-height:1.5; padding:0; margin:0; width:100%;">
            <div class="resume-header" style="margin-bottom:20px;">
                <div class="resume-name" style="font-size:2.2rem; font-weight:700; text-transform:uppercase; letter-spacing:1px; margin-bottom:2px;">${d.applicantName || ''}</div>
                <div class="resume-title" style="font-size:1.1rem; font-weight:500; color:#333; margin:0 0 6px 0;">${d.designation || ''}</div>
                ${addressHtml}
                ${contactHtml}
            </div>
            ${objectiveHtml}
            ${eduHtml}
            ${otherHtml}
            ${workHtml}
            ${skillsHtml}
            ${personalHtml}
            ${declarationHtml}
        </div>
    `;
}

// ============================================================
// CLEAR ALL DATA (reset after generation)
// ============================================================
function clearAllData() {
    // Reset resumeData
    Object.keys(resumeData).forEach(key => {
        if (Array.isArray(resumeData[key])) {
            resumeData[key] = [];
        } else {
            resumeData[key] = '';
        }
    });
    // Clear form fields (not education entries, they'll be cleared via render)
    form.querySelectorAll('input:not(.entry-field), textarea, select').forEach(el => {
        if (el.id && el.id !== 'declaration') {
            el.value = '';
        }
    });
    // Reset declaration checkbox
    const decl = document.getElementById('declaration');
    if (decl) decl.checked = true;
    // Clear education list
    renderEducationEntries();
}

// ============================================================
// INIT
// ============================================================
populateForm();
