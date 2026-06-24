// ============================================================
// STATE
// ============================================================
let resumeData = {
    fullName: '', fatherName: '', motherName: '', mobile: '', email: '', dob: '',
    gender: '', languages: '', address: '', category: '', maritalStatus: '', experience: '',
    education: [],      // { examName, board, passingYear, percentage, division }
    otherQualifications: [], // { qualificationName, institute, passingYear, scoreGrade, duration }
    skills: [],
    photo: null
};

const form = document.getElementById('resumeForm');
const generateBtn = document.getElementById('generateBtn');
const spinner = document.getElementById('spinnerContainer');

// ============================================================
// POPULATE FORM
// ============================================================
function populateForm() {
    const fields = ['fullName', 'fatherName', 'motherName', 'mobile', 'email', 'dob',
        'gender', 'languages', 'address', 'category', 'maritalStatus', 'experience'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = resumeData[id] || '';
    });
    renderEducation();
    renderOtherQualifications();
    renderSkillTags();
}

// ============================================================
// RENDER EDUCATION
// ============================================================
function renderEducation() {
    const container = document.getElementById('educationList');
    if (!container) return;
    container.innerHTML = resumeData.education.map((entry, idx) => `
        <div class="entry-item" data-idx="${idx}">
            <button class="entry-remove" data-idx="${idx}"><i class="fas fa-times"></i></button>
            <div class="form-group"><label>Exam Name</label><input type="text" value="${entry.examName || ''}" data-field="examName" data-idx="${idx}" class="edu-field" /></div>
            <div class="form-group"><label>Board/University</label><input type="text" value="${entry.board || ''}" data-field="board" data-idx="${idx}" class="edu-field" /></div>
            <div class="form-group"><label>Passing Year</label><input type="text" value="${entry.passingYear || ''}" data-field="passingYear" data-idx="${idx}" class="edu-field" /></div>
            <div class="form-group"><label>Percentage</label><input type="text" value="${entry.percentage || ''}" data-field="percentage" data-idx="${idx}" class="edu-field" /></div>
            <div class="form-group"><label>Division</label>
                <select data-field="division" data-idx="${idx}" class="edu-field">
                    <option value="">-- Division --</option>
                    <option value="1st Division" ${entry.division === '1st Division' ? 'selected' : ''}>1st Division</option>
                    <option value="2nd Division" ${entry.division === '2nd Division' ? 'selected' : ''}>2nd Division</option>
                    <option value="3rd Division" ${entry.division === '3rd Division' ? 'selected' : ''}>3rd Division</option>
                    <option value="Pass" ${entry.division === 'Pass' ? 'selected' : ''}>Pass</option>
                </select>
            </div>
        </div>
    `).join('');

    container.querySelectorAll('.edu-field').forEach(inp => {
        inp.addEventListener('input', function() {
            const idx = parseInt(this.dataset.idx);
            const field = this.dataset.field;
            if (!isNaN(idx) && field) {
                resumeData.education[idx][field] = this.value;
            }
        });
        inp.addEventListener('change', function() {
            const idx = parseInt(this.dataset.idx);
            const field = this.dataset.field;
            if (!isNaN(idx) && field) {
                resumeData.education[idx][field] = this.value;
            }
        });
    });

    container.querySelectorAll('.entry-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.idx);
            if (!isNaN(idx)) {
                resumeData.education.splice(idx, 1);
                renderEducation();
            }
        });
    });
}

// ============================================================
// RENDER OTHER QUALIFICATIONS
// ============================================================
function renderOtherQualifications() {
    const container = document.getElementById('otherList');
    if (!container) return;
    container.innerHTML = resumeData.otherQualifications.map((entry, idx) => `
        <div class="entry-item" data-idx="${idx}">
            <button class="entry-remove" data-idx="${idx}"><i class="fas fa-times"></i></button>
            <div class="form-group"><label>Qualification Name</label><input type="text" value="${entry.qualificationName || ''}" data-field="qualificationName" data-idx="${idx}" class="other-field" /></div>
            <div class="form-group"><label>Institute/Organization</label><input type="text" value="${entry.institute || ''}" data-field="institute" data-idx="${idx}" class="other-field" /></div>
            <div class="form-group"><label>Passing Year</label><input type="text" value="${entry.passingYear || ''}" data-field="passingYear" data-idx="${idx}" class="other-field" /></div>
            <div class="form-group"><label>Score/Grade</label><input type="text" value="${entry.scoreGrade || ''}" data-field="scoreGrade" data-idx="${idx}" class="other-field" /></div>
            <div class="form-group"><label>Duration</label><input type="text" value="${entry.duration || ''}" data-field="duration" data-idx="${idx}" class="other-field" placeholder="e.g., 6 months" /></div>
        </div>
    `).join('');

    container.querySelectorAll('.other-field').forEach(inp => {
        inp.addEventListener('input', function() {
            const idx = parseInt(this.dataset.idx);
            const field = this.dataset.field;
            if (!isNaN(idx) && field) {
                resumeData.otherQualifications[idx][field] = this.value;
            }
        });
        inp.addEventListener('change', function() {
            const idx = parseInt(this.dataset.idx);
            const field = this.dataset.field;
            if (!isNaN(idx) && field) {
                resumeData.otherQualifications[idx][field] = this.value;
            }
        });
    });

    container.querySelectorAll('.entry-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.idx);
            if (!isNaN(idx)) {
                resumeData.otherQualifications.splice(idx, 1);
                renderOtherQualifications();
            }
        });
    });
}

