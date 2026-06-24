// ============================================================
// STATE – In-memory only, no localStorage
// ============================================================
let resumeData = {
    applicantName: '',
    designation: '',
    address: '',
    mobileNumber: '',
    emailAddress: '',
    objective: '',
    education: [],      // { qualification, board, year, percentage }
    otherQualifications: '',
    workExperience: '',
    fatherName: '',
    dob: '',
    languageKnown: '',
    gender: '',
    nationality: '',
    maritalStatus: '',
    place: ''
};

let darkMode = false;
let accentColor = '#4f46e5';

// ============================================================
// DOM REFS
// ============================================================
const preview = document.getElementById('resumePreview');
const form = document.getElementById('resumeForm');

// ============================================================
// INIT – No loading from localStorage
// ============================================================
function init() {
    populateForm();
    renderPreview();
}

// ============================================================
// POPULATE FORM FROM DATA (empty on load)
// ============================================================
function populateForm() {
    document.getElementById('applicantName').value = resumeData.applicantName || '';
    document.getElementById('designation').value = resumeData.designation || '';
    document.getElementById('address').value = resumeData.address || '';
    document.getElementById('mobileNumber').value = resumeData.mobileNumber || '';
    document.getElementById('emailAddress').value = resumeData.emailAddress || '';
    document.getElementById('objective').value = resumeData.objective || '';
    document.getElementById('otherQualifications').value = resumeData.otherQualifications || '';
    document.getElementById('workExperience').value = resumeData.workExperience || '';
    document.getElementById('fatherName').value = resumeData.fatherName || '';
    document.getElementById('dob').value = resumeData.dob || '';
    document.getElementById('languageKnown').value = resumeData.languageKnown || '';
    document.getElementById('gender').value = resumeData.gender || '';
    document.getElementById('nationality').value = resumeData.nationality || '';
    document.getElementById('maritalStatus').value = resumeData.maritalStatus || '';
    document.getElementById('place').value = resumeData.place || '';

    renderEntries('educationList', resumeData.education);
}

// ============================================================
// RENDER EDUCATION ENTRIES
// ============================================================
function renderEntries(containerId, entries) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = entries.map((entry, idx) => `
        <div class="entry-item" data-index="${idx}">
            <button class="entry-remove" data-index="${idx}"><i class="fas fa-times"></i></button>
            <div class="form-group"><label>Qualification</label><input type="text" value="${entry.qualification || ''}" data-field="qualification" data-index="${idx}" class="entry-field" /></div>
            <div class="form-group"><label>University/Board</label><input type="text" value="${entry.board || ''}" data-field="board" data-index="${idx}" class="entry-field" /></div>
            <div class="form-group"><label>Year</label><input type="text" value="${entry.year || ''}" data-field="year" data-index="${idx}" class="entry-field" /></div>
            <div class="form-group"><label>Per %</label><input type="text" value="${entry.percentage || ''}" data-field="percentage" data-index="${idx}" class="entry-field" /></div>
        </div>
    `).join('');

    container.querySelectorAll('.entry-field').forEach(inp => {
        inp.addEventListener('input', function() {
            const idx = parseInt(this.dataset.index);
            const field = this.dataset.field;
            resumeData.education[idx][field] = this.value;
            renderPreview();
        });
    });

    container.querySelectorAll('.entry-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.index);
            resumeData.education.splice(idx, 1);
            populateForm();
            renderPreview();
        });
    });
}

// ============================================================
// ADD EDUCATION ROW
// ============================================================
document.querySelector('.add-btn[data-section="education"]')?.addEventListener('click', function() {
    resumeData.education.push({ qualification: '', board: '', year: '', percentage: '' });
    populateForm();
    renderPreview();
});

// ============================================================
// REAL-TIME FORM INPUTS (update resumeData)
// ============================================================
form.querySelectorAll('input:not(.entry-field), textarea, select').forEach(el => {
    if (el.id && el.id !== 'declaration') {
        el.addEventListener('input', function() {
            const key = this.id;
            if (key in resumeData) {
                resumeData[key] = this.value;
                renderPreview();
            }
        });
        el.addEventListener('change', function() {
            const key = this.id;
            if (key in resumeData) {
                resumeData[key] = this.value;
                renderPreview();
            }
        });
    }
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
// ACCENT COLOR PICKER
// ============================================================
document.getElementById('accentColorPicker')?.addEventListener('input', function(e) {
    accentColor = e.target.value;
    applyAccentColor(accentColor);
});

function applyAccentColor(color) {
    preview.style.setProperty('--preview-primary', color);
}

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
// RENDER PREVIEW – EXACT MATCH TO REFERENCE IMAGE
// ============================================================
function renderPreview() {
    const d = resumeData;

    // Build address lines
    const addressLines = d.address ? d.address.split('\n').filter(line => line.trim()) : [];
    const addressHtml = addressLines.length ? `<div class="resume-address">${addressLines.join('<br>')}</div>` : '';

    // Contact info
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

    // Personal Information (key-value pairs)
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
    const html = `
        <div class="resume-preview">
            <div class="resume-header">
                <div class="resume-name">${d.applicantName || ''}</div>
                <div class="resume-title">${d.designation || ''}</div>
                ${addressHtml}
                ${contactHtml}
            </div>
            ${objectiveHtml}
            ${eduHtml}
            ${otherHtml}
            ${workHtml}
            ${personalHtml}
            ${declarationHtml}
        </div>
    `;

    preview.innerHTML = html;

    // Apply UI classes
    preview.className = 'builder__preview-content';
    if (darkMode) preview.classList.add('dark');
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
// GENERATE RESUME – GLOBAL FUNCTION (inline onclick)
// ============================================================
function generateResume() {
    console.log('Generate Resume clicked!');

    const declaration = document.getElementById('declaration');
    if (declaration && !declaration.checked) {
        alert('Please accept the declaration before generating your resume.');
        return;
    }

    const pdfBtn = document.getElementById('downloadPdfBtn');
    if (pdfBtn) {
        pdfBtn.click();
    } else {
        alert('PDF button not found. Please try again.');
    }
}

// ============================================================
// INIT
// ============================================================
init();
