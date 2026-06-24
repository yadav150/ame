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

let visibilityState = {
    education: true,
    experience: true,
    project: true,
    certifications: true,
    achievements: true,
    languages: true,
    interests: true,
    custom: true
};

let darkMode = false;
let currentTemplate = 'modern';
let accentColor = '#4f46e5'; // NEW

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

    // NEW: load accent color
    const savedAccent = localStorage.getItem('resumeBuilderAccent');
    if (savedAccent) {
        accentColor = savedAccent;
        document.getElementById('accentColorPicker').value = accentColor;
    }

    populateForm();
    renderPreview();
}

// ===== Save to localStorage =====
function saveData() {
    localStorage.setItem('resumeBuilderData', JSON.stringify(resumeData));
}

// ===== Populate form =====
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

// ===== Helper: reorder array =====
function reorderArray(arr, fromIndex, toIndex) {
    const [removed] = arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, removed);
    return arr;
}

// ===== Render entry lists with drag & drop =====
function renderEntries(containerId, entries, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = entries.map((entry, idx) => `
        <div class="entry-item" draggable="true" data-type="${type}" data-index="${idx}">
            <div class="entry-drag-handle"><i class="fas fa-grip-vertical"></i></div>
            <button class="entry-remove" data-type="${type}" data-index="${idx}"><i class="fas fa-times"></i></button>
            ${Object.keys(entry).map(key => `
                <div class="form-group">
                    <label>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                    <input type="text" value="${entry[key] || ''}" data-field="${key}" data-type="${type}" data-index="${idx}" class="entry-field" />
                </div>
            `).join('')}
        </div>
    `).join('');

    const items = container.querySelectorAll('.entry-item');
    items.forEach(item => {
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', JSON.stringify({
                type: item.dataset.type,
                index: parseInt(item.dataset.index)
            }));
            item.classList.add('dragging');
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
            container.querySelectorAll('.entry-item').forEach(el => el.classList.remove('drag-over'));
        });

        item.addEventListener('dragover', (e) => {
            e.preventDefault();
            container.querySelectorAll('.entry-item').forEach(el => el.classList.remove('drag-over'));
            item.classList.add('drag-over');
        });

        item.addEventListener('dragleave', () => {
            item.classList.remove('drag-over');
        });

        item.addEventListener('drop', (e) => {
            e.preventDefault();
            item.classList.remove('drag-over');
            const sourceData = JSON.parse(e.dataTransfer.getData('text/plain'));
            const sourceType = sourceData.type;
            const sourceIndex = sourceData.index;
            const targetType = item.dataset.type;
            const targetIndex = parseInt(item.dataset.index);

            if (sourceType === targetType && sourceIndex !== targetIndex) {
                let arr;
                if (sourceType === 'education') arr = resumeData.education;
                else if (sourceType === 'experience') arr = resumeData.experience;
                else if (sourceType === 'project') arr = resumeData.projects;
                else return;

                reorderArray(arr, sourceIndex, targetIndex);
                saveData();
                populateForm();
                renderPreview();
            }
        });
    });

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
document.getElementById('themeToggle')?.addEventListener('click', () => {
    darkMode = !darkMode;
    document.getElementById('themeToggle').innerHTML = darkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    renderPreview();
});

// ===== Template Switcher =====
document.getElementById('templateSelector')?.addEventListener('change', function(e) {
    currentTemplate = e.target.value;
    localStorage.setItem('resumeBuilderTemplate', currentTemplate);
    renderPreview();
});

// ===== Accent Color Picker (NEW) =====
document.getElementById('accentColorPicker')?.addEventListener('input', function(e) {
    accentColor = e.target.value;
    localStorage.setItem('resumeBuilderAccent', accentColor);
    applyAccentColor(accentColor);
});

function applyAccentColor(color) {
    preview.style.setProperty('--preview-primary', color);
}

// ===== Font & size =====
document.getElementById('fontSelector')?.addEventListener('change', (e) => {
    preview.style.fontFamily = e.target.value;
});
document.getElementById('fontSizeSelector')?.addEventListener('change', (e) => {
    preview.style.fontSize = e.target.value;
});

// ===== Section Visibility Toggles =====
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
        localStorage.removeItem('resumeBuilderTemplate');
        localStorage.removeItem('resumeBuilderVisibility');
        localStorage.removeItem('resumeBuilderAccent');
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

    let html = `
        <div class="resume-preview">
            <div class="preview-header">
                ${photoHtml}
                <div class="preview-name">${d.fullName || 'Your Name'}</div>
                <div class="preview-title">${d.profTitle || 'Professional Title'}</div>
                <div class="preview-contact">${contactHtml || 'contact@example.com'}</div>
            </div>
            ${d.summary ? `<div class="preview-section"><h4>Summary</h4><p>${d.summary}</p></div>` : ''}
    `;

    if (visibilityState.education && d.education.length) {
        html += `<div class="preview-section"><h4>Education</h4>${eduHtml}</div>`;
    }
    if (visibilityState.experience && d.experience.length) {
        html += `<div class="preview-section"><h4>Work Experience</h4>${expHtml}</div>`;
    }
    if (d.skills.length) {
        html += `<div class="preview-section"><h4>Skills</h4>${skillsHtml}</div>`;
    }
    if (visibilityState.project && d.projects.length) {
        html += `<div class="preview-section"><h4>Projects</h4>${projHtml}</div>`;
    }
    if (visibilityState.certifications && d.certifications) {
        html += `<div class="preview-section"><h4>Certifications</h4><div>${d.certifications}</div></div>`;
    }
    if (visibilityState.achievements && d.achievements) {
        html += `<div class="preview-section"><h4>Achievements</h4><div>${d.achievements}</div></div>`;
    }
    if (visibilityState.languages && d.languages) {
        html += `<div class="preview-section"><h4>Languages</h4><div>${d.languages}</div></div>`;
    }
    if (visibilityState.interests && d.interests) {
        html += `<div class="preview-section"><h4>Interests</h4><div>${d.interests}</div></div>`;
    }
    if (visibilityState.custom && d.customTitle && d.customContent) {
        html += `<div class="preview-section"><h4>${d.customTitle}</h4><div>${d.customContent}</div></div>`;
    }

    html += `</div>`;
    preview.innerHTML = html;

    // Apply template class, dark mode, and accent color
    preview.className = 'builder__preview-content';
    preview.classList.add('template-' + currentTemplate);
    if (darkMode) preview.classList.add('dark');
    applyAccentColor(accentColor);
}

// ===== PDF Export =====
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
        const margin = 10;
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

// ===== Init =====
loadData();
renderPreview();