// ============================================================
// RENDER SKILL TAGS
// ============================================================
function renderSkillTags() {
    const container = document.getElementById('skillTags');
    if (!container) return;
    container.innerHTML = resumeData.skills.map(skill => `
        <span class="skill-tag">${skill} <span class="remove-skill" data-skill="${skill}"><i class="fas fa-times-circle"></i></span></span>
    `).join('');

    container.querySelectorAll('.remove-skill').forEach(el => {
        el.addEventListener('click', function() {
            const skill = this.dataset.skill;
            resumeData.skills = resumeData.skills.filter(s => s !== skill);
            renderSkillTags();
        });
    });
}

// ============================================================
// SKILL INPUT (Enter to add)
// ============================================================
document.getElementById('skillInput')?.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        const val = this.value.trim();
        if (val && !resumeData.skills.includes(val)) {
            resumeData.skills.push(val);
            this.value = '';
            renderSkillTags();
        }
    }
});

// ============================================================
// ADD BUTTONS
// ============================================================
document.getElementById('addEduBtn')?.addEventListener('click', () => {
    resumeData.education.push({ examName: '', board: '', passingYear: '', percentage: '', division: '' });
    renderEducation();
});

document.getElementById('addOtherBtn')?.addEventListener('click', () => {
    resumeData.otherQualifications.push({ qualificationName: '', institute: '', passingYear: '', scoreGrade: '', duration: '' });
    renderOtherQualifications();
});

// ============================================================
// REAL-TIME DATA COLLECTION
// ============================================================
document.querySelectorAll('input:not(.edu-field):not(.other-field), select:not(.edu-field), textarea').forEach(el => {
    if (el.id && el.id !== 'photoUpload' && el.id !== 'skillInput' && el.id !== 'declaration') {
        const update = () => {
            if (el.id in resumeData) {
                resumeData[el.id] = el.value;
            }
        };
        el.addEventListener('input', update);
        el.addEventListener('change', update);
    }
});

// ============================================================
// PHOTO UPLOAD (with 100KB limit)
// ============================================================
document.getElementById('photoUpload')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const errorEl = document.getElementById('fileSizeError');
    if (file) {
        if (file.size > 100 * 1024) {
            errorEl.style.display = 'block';
            this.value = '';
            return;
        }
        errorEl.style.display = 'none';
        const reader = new FileReader();
        reader.onload = (ev) => {
            resumeData.photo = ev.target.result;
            document.getElementById('photoPreview').innerHTML = `<img src="${ev.target.result}" alt="Photo" />`;
        };
        reader.readAsDataURL(file);
    }
});

// ============================================================
// VALIDATION – with scroll to first empty field
// ============================================================
function validateForm() {
    const required = [
        { id: 'fullName', label: 'Applicant\'s Name' },
        { id: 'fatherName', label: 'Father\'s Name' },
        { id: 'motherName', label: 'Mother\'s Name' },
        { id: 'mobile', label: 'Mobile Number' },
        { id: 'email', label: 'Email Address' },
        { id: 'dob', label: 'Date of Birth' },
        { id: 'gender', label: 'Gender' },
        { id: 'languages', label: 'Known Languages' },
        { id: 'address', label: 'Address' },
        { id: 'category', label: 'Category' },
        { id: 'maritalStatus', label: 'Marital Status' },
        { id: 'experience', label: 'Experience' }
    ];

    let firstEmpty = null;
    let missing = [];

    required.forEach(({ id, label }) => {
        const el = document.getElementById(id);
        const val = el ? el.value.trim() : '';
        if (!val || val === '') {
            missing.push(label);
            if (!firstEmpty) {
                firstEmpty = el;
                el.classList.add('error');
            }
        } else {
            if (el) el.classList.remove('error');
        }
    });

    if (missing.length) {
        const list = missing.join(', ');
        alert('⚠️ Please fill in all required fields:\n\n' + list);
        if (firstEmpty) {
            firstEmpty.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstEmpty.focus();
        }
        return false;
    }
    return true;
}

