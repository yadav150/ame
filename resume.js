// ===== State =====
let resumeData = {
    fullName: '', profTitle: '', email: '', phone: '', address: '', linkedin: '', github: '', portfolio: '',
    summary: '',
    education: [],
    experience: [],
    skills: [],
    projects: [],
    certifications: '', achievements: '', languages: '', interests: '',
    customTitle: '', customContent: ''
};

// ===== DOM refs =====
const preview = document.getElementById('resumePreview');
const form = document.getElementById('resumeForm');

// ===== Load from localStorage =====
function loadData() {
    const saved = localStorage.getItem('resumeBuilderData');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            Object.assign(resumeData, parsed);
            populateForm();
            renderPreview();
        } catch (e) {}
    }
}

// ===== Save to localStorage =====
function saveData() {
    localStorage.setItem('resumeBuilderData', JSON.stringify(resumeData));
}

// ===== Populate form from resumeData =====
function populateForm() {
    document.getElementById('fullName').value = resumeData.fullName || '';
    document.getElementById('profTitle').value = resumeData.profTitle || '';
    document.getElementById('email').value = resumeData.email || '';
    document.getElementById('phone').value = resumeData.phone || '';
    document.getElementById('address').value = resumeData.address || '';
    document.getElementById('linkedin').value = resumeData.linkedin || '';
    document.getElementById('github').value = resumeData.github || '';
    document.getElementById('portfolio').value = resumeData.portfolio || '';
    document.getElementById('summary').value = resumeData.summary || '';
    document.getElementById('certifications').value = resumeData.certifications || '';
    document.getElementById('achievements').value = resumeData.achievements || '';
    document.getElementById('languages').value = resumeData.languages || '';
    document.getElementById('interests').value = resumeData.interests || '';
    document.getElementById('customTitle').value = resumeData.customTitle || '';
    document.getElementById('customContent').value = resumeData.customContent || '';
    renderEntries('educationList', resumeData.education, 'education');
    renderEntries('experienceList', resumeData.experience, 'experience');
    renderEntries('projectList', resumeData.projects, 'project');
    renderSkillTags();
}

// ===== Render entry lists =====
function renderEntries(containerId, entries, type) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = entries.map((entry, idx) => `
        <div class="entry-item" data-index="${idx}" data-type="${type}">
            <button class="entry-remove" data-type="${type}" data-index="${idx}"><i class="fas fa-times"></i></button>
            ${Object.keys(entry).map(key => `
                <div class="form-group">
                    <label>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                    <input type="text" value="${entry[key] || ''}" data-field="${key}" data-type="${type}" data-index="${idx}" class="entry-field" />
                </div>
            `).join('')}
        </div>
    `).join('');

    // Attach events to entry fields
    container.querySelectorAll('.entry-field').forEach(inp => {
        inp.addEventListener('input', (e) => {
            const idx = parseInt(inp.dataset.index);
            const field = inp.dataset.field;
            const type = inp.dataset.type;
            if (type === 'education') resumeData.education[idx][field] = inp.value;
            else if (type === 'experience') resumeData.experience[idx][field] = inp.value;
            else if (type === 'project') resumeData.projects[idx][field] = inp.value;
            saveData();
            renderPreview();
        });
    });

    container.querySelectorAll('.entry-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(btn.dataset.index);
            const type = btn.dataset.type;
            if (type === 'education') resumeData.education.splice(idx, 1);
            else if (type === 'experience') resumeData.experience.splice(idx, 1);
            else if (type === 'project') resumeData.projects.splice(idx, 1);
            saveData();
            populateForm();
            renderPreview();
        });
    });
}

// ===== Render skill tags =====
function renderSkillTags() {
    const container = document.getElementById('skillTags');
    if (!container) return;
    container.innerHTML = resumeData.skills.map(skill => `
        <span class="skill-tag">${skill} <span class="remove-skill" data-skill="${skill}"><i class="fas fa-times-circle"></i></span></span>
    `).join('');
    container.querySelectorAll('.remove-skill').forEach(el => {
        el.addEventListener('click', () => {
            const skill = el.dataset.skill;
            resumeData.skills = resumeData.skills.filter(s => s !== skill);
            saveData();
            renderSkillTags();
            renderPreview();
        });
    });
}

