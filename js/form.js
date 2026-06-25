function buildModernResume(data) {
    const sidebarBg = '#f8f9fa';
    const mainBg = '#ffffff';
    const darkBar = '#2c3e50';
    const accent = '#2c3e50';
    const textDark = '#2c3e50';
    const textLight = '#555';
    const timelineColor = '#bdc3c7';

    // Build education timeline items
    let eduTimeline = '';
    data.education.forEach(e => {
        eduTimeline += `
            <div class="tl-item">
                <div class="tl-marker"></div>
                <div class="tl-content">
                    <span class="tl-year">${e.year || 'N/A'}</span>
                    <h4>${e.exam || ''}</h4>
                    <p>${e.board || ''} — ${e.percent || ''}%, ${e.division || ''}</p>
                </div>
            </div>`;
    });

    let qualTimeline = '';
    data.otherQual.forEach(q => {
        qualTimeline += `
            <div class="tl-item">
                <div class="tl-marker"></div>
                <div class="tl-content">
                    <span class="tl-year">${q.year || 'N/A'}</span>
                    <h4>${q.qual || ''}</h4>
                    <p>${q.inst || ''} — ${q.score || ''}, ${q.duration || ''}</p>
                </div>
            </div>`;
    });

    // Skills tags
    let skillsTags = data.skills ? data.skills.split(',').map(s => `<span class="skill-tag">${s.trim()}</span>`).join('') : '<span class="skill-tag">N/A</span>';

    // Language tags
    let langTags = data.languages ? data.languages.split(',').map(l => `<span class="skill-tag">${l.trim()}</span>`).join('') : '<span class="skill-tag">N/A</span>';

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: white;
            color: ${textDark};
            margin: 0;
            padding: 0;
        }
        .resume-page {
            width: 780px;
            margin: 0 auto;
            display: flex;
            border: 1px solid #ddd;
            background: white;
            page-break-after: always;
        }
        .resume-page:last-child { page-break-after: auto; }

        .sidebar {
            width: 40%;
            background: ${sidebarBg};
            padding: 25px 18px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .profile-photo {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid ${darkBar};
            margin-bottom: 15px;
        }
        .sidebar h2 {
            font-size: 1.8rem;
            color: ${darkBar};
            margin-bottom: 5px;
            font-family: 'Georgia', serif;
        }
        .sidebar .job-title {
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: ${textLight};
            margin-bottom: 20px;
        }
        .contact-info {
            text-align: left;
            margin-bottom: 25px;
            font-size: 0.85rem;
        }
        .contact-row {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }
        .contact-icon {
            width: 20px;
            margin-right: 8px;
            font-weight: bold;
            color: ${accent};
        }

        .sidebar-section {
            width: 100%;
            margin-bottom: 20px;
        }
        .sidebar-bar {
            background: ${darkBar};
            color: white;
            padding: 6px 12px;
            font-size: 0.9rem;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-radius: 3px;
            margin-bottom: 10px;
        }
        .skill-tag {
            display: inline-block;
            background: white;
            border: 1px solid #ccc;
            padding: 3px 10px;
            margin: 4px;
            border-radius: 20px;
            font-size: 0.8rem;
            color: ${textDark};
        }

        .main {
            width: 60%;
            background: ${mainBg};
            padding: 25px 25px;
        }
        .main-bar {
            background: ${darkBar};
            color: white;
            padding: 7px 14px;
            font-size: 0.95rem;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-radius: 3px;
            margin-bottom: 15px;
        }

        .timeline {
            position: relative;
            padding-left: 30px;
            margin-bottom: 15px;
        }
        .timeline::before {
            content: '';
            position: absolute;
            left: 14px;
            top: 5px;
            bottom: 0;
            width: 2px;
            background: ${timelineColor};
        }
        .tl-item {
            position: relative;
            margin-bottom: 18px;
        }
        .tl-marker {
            position: absolute;
            left: -30px;
            top: 4px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: ${darkBar};
            border: 2px solid white;
            box-shadow: 0 0 0 2px ${darkBar};
        }
        .tl-year {
            font-size: 0.75rem;
            color: ${textLight};
            font-weight: bold;
        }
        .tl-content h4 {
            font-size: 0.95rem;
            margin: 3px 0 2px;
            color: ${textDark};
        }
        .tl-content p {
            font-size: 0.8rem;
            color: ${textLight};
            line-height: 1.4;
        }

        .declaration {
            margin-top: 20px;
            font-size: 0.85rem;
            color: ${textLight};
        }
        .signature {
            margin-top: 20px;
            text-align: right;
            font-size: 0.85rem;
        }
    </style>
</head>
<body>
    <div class="resume-page">
        <div class="sidebar">
            ${data.photo ? `<img src="${data.photo}" class="profile-photo" alt="photo"/>` : '<div class="profile-photo" style="background:#ccc;"></div>'}
            <h2>${data.name || 'Full Name'}</h2>
            <div class="job-title">${data.experience || 'Professional Title'}</div>

            <div class="contact-info">
                <div class="contact-row"><span class="contact-icon">📞</span> ${data.mobile || ''}</div>
                <div class="contact-row"><span class="contact-icon">✉️</span> ${data.email || ''}</div>
                <div class="contact-row"><span class="contact-icon">📍</span> ${data.address || ''}</div>
            </div>

            <div class="sidebar-section">
                <div class="sidebar-bar">Skills</div>
                <div>${skillsTags}</div>
            </div>

            <div class="sidebar-section">
                <div class="sidebar-bar">Languages</div>
                <div>${langTags}</div>
            </div>

            <div class="sidebar-section">
                <div class="sidebar-bar">Personal Info</div>
                <p style="font-size:0.8rem;">DOB: ${data.dob || ''}</p>
                <p style="font-size:0.8rem;">Gender: ${data.gender || ''}</p>
                <p style="font-size:0.8rem;">Category: ${data.category || ''}</p>
                <p style="font-size:0.8rem;">Marital: ${data.marital || ''}</p>
            </div>
        </div>

        <div class="main">
            ${data.education.length > 0 ? `
            <div>
                <div class="main-bar">Education</div>
                <div class="timeline">${eduTimeline}</div>
            </div>` : ''}

            ${data.otherQual.length > 0 ? `
            <div>
                <div class="main-bar">Other Qualifications</div>
                <div class="timeline">${qualTimeline}</div>
            </div>` : ''}

            <div class="declaration">
                <p>I declare that the above information is true and correct.</p>
            </div>
            <div class="signature">
                <p>Place: ${data.place || ''}</p>
                <p>Date: ${data.date || ''}</p>
                <p>${data.name || ''}</p>
            </div>
        </div>
    </div>
</body>
</html>`;
}
