// ============================================================
// STATE – In-memory only
// ============================================================
let resumeData = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    profile: '',
    experience: [],   // { jobTitle, company, location, startDate, endDate, responsibilities }
    education: [],    // { degree, institution, location, startDate, endDate }
    photo: null
};

const form = document.getElementById('resumeForm');
const generateBtn = document.getElementById('generateBtn');
const spinner = document.getElementById('spinnerContainer');

// ============================================================
// POPULATE FORM (empty)
// ============================================================
function populateForm() {
    ['fullName', 'email', 'phone', 'address', 'profile'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = resumeData[id] || '';
    });
    renderExperience();
    renderEducation();
}

// ============================================================
// RENDER EXPERIENCE
// ============================================================
function renderExperience() {
    const container = document.getElementById('experienceList');
    if (!container) return;
    container.innerHTML = resumeData.experience.map((entry, idx) => `
        <div class="entry-item" data-idx="${idx}">
            <button class="entry-remove" data-idx="${idx}"><i class="fas fa-times"></i></button>
            <div class="form-group"><label>Job Title</label><input type="text" value="${entry.jobTitle || ''}" data-field="jobTitle" data-idx="${idx}" class="exp-field" /></div>
            <div class="form-group"><label>Company</label><input type="text" value="${entry.company || ''}" data-field="company" data-idx="${idx}" class="exp-field" /></div>
            <div class="form-group"><label>Location</label><input type="text" value="${entry.location || ''}" data-field="location" data-idx="${idx}" class="exp-field" /></div>
            <div class="form-group"><label>Start Date</label><input type="text" value="${entry.startDate || ''}" data-field="startDate" data-idx="${idx}" class="exp-field" placeholder="e.g. Jan 2017" /></div>
            <div class="form-group"><label>End Date</label><input type="text" value="${entry.endDate || ''}" data-field="endDate" data-idx="${idx}" class="exp-field" placeholder="e.g. Sept 2019" /></div>
            <div class="form-group"><label>Responsibilities</label><textarea rows="2" data-field="responsibilities" data-idx="${idx}" class="exp-field">${entry.responsibilities || ''}</textarea></div>
        </div>
    `).join('');

    container.querySelectorAll('.exp-field').forEach(inp => {
        inp.addEventListener('input', function() {
            const idx = parseInt(this.dataset.idx);
            const field = this.dataset.field;
            if (!isNaN(idx) && field) {
                resumeData.experience[idx][field] = this.value;
            }
        });
    });

    container.querySelectorAll('.entry-remove').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.dataset.idx);
            if (!isNaN(idx)) {
                resumeData.experience.splice(idx, 1);
                renderExperience();
            }
        });
    });
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
            <div class="form-group"><label>Degree</label><input type="text" value="${entry.degree || ''}" data-field="degree" data-idx="${idx}" class="edu-field" /></div>
            <div class="form-group"><label>Institution</label><input type="text" value="${entry.institution || ''}" data-field="institution" data-idx="${idx}" class="edu-field" /></div>
            <div class="form-group"><label>Location</label><input type="text" value="${entry.location || ''}" data-field="location" data-idx="${idx}" class="edu-field" /></div>
            <div class="form-group"><label>Start Date</label><input type="text" value="${entry.startDate || ''}" data-field="startDate" data-idx="${idx}" class="edu-field" placeholder="e.g. Sept 2014" /></div>
            <div class="form-group"><label>End Date</label><input type="text" value="${entry.endDate || ''}" data-field="endDate" data-idx="${idx}" class="edu-field" placeholder="e.g. June 2017" /></div>
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
// ADD BUTTONS
// ============================================================
document.getElementById('addExpBtn')?.addEventListener('click', () => {
    resumeData.experience.push({ jobTitle: '', company: '', location: '', startDate: '', endDate: '', responsibilities: '' });
    renderExperience();
});

document.getElementById('addEduBtn')?.addEventListener('click', () => {
    resumeData.education.push({ degree: '', institution: '', location: '', startDate: '', endDate: '' });
    renderEducation();
});

// ============================================================
// REAL-TIME DATA COLLECTION
// ============================================================
form.querySelectorAll('input:not(.exp-field):not(.edu-field), textarea:not(.exp-field):not(.edu-field)').forEach(el => {
    if (el.id && el.id !== 'photoUpload') {
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
// PHOTO UPLOAD
// ============================================================
document.getElementById('photoUpload')?.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
            resumeData.photo = ev.target.result;
            document.getElementById('photoPreview').innerHTML = `<img src="${ev.target.result}" alt="Photo" />`;
        };
        reader.readAsDataURL(file);
    }
});

// ============================================================
// VALIDATION
// ============================================================
function validateForm() {
    const required = ['fullName', 'email', 'phone', 'address', 'profile'];
    const missing = required.filter(id => !document.getElementById(id).value.trim());
    if (missing.length) {
        alert('Please fill in all required fields: ' + missing.join(', '));
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
        generateBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Generate Resume';
        clearAllData();
    }, delay);
});

