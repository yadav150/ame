function renderTemplate1(data) {
    const p = data.personal;
    return `
    <div style="font-family: 'Georgia', serif; max-width: 800px; margin:0 auto; padding:40px; border:1px solid #ccc;">
        <div style="text-align:center; border-bottom:2px solid #4f46e5; padding-bottom:20px;">
            <h1 style="margin:0; color:#4f46e5;">${p.fullName || 'Your Name'}</h1>
            <p style="margin:5px 0;">${p.email} | ${p.mobile} | ${p.address || ''}</p>
        </div>
        <div style="margin-top:20px;">
            <h3 style="color:#4f46e5; border-bottom:1px solid #eee;">Personal Details</h3>
            <p><strong>Father:</strong> ${p.fatherName || 'N/A'} | <strong>Mother:</strong> ${p.motherName || 'N/A'}</p>
            <p><strong>DOB:</strong> ${p.dob || 'N/A'} | <strong>Gender:</strong> ${p.gender || 'N/A'} | <strong>Languages:</strong> ${p.languages || 'N/A'}</p>
        </div>
        <div style="margin-top:20px;">
            <h3 style="color:#4f46e5; border-bottom:1px solid #eee;">Education</h3>
            ${data.education.map(e => `<p><strong>${e.exam}</strong> - ${e.board} (${e.year}) - ${e.percent} - ${e.division}</p>`).join('')}
        </div>
        <div style="margin-top:20px;">
            <h3 style="color:#4f46e5; border-bottom:1px solid #eee;">Other Qualifications</h3>
            ${data.qualifications.map(q => `<p><strong>${q.name}</strong> - ${q.institute} (${q.year}) - ${q.grade} - ${q.duration}</p>`).join('')}
        </div>
        ${data.declaration ? '<p style="margin-top:30px; font-style:italic;">I hereby declare that all information is true.</p>' : ''}
    </div>`;
}