// ============================================================
// GENERATE RESUME
// ============================================================
generateBtn.addEventListener('click', function() {
    if (!validateForm()) return;

    spinner.style.display = 'block';
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

    const delay = 2000 + Math.random() * 3000;
    setTimeout(() => {
        generatePDF();
        spinner.style.display = 'none';
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Generate My Resume';
        clearAllData();
    }, delay);
});

// ============================================================
// GENERATE PDF – Matches the reference design exactly
// ============================================================
function generatePDF() {
    const container = document.getElementById('pdfContainer');
    container.innerHTML = buildResumeHTML();

    html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#1f4a3a',
        width: container.scrollWidth,
        height: container.scrollHeight,
        windowWidth: container.scrollWidth,
        windowHeight: container.scrollHeight
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new window.jspdf.jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

        const pdfWidth = 210;
        const pdfHeight = 297;
        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (imgHeight <= pdfHeight) {
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        } else {
            let heightLeft = imgHeight;
            let position = 0;
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
            while (heightLeft > 0) {
                position -= pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }
        }

        const fileName = resumeData.fullName.trim() ? resumeData.fullName.replace(/\s+/g, '_') + '.pdf' : 'resume.pdf';
        pdf.save(fileName);
    }).catch(err => {
        console.error('PDF generation failed:', err);
        alert('Could not generate PDF. Please try again.');
    });
}