// ============================================================
// GENERATE PDF – with border, 15px margin, border-radius 5px
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
        const pdf = new window.jspdf.jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

        const pdfWidth = 210;
        const pdfHeight = 297;
        const margin = 0;
        const imgWidth = pdfWidth - 2 * margin;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // If content fits on one page
        if (imgHeight <= pdfHeight - 2 * margin) {
            pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
        } else {
            // Multi-page
            let heightLeft = imgHeight;
            let position = margin;
            const pageHeight = pdfHeight - 2 * margin;

            pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                position = margin - (imgHeight - heightLeft);
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
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
// BUILD RESUME HTML – Matches reference image
// ============================================================
function buildResumeHTML() {
    const d = resumeData;

    // Photo (top right)
    const photoHtml = d.photo ? `<img src="${d.photo}" style="width:90px; height:90px; border-radius:50%; object-fit:cover; float:right; margin-left:20px; border:2px solid #333;" />` : '';

    // Experience entries
    let expHtml = '';
    if (d.experience.length) {
        expHtml = d.experience.map(exp => `
            <div style="margin-bottom:14px;">
                <div style="font-weight:600; font-size:1rem;">${exp.jobTitle || ''}</div>
                <div style="font-weight:500; color:#444;">${exp.company || ''}${exp.location ? ', ' + exp.location : ''}</div>
                <div style="font-size:0.85rem; color:#666; margin-bottom:4px;">${exp.startDate || ''}${exp.startDate && exp.endDate ? ' – ' : ''}${exp.endDate || ''}</div>
                ${exp.responsibilities ? `<ul style="margin:4px 0 0 20px; padding:0; list-style:disc;">${exp.responsibilities.split('\n').filter(line => line.trim()).map(line => `<li style="font-size:0.92rem;">${line}</li>`).join('')}</ul>` : ''}
            </div>
        `).join('');
    }

    // Education entries
    let eduHtml = '';
    if (d.education.length) {
        eduHtml = d.education.map(edu => `
            <div style="margin-bottom:10px;">
                <div style="font-weight:600; font-size:1rem;">${edu.degree || ''}</div>
                <div style="font-weight:500; color:#444;">${edu.institution || ''}${edu.location ? ', ' + edu.location : ''}</div>
                <div style="font-size:0.85rem; color:#666;">${edu.startDate || ''}${edu.startDate && edu.endDate ? ' – ' : ''}${edu.endDate || ''}</div>
            </div>
        `).join('');
    }

    return `
        <div style="width:100%; padding:15px; box-sizing:border-box; background:#fff; font-family:Arial, sans-serif; color:#000;">
            <div style="border:2px solid #000; border-radius:5px; padding:25px 30px; width:100%; box-sizing:border-box; background:#fff; min-height:257mm;">

                <!-- Header with photo -->
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:20px; border-bottom:2px solid #eee; padding-bottom:12px;">
                    <div style="flex:1;">
                        <h1 style="font-size:2.2rem; font-weight:700; margin:0; text-transform:uppercase; letter-spacing:1px;">${d.fullName || ''}</h1>
                    </div>
                    ${d.photo ? `<div>${photoHtml}</div>` : ''}
                </div>

                <!-- Personal Information -->
                <div style="margin-bottom:16px;">
                    <h2 style="font-size:1.1rem; font-weight:700; text-transform:uppercase; margin:0 0 6px 0; color:#000;">Personal Information</h2>
                    <div style="font-size:0.95rem; line-height:1.6;">
                        ${d.email ? `<div><strong>Email address:</strong> ${d.email}</div>` : ''}
                        ${d.phone ? `<div><strong>Phone number:</strong> ${d.phone}</div>` : ''}
                        ${d.address ? `<div><strong>Address:</strong> ${d.address}</div>` : ''}
                    </div>
                </div>

                <!-- Profile -->
                ${d.profile ? `
                    <div style="margin-bottom:16px;">
                        <h2 style="font-size:1.1rem; font-weight:700; text-transform:uppercase; margin:0 0 6px 0; color:#000;">Profile</h2>
                        <p style="font-size:0.95rem; line-height:1.5; margin:0;">${d.profile}</p>
                    </div>
                ` : ''}

                <!-- Professional Experience -->
                ${expHtml ? `
                    <div style="margin-bottom:16px;">
                        <h2 style="font-size:1.1rem; font-weight:700; text-transform:uppercase; margin:0 0 10px 0; color:#000;">Professional Experience</h2>
                        ${expHtml}
                    </div>
                ` : ''}

                <!-- Education -->
                ${eduHtml ? `
                    <div style="margin-bottom:0;">
                        <h2 style="font-size:1.1rem; font-weight:700; text-transform:uppercase; margin:0 0 10px 0; color:#000;">Education</h2>
                        ${eduHtml}
                    </div>
                ` : ''}

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
    document.querySelectorAll('input:not(.exp-field):not(.edu-field), textarea:not(.exp-field):not(.edu-field)').forEach(el => {
        if (el.id && el.id !== 'photoUpload') el.value = '';
    });
    document.getElementById('photoPreview').innerHTML = '<i class="fas fa-user"></i>';
    document.getElementById('photoUpload').value = '';
    renderExperience();
    renderEducation();
}

// ============================================================
// INIT
// ============================================================
populateForm();