// ===== Add entry =====
document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        if (section === 'education') {
            resumeData.education.push({ degree: '', institution: '', location: '', startDate: '', endDate: '', percentage: '', description: '' });
        } else if (section === 'experience') {
            resumeData.experience.push({ jobTitle: '', company: '', location: '', startDate: '', endDate: '', responsibilities: '' });
        } else if (section === 'project') {
            resumeData.projects.push({ title: '', technologies: '', link: '', description: '' });
        }
        saveData();
        populateForm();
        renderPreview();
    });
});

// ===== Skill input =====
document.getElementById('skillInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const val = e.target.value.trim();
        if (val && !resumeData.skills.includes(val)) {
            resumeData.skills.push(val);
            saveData();
            e.target.value = '';
            renderSkillTags();
            renderPreview();
        }
    }
});

// ===== Photo upload =====
document.getElementById('photoUpload')?.addEventListener('change', (e) => {
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

// ===== Real-time form inputs =====
form.querySelectorAll('input, textarea').forEach(el => {
    if (el.id && !el.classList.contains('entry-field') && el.id !== 'skillInput' && el.id !== 'photoUpload') {
        el.addEventListener('input', () => {
            const key = el.id;
            if (key in resumeData) {
                resumeData[key] = el.value;
                saveData();
                renderPreview();
            }
        });
    }
});

// ===== Theme toggle =====
let darkMode = false;
document.getElementById('themeToggle')?.addEventListener('click', () => {
    darkMode = !darkMode;
    preview.classList.toggle('dark', darkMode);
    document.getElementById('themeToggle').innerHTML = darkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// ===== Font & size =====
document.getElementById('fontSelector')?.addEventListener('change', (e) => {
    preview.style.fontFamily = e.target.value;
});
document.getElementById('fontSizeSelector')?.addEventListener('change', (e) => {
    preview.style.fontSize = e.target.value;
});

// ===== Clear / Reset =====
document.getElementById('clearFormBtn')?.addEventListener('click', () => {
    if (confirm('Clear all form fields?')) {
        form.querySelectorAll('input, textarea').forEach(el => {
            if (el.id && !el.classList.contains('entry-field') && el.id !== 'photoUpload' && el.id !== 'skillInput') {
                el.value = '';
                if (el.id in resumeData) resumeData[el.id] = '';
            }
        });
        resumeData.education = [];
        resumeData.experience = [];
        resumeData.projects = [];
        resumeData.skills = [];
        resumeData.photo = null;
        document.getElementById('photoPreview').innerHTML = '<i class="fas fa-user"></i>';
        saveData();
        populateForm();
        renderPreview();
    }
});

document.getElementById('resetResumeBtn')?.addEventListener('click', () => {
    if (confirm('Reset everything? This will clear all data.')) {
        localStorage.removeItem('resumeBuilderData');
        location.reload();
    }
});

// ===== RENDER PREVIEW =====
function renderPreview() {
    const d = resumeData;
    const photoHtml = d.photo ? `<img src="${d.photo}" alt="Profile" class="preview-avatar" />` : `<div class="preview-avatar" style="display:flex;align-items:center;justify-content:center;background:#e2e8f0;color:#94a3b8;font-size:2.5rem;"><i class="fas fa-user"></i></div>`;
    const contactHtml = [d.email, d.phone, d.address, d.linkedin, d.github, d.portfolio].filter(Boolean).join(' | ');

    const eduHtml = d.education.map(e => `
        <div class="preview-entry">
            <strong>${e.degree || ''}</strong> <span class="preview-meta">${e.institution || ''} ${e.location || ''}</span>
            <div class="preview-meta">${e.startDate || ''} — ${e.endDate || ''} ${e.percentage ? '| '+e.percentage : ''}</div>
            ${e.description ? `<div>${e.description}</div>` : ''}
        </div>
    `).join('');

    const expHtml = d.experience.map(e => `
        <div class="preview-entry">
            <strong>${e.jobTitle || ''}</strong> <span class="preview-meta">${e.company || ''} ${e.location || ''}</span>
            <div class="preview-meta">${e.startDate || ''} — ${e.endDate || ''}</div>
            ${e.responsibilities ? `<div>${e.responsibilities}</div>` : ''}
        </div>
    `).join('');

    const projHtml = d.projects.map(p => `
        <div class="preview-entry">
            <strong>${p.title || ''}</strong> ${p.technologies ? `<span class="preview-meta">${p.technologies}</span>` : ''}
            ${p.link ? `<div><a href="${p.link}" target="_blank">${p.link}</a></div>` : ''}
            ${p.description ? `<div>${p.description}</div>` : ''}
        </div>
    `).join('');

    const skillsHtml = d.skills.length ? `<div class="preview-skills">${d.skills.map(s => `<span>${s}</span>`).join('')}</div>` : '';

    const customHtml = d.customTitle && d.customContent ? `
        <div class="preview-section">
            <h4>${d.customTitle}</h4>
            <div>${d.customContent}</div>
        </div>
    ` : '';

    preview.innerHTML = `
        <div class="resume-preview">
            <div class="preview-header">
                ${photoHtml}
                <div class="preview-name">${d.fullName || 'Your Name'}</div>
                <div class="preview-title">${d.profTitle || 'Professional Title'}</div>
                <div class="preview-contact">${contactHtml || 'contact@example.com'}</div>
            </div>

            ${d.summary ? `<div class="preview-section"><h4>Summary</h4><p>${d.summary}</p></div>` : ''}

            ${d.education.length ? `<div class="preview-section"><h4>Education</h4>${eduHtml}</div>` : ''}
            ${d.experience.length ? `<div class="preview-section"><h4>Work Experience</h4>${expHtml}</div>` : ''}
            ${d.skills.length ? `<div class="preview-section"><h4>Skills</h4>${skillsHtml}</div>` : ''}
            ${d.projects.length ? `<div class="preview-section"><h4>Projects</h4>${projHtml}</div>` : ''}
            ${d.certifications ? `<div class="preview-section"><h4>Certifications</h4><div>${d.certifications}</div></div>` : ''}
            ${d.achievements ? `<div class="preview-section"><h4>Achievements</h4><div>${d.achievements}</div></div>` : ''}
            ${d.languages ? `<div class="preview-section"><h4>Languages</h4><div>${d.languages}</div></div>` : ''}
            ${d.interests ? `<div class="preview-section"><h4>Interests</h4><div>${d.interests}</div></div>` : ''}
            ${customHtml}
        </div>
    `;
}

// ===== Init =====
loadData();
renderPreview();// ================================================================
// NEW: PDF Export using html2canvas + jsPDF
// ================================================================
document.getElementById('downloadPdfBtn')?.addEventListener('click', function() {
    const previewEl = document.getElementById('resumePreview');
    const originalOverflow = document.body.style.overflow;
    const originalHeight = previewEl.style.height;

    // Temporarily expand preview to capture full content
    previewEl.style.height = 'auto';
    document.body.style.overflow = 'hidden';

    // Use html2canvas with high quality
    html2canvas(previewEl, {
        scale: 2,                     // high resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        allowTaint: true,
        width: previewEl.scrollWidth,
        height: previewEl.scrollHeight,
        windowWidth: previewEl.scrollWidth,
        windowHeight: previewEl.scrollHeight
    }).then(canvas => {
        // Restore styles
        previewEl.style.height = originalHeight;
        document.body.style.overflow = originalOverflow;

        const imgData = canvas.toDataURL('image/png');
        const pdf = new window.jspdf.jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        // A4 dimensions: 210mm x 297mm
        const pdfWidth = 210;
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        // Add image with proper margins (10mm each side)
        const margin = 10;
        const imgWidth = pdfWidth - 2 * margin;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // If content is taller than one page, we need multiple pages
        const pageHeight = 297 - 2 * margin;
        let heightLeft = imgHeight;
        let position = margin;

        // First page
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Additional pages if needed
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