// ============================================================
// BUILD RESUME HTML – Exact match to reference
// ============================================================
function buildResumeHTML() {
    const d = resumeData;

    const photoHtml = d.photo
        ? `<img src="${d.photo}" alt="Photo" />`
        : `<img src="https://ui-avatars.com/api/?name=${encodeURIComponent(d.fullName || 'User')}&background=1f4a3a&color=ffffff&size=130&font-size=0.5&bold=true&rounded=true" alt="Photo" />`;

    // Education Table
    let eduHtml = '';
    if (d.education.length) {
        eduHtml = d.education.map(e => `
            <tr>
                <td class="col1">${e.examName || ''}</td>
                <td class="col2">${e.board || ''}</td>
                <td class="col3">${e.passingYear || ''}</td>
                <td class="col4">${e.percentage || ''}</td>
                <td class="col5">${e.division || ''}</td>
            </tr>
        `).join('');
        eduHtml = `
            <table class="exp-table">
                <thead>
                    <tr>
                        <th class="col1">Exam Name</th>
                        <th class="col2">Board/University</th>
                        <th class="col3">Passing Year</th>
                        <th class="col4">Percentage</th>
                        <th class="col5">Division</th>
                    </tr>
                </thead>
                <tbody>${eduHtml}</tbody>
            </table>
        `;
    }

    // Other Qualifications Table
    let otherHtml = '';
    if (d.otherQualifications.length) {
        otherHtml = d.otherQualifications.map(o => `
            <tr>
                <td class="col1">${o.qualificationName || ''}</td>
                <td class="col2">${o.institute || ''}</td>
                <td class="col3">${o.passingYear || ''}</td>
                <td class="col4">${o.scoreGrade || ''}</td>
                <td class="col5">${o.duration || ''}</td>
            </tr>
        `).join('');
        otherHtml = `
            <table class="exp-table">
                <thead>
                    <tr>
                        <th class="col1">Qualification</th>
                        <th class="col2">Institute/Organization</th>
                        <th class="col3">Passing Year</th>
                        <th class="col4">Score/Grade</th>
                        <th class="col5">Duration</th>
                    </tr>
                </thead>
                <tbody>${otherHtml}</tbody>
            </table>
        `;
    }

    // Skills (as tags)
    let skillsHtml = '';
    if (d.skills.length) {
        skillsHtml = `<div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:4px;">${d.skills.map(s => `<span style="background:#1f4a3a; color:#fff; padding:2px 14px; border-radius:50px; font-size:0.85rem;">${s}</span>`).join('')}</div>`;
    }

    // Declaration
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return `
        <div style="background:#1f4a3a; padding:12px; border-radius:5px; width:210mm; box-sizing:border-box;">
            <div style="background:#ffffff; width:100%; padding:30px 36px 34px 36px; border-radius:3px; box-sizing:border-box;">

                <!-- HEADER -->
                <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:24px; margin-bottom:26px; padding-bottom:16px; border-bottom:1px solid #d0d0d0;">
                    <div style="flex:2 1 260px;">
                        <h1 style="font-size:2.2rem; font-weight:600; color:#1f4a3a; letter-spacing:1px; margin:0 0 2px 0; font-family:'Georgia','Times New Roman',serif;">${d.fullName || ''}</h1>
                        <div style="font-size:1rem; color:#3d3d3d; font-weight:400; letter-spacing:0.5px; margin-top:2px;">${d.experience || ''}</div>
                        <div style="margin-top:8px; font-size:0.9rem; color:#444; display:flex; flex-wrap:wrap; gap:4px 22px;">
                            ${d.mobile ? `<span><strong>Mobile:</strong> ${d.mobile}</span>` : ''}
                            ${d.email ? `<span><strong>Email:</strong> ${d.email}</span>` : ''}
                            ${d.address ? `<span><strong>Address:</strong> ${d.address}</span>` : ''}
                        </div>
                    </div>
                    <div style="flex:0 0 130px; width:130px; height:150px; border-radius:50% / 40%; overflow:hidden; border:2px solid #1f4a3a; background:#f0f0f0; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                        ${photoHtml}
                    </div>
                </div>

                <!-- PERSONAL INFORMATION -->
                <div style="margin-bottom:22px;">
                    <div style="background:#1f4a3a; padding:5px 8px; border-radius:3px; display:block; width:100%; margin-bottom:12px;">
                        <h2 style="font-size:1.15rem; font-weight:600; color:#ffffff; letter-spacing:1px; margin:0; font-family:'Georgia',serif;">Personal Information</h2>
                    </div>
                    <table class="info-table" style="width:100%; border-collapse:collapse; font-size:0.95rem; border:none;">
                        <tr><td style="padding:7px 10px 7px 0; border-bottom:1px solid #e8e8e8; vertical-align:top; color:#222; font-weight:600; color:#1f4a3a; width:30%;">Full Name</td><td style="padding:7px 10px 7px 0; border-bottom:1px solid #e8e8e8; vertical-align:top; color:#222; width:70%;">${d.fullName || ''}</td></tr>
                        <tr><td style="padding:7px 10px 7px 0; border-bottom:1px solid #e8e8e8; vertical-align:top; color:#222; font-weight:600; color:#1f4a3a; width:30%;">Father's Name</td><td style="padding:7px 10px 7px 0; border-bottom:1px solid #e8e8e8; vertical-align:top; color:#222; width:70%;">${d.fatherName || ''}</td></tr>
                        <tr><td style="padding:7px 10px 7px 0; border-bottom:1px solid #e8e8e8; vertical-align:top; color:#222; font-weight:600; color:#1f4a3a; width:30%;">Mother's Name</td><td style="padding:7px 10px 7px 0; border-bottom:1px solid #e8e8e8; vertical-align:top; color:#222; width:70%;">${d.motherName || ''}</td></tr>
                        <tr><td style="padding:7px 10px 7px 0; border-bottom:1px solid #e8e8e8; vertical-align:top; color:#222; font-weight:600; color:#1f4a3a; width:30%;">Date of Birth</td><td style="padding:7px 10px 7px 0; border-bottom:1px solid #e8e8e8; vertical-align:top; color:#222; width:70%;">${d.dob || ''}</td></tr>
                        <tr><td style="padding:7px 10px 7px 0; border-bottom:1px solid #e8e8e8; vertical-align:top; color:#222; font-weight:600; color:#1f4a3a; width:30%;">Gender</td><td style="padding:7px 10px 7px 0; border-bottom:1px solid #e8e8e8; vertical-align:top; color:#222; width:70%;">${d.gender || ''}</td></tr>
                        <tr><td style="padding:7px 10px 7px 0; border-bottom:1px solid #e8e8e8; vertical-align:top; color:#222; font-weight:600; color:#1f4a3a; width:30%;">Category</td><td style="padding:7px 10px 7px 0; border-bottom:1px solid #e8e8e8; vertical-align:top; color:#222; width:70%;">${d.category || ''}</td></tr>
                        <tr><td style="padding:7px 10px 7px 0; border-bottom:1px solid #e8e8e8; vertical-align:top; color:#222; font-weight:600; color:#1f4a3a; width:30%;">Marital Status</td><td style="padding:7px 10px 7px 0; border-bottom:1px solid #e8e8e8; vertical-align:top; color:#222; width:70%;">${d.maritalStatus || ''}</td></tr>
                        <tr><td style="padding:7px 10px 7px 0; border-bottom:1px solid #e8e8e8; vertical-align:top; color:#222; font-weight:600; color:#1f4a3a; width:30%;">Known Languages</td><td style="padding:7px 10px 7px 0; border-bottom:1px solid #e8e8e8; vertical-align:top; color:#222; width:70%;">${d.languages || ''}</td></tr>
                        <tr><td style="padding:7px 10px 7px 0; border-bottom:1px solid #e8e8e8; vertical-align:top; color:#222; font-weight:600; color:#1f4a3a; width:30%;">Experience</td><td style="padding:7px 10px 7px 0; border-bottom:1px solid #e8e8e8; vertical-align:top; color:#222; width:70%;">${d.experience || ''}</td></tr>
                    </table>
                </div>

                <!-- EDUCATION -->
                ${d.education.length ? `
                    <div style="margin-bottom:22px;">
                        <div style="background:#1f4a3a; padding:5px 8px; border-radius:3px; display:block; width:100%; margin-bottom:12px;">
                            <h2 style="font-size:1.15rem; font-weight:600; color:#ffffff; letter-spacing:1px; margin:0; font-family:'Georgia',serif;">Educational Qualifications</h2>
                        </div>
                        ${eduHtml}
                    </div>
                ` : ''}

                <!-- OTHER QUALIFICATIONS -->
                ${d.otherQualifications.length ? `
                    <div style="margin-bottom:22px;">
                        <div style="background:#1f4a3a; padding:5px 8px; border-radius:3px; display:block; width:100%; margin-bottom:12px;">
                            <h2 style="font-size:1.15rem; font-weight:600; color:#ffffff; letter-spacing:1px; margin:0; font-family:'Georgia',serif;">Other Qualifications</h2>
                        </div>
                        ${otherHtml}
                    </div>
                ` : ''}

                <!-- SKILLS -->
                ${d.skills.length ? `
                    <div style="margin-bottom:22px;">
                        <div style="background:#1f4a3a; padding:5px 8px; border-radius:3px; display:block; width:100%; margin-bottom:12px;">
                            <h2 style="font-size:1.15rem; font-weight:600; color:#ffffff; letter-spacing:1px; margin:0; font-family:'Georgia',serif;">Skills</h2>
                        </div>
                        ${skillsHtml}
                    </div>
                ` : ''}

                <!-- DECLARATION -->
                <div>
                    <div style="background:#1f4a3a; padding:5px 8px; border-radius:3px; display:block; width:100%; margin-bottom:12px;">
                        <h2 style="font-size:1.15rem; font-weight:600; color:#ffffff; letter-spacing:1px; margin:0; font-family:'Georgia',serif;">Declaration</h2>
                    </div>
                    <div style="background:#f9f9f9; border-left:4px solid #1f4a3a; padding:16px 22px; margin-top:4px; color:#222; font-size:0.95rem; line-height:1.6;">
                        <p>
                            I, <strong>${d.fullName || ''}</strong>, do hereby solemnly declare that all
                            information furnished above is true and complete to the best of my knowledge and belief.
                        </p>
                        <div style="margin-top:12px; text-align:right; font-weight:600; color:#1f4a3a; font-family:'Georgia',serif; letter-spacing:0.5px;">
                            — ${d.fullName || ''}<br />
                            <span style="font-weight:400; color:#555; font-size:0.8rem;">${dateStr}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    `;
}

// ============================================================
// CLEAR ALL DATA
// ============================================================
function clearAllData() {
    Object.keys(resumeData).forEach(key => {
        if (Array.isArray(resumeData[key])) {
            resumeData[key] = [];
        } else {
            resumeData[key] = '';
        }
    });
    document.querySelectorAll('input:not(.edu-field):not(.other-field), select:not(.edu-field), textarea').forEach(el => {
        if (el.id && el.id !== 'photoUpload' && el.id !== 'skillInput' && el.id !== 'declaration') {
            el.value = '';
        }
    });
    document.getElementById('photoPreview').innerHTML = '<i class="fas fa-user"></i>';
    document.getElementById('photoUpload').value = '';
    document.getElementById('skillInput').value = '';
    document.getElementById('skillTags').innerHTML = '';
    document.getElementById('declaration').checked = true;
    renderEducation();
    renderOtherQualifications();
    renderSkillTags();
}

// ============================================================
// INIT
// ============================================================
populateForm();
