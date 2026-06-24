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
let accentColor = '#4f46e5';
let currentLayout = 'single';

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

// ===== Accent Color Picker =====
document.getElementById('accentColorPicker')?.addEventListener('input', function(e) {
    accentColor = e.target.value;
    localStorage.setItem('resumeBuilderAccent', accentColor);
    applyAccentColor(accentColor);
});

function applyAccentColor(color) {
    preview.style.setProperty('--preview-primary', color);
}

// ===== Layout Toggle =====
document.getElementById('layoutToggle')?.addEventListener('click', function() {
    currentLayout = (currentLayout === 'single') ? 'two-column' : 'single';
    localStorage.setItem('resumeBuilderLayout', currentLayout);
    const label = this.querySelector('span');
    if (label) {
        label.textContent = currentLayout === 'two-column' ? 'Single Column' : 'Two Column';
    }
    renderPreview();
});

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
        localStorage.removeItem('resumeBuilderLayout');
        location.reload();
    }
});

// ===== Load Sample Data =====
document.getElementById('loadSampleBtn')?.addEventListener('click', function() {
    if (!confirm('Load sample resume data? This will overwrite your current data.')) return;

    resumeData = {
        fullName: 'John Doe',
        profTitle: 'Senior Software Engineer',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        address: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/johndoe',
        github: 'github.com/johndoe',
        portfolio: 'johndoe.dev',
        summary: 'Passionate Senior Software Engineer with 8+ years of experience building scalable web applications. Expert in React, Node.js, and cloud architecture. Proven track record of leading teams and delivering high-impact products.',
        education: [
            { degree: 'M.S. Computer Science', institution: 'Stanford University', location: 'Stanford, CA', startDate: '2014', endDate: '2016', percentage: '3.9 GPA', description: 'Focus on distributed systems and machine learning.' },
            { degree: 'B.S. Computer Science', institution: 'UC Berkeley', location: 'Berkeley, CA', startDate: '2010', endDate: '2014', percentage: '3.8 GPA', description: 'Dean\'s List all semesters.' }
        ],
        experience: [
            { jobTitle: 'Senior Software Engineer', company: 'TechCorp Inc.', location: 'San Francisco, CA', startDate: '2020', endDate: 'Present', responsibilities: 'Led a team of 8 engineers building a microservices platform serving 5M+ users. Reduced latency by 40%.' },
            { jobTitle: 'Software Engineer', company: 'StartUp Labs', location: 'San Jose, CA', startDate: '2016', endDate: '2020', responsibilities: 'Built full-stack applications using React, Node.js, and PostgreSQL. Implemented CI/CD pipeline.' }
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'TypeScript', 'AWS', 'Docker', 'PostgreSQL', 'Git', 'REST APIs'],
        projects: [
            { title: 'E-Commerce Platform', technologies: 'React, Node.js, MongoDB', link: 'https://github.com/johndoe/ecommerce', description: 'Full-stack e-commerce platform with payment integration and real-time inventory tracking.' },
            { title: 'Task Management App', technologies: 'Vue.js, Firebase', link: 'https://github.com/johndoe/taskapp', description: 'Collaborative task management tool with team workspaces and notifications.' }
        ],
        certifications: 'AWS Certified Solutions Architect, Google Cloud Professional Developer, Scrum Master Certified',
        achievements: 'Employee of the Year 2022, Published 5 technical articles, Open-source contributor to React ecosystem',
        languages: 'English (Native), Spanish (Fluent), French (Conversational)',
        interests: 'Photography, Hiking, Open-source projects, Technology blogging',
        customTitle: 'Volunteer Work',
        customContent: 'Mentored junior developers at Code for Good (2021-2023). Organized local tech meetups with 200+ attendees.',
        photo: null
    };

    // Reset visibility to default (all visible)
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

// ===== RENDER PREVIEW (UPDATED with Professional Tables) =====
function renderPreview() {
    const d = resumeData;
    const photoHtml = d.photo ? `<img src="${d.photo}" alt="Profile" class="preview-avatar" />` : `<div class="preview-avatar" style="display:flex;align-items:center;justify-content:center;background:#e2e8f0;color:#94a3b8;font-size:2.5rem;"><i class="fas fa-user"></i></div>`;

    // Build contact items with icons
    const contactItems = [];
    if (d.email) contactItems.push(`<a href="mailto:${d.email}" title="Email"><i class="fas fa-envelope"></i> ${d.email}</a>`);
    if (d.phone) contactItems.push(`<a href="tel:${d.phone}" title="Phone"><i class="fas fa-phone"></i> ${d.phone}</a>`);
    if (d.address) contactItems.push(`<span title="Address"><i class="fas fa-map-marker-alt"></i> ${d.address}</span>`);
    if (d.linkedin) {
        const linkedinUrl = d.linkedin.startsWith('http') ? d.linkedin : `https://${d.linkedin}`;
        contactItems.push(`<a href="${linkedinUrl}" target="_blank" title="LinkedIn"><i class="fab fa-linkedin-in"></i> LinkedIn</a>`);
    }
    if (d.github) {
        const githubUrl = d.github.startsWith('http') ? d.github : `https://${d.github}`;
        contactItems.push(`<a href="${githubUrl}" target="_blank" title="GitHub"><i class="fab fa-github"></i> GitHub</a>`);
    }
    if (d.portfolio) {
        const portfolioUrl = d.portfolio.startsWith('http') ? d.portfolio : `https://${d.portfolio}`;
        contactItems.push(`<a href="${portfolioUrl}" target="_blank" title="Portfolio"><i class="fas fa-external-link-alt"></i> Portfolio</a>`);
    }
    const contactHtml = contactItems.join(' <span class="contact-separator">|</span> ');

    // ===== EDUCATION TABLE =====
    let eduHtml = '';
    if (d.education.length) {
        eduHtml = `
            <table class="preview-table">
                <thead>
                    <tr>
                        <th>Degree</th>
                        <th>Institution</th>
                        <th>Location</th>
                        <th>Duration</th>
                        <th>GPA / %</th>
                    </tr>
                </thead>
                <tbody>
                    ${d.education.map(e => `
                        <tr>
                            <td><strong>${e.degree || ''}</strong></td>
                            <td>${e.institution || ''}</td>
                            <td>${e.location || ''}</td>
                            <td>${e.startDate || ''} — ${e.endDate || ''}</td>
                            <td>${e.percentage || ''}</td>
                        </tr>
                        ${e.description ? `<tr><td colspan="5" style="font-size:0.85rem;color:var(--text-light);padding-top:0;">${e.description}</td></tr>` : ''}
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // ===== EXPERIENCE TABLE =====
    let expHtml = '';
    if (d.experience.length) {
        expHtml = `
            <table class="preview-table">
                <thead>
                    <tr>
                        <th>Job Title</th>
                        <th>Company</th>
                        <th>Location</th>
                        <th>Duration</th>
                        <th>Responsibilities</th>
                    </tr>
                </thead>
                <tbody>
                    ${d.experience.map(e => `
                        <tr>
                            <td><strong>${e.jobTitle || ''}</strong></td>
                            <td>${e.company || ''}</td>
                            <td>${e.location || ''}</td>
                            <td>${e.startDate || ''} — ${e.endDate || ''}</td>
                            <td>${e.responsibilities || ''}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // ===== PROJECTS TABLE =====
    let projHtml = '';
    if (d.projects.length) {
        projHtml = `
            <table class="preview-table">
                <thead>
                    <tr>
                        <th>Project Title</th>
                        <th>Technologies</th>
                        <th>Link</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    ${d.projects.map(p => `
                        <tr>
                            <td><strong>${p.title || ''}</strong></td>
                            <td>${p.technologies || ''}</td>
                            <td>${p.link ? `<a href="${p.link}" target="_blank" style="color:var(--preview-primary);">🔗</a>` : ''}</td>
                            <td>${p.description || ''}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    // ===== CERTIFICATIONS TABLE =====
    let certHtml = '';
    if (d.certifications) {
        const certs = d.certifications.split(',').map(c => c.trim()).filter(Boolean);
        certHtml = `
            <table class="preview-table">
                <thead>
                    <tr><th>Certifications</th></tr>
                </thead>
                <tbody>
                    ${certs.map(c => `<tr><td>${c}</td></tr>`).join('')}
                </tbody>
            </table>
        `;
    }

    // ===== LANGUAGES TABLE =====
    let langHtml = '';
    if (d.languages) {
        const langs = d.languages.split(',').map(l => l.trim()).filter(Boolean);
        langHtml = `
            <table class="preview-table">
                <thead>
                    <tr><th>Language</th><th>Proficiency</th></tr>
                </thead>
                <tbody>
                    ${langs.map(l => {
                        const parts = l.split('(');
                        const lang = parts[0].trim();
                        const level = parts[1] ? parts[1].replace(')', '').trim() : '';
                        return `<tr><td>${lang}</td><td>${level}</td></tr>`;
                    }).join('')}
                </tbody>
            </table>
        `;
    }

    // ===== ACHIEVEMENTS TABLE =====
    let achHtml = '';
    if (d.achievements) {
        const achievements = d.achievements.split(',').map(a => a.trim()).filter(Boolean);
        achHtml = `
            <table class="preview-table">
                <thead>
                    <tr><th>Achievements</th></tr>
                </thead>
                <tbody>
                    ${achievements.map(a => `<tr><td>${a}</td></tr>`).join('')}
                </tbody>
            </table>
        `;
    }

    // ===== INTERESTS TABLE =====
    let intHtml = '';
    if (d.interests) {
        const interests = d.interests.split(',').map(i => i.trim()).filter(Boolean);
        intHtml = `
            <table class="preview-table">
                <thead>
                    <tr><th>Interests / Hobbies</th></tr>
                </thead>
                <tbody>
                    ${interests.map(i => `<tr><td>${i}</td></tr>`).join('')}
                </tbody>
            </table>
        `;
    }

    // ===== SKILLS (keep as tags) =====
    const skillsHtml = d.skills.length ? `<div class="preview-skills">${d.skills.map(s => `<span>${s}</span>`).join('')}</div>` : '';

    // Build main content sections (shared between layouts)
    let mainSections = '';
    if (visibilityState.education && d.education.length) {
        mainSections += `<div class="preview-section"><h4>Education</h4>${eduHtml}</div>`;
    }
    if (visibilityState.experience && d.experience.length) {
        mainSections += `<div class="preview-section"><h4>Work Experience</h4>${expHtml}</div>`;
    }
    if (visibilityState.project && d.projects.length) {
        mainSections += `<div class="preview-section"><h4>Projects</h4>${projHtml}</div>`;
    }
    if (visibilityState.certifications && d.certifications) {
        mainSections += `<div class="preview-section"><h4>Certifications</h4>${certHtml}</div>`;
    }
    if (visibilityState.achievements && d.achievements) {
        mainSections += `<div class="preview-section"><h4>Achievements</h4>${achHtml}</div>`;
    }
    if (visibilityState.languages && d.languages) {
        mainSections += `<div class="preview-section"><h4>Languages</h4>${langHtml}</div>`;
    }
    if (visibilityState.interests && d.interests) {
        mainSections += `<div class="preview-section"><h4>Interests</h4>${intHtml}</div>`;
    }
    if (visibilityState.custom && d.customTitle && d.customContent) {
        mainSections += `<div class="preview-section"><h4>${d.customTitle}</h4><div>${d.customContent}</div></div>`;
    }

    // Sidebar content for two-column
    const sidebarContent = `
        <div class="preview-header">
            ${photoHtml}
            <div class="preview-name">${d.fullName || 'Your Name'}</div>
            <div class="preview-title">${d.profTitle || 'Professional Title'}</div>
            <div class="preview-contact">${contactHtml || '<span><i class="fas fa-envelope"></i> contact@example.com</span>'}</div>
        </div>
        ${d.skills.length ? `<div class="preview-section"><h4>Skills</h4>${skillsHtml}</div>` : ''}
        ${d.summary ? `<div class="preview-section"><h4>Summary</h4><p>${d.summary}</p></div>` : ''}
    `;

    let html = '';
    if (currentLayout === 'two-column') {
        html = `
            <div class="resume-preview">
                <div class="preview-sidebar">${sidebarContent}</div>
                <div class="preview-main">${mainSections}</div>
            </div>
        `;
    } else {
        html = `
            <div class="resume-preview">
                <div class="preview-header">
                    ${photoHtml}
                    <div class="preview-name">${d.fullName || 'Your Name'}</div>
                    <div class="preview-title">${d.profTitle || 'Professional Title'}</div>
                    <div class="preview-contact">${contactHtml || '<span><i class="fas fa-envelope"></i> contact@example.com</span>'}</div>
                </div>
                ${d.summary ? `<div class="preview-section"><h4>Summary</h4><p>${d.summary}</p></div>` : ''}
                ${d.skills.length ? `<div class="preview-section"><h4>Skills</h4>${skillsHtml}</div>` : ''}
                ${mainSections}
            </div>
        `;
    }

    preview.innerHTML = html;

    // Apply template class, dark mode, accent color, and layout
    preview.className = 'builder__preview-content';
    preview.classList.add('template-' + currentTemplate);
    if (darkMode) preview.classList.add('dark');
    if (currentLayout === 'two-column') preview.classList.add('layout-two-column');
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
