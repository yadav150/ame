function renderTemplate3(data) {
    const p = data.personal;
    return `
    <div style="font-family: 'Inter', sans-serif; max-width:800px; margin:0 auto; padding:40px; background:#fff;">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:3px solid #000; padding-bottom:20px;">
            <div>
                <h1 style="margin:0; font-weight:800;">${p.fullName}</h1>
                <p style="color:#555;">${p.experience || 'Fresher'}</p>
            </div>
            <div style="text-align:right;">
                <p>${p.email}<br>${p.mobile}<br>${p.address}</p>
            </div>
        </div>
        <div style="margin-top:30px;">
            <h3 style="letter-spacing:2px; text-transform:uppercase; font-size:14px;">Education</h3>
            <hr>
            ${data.education.map(e => `<p><strong>${e.exam}</strong> | ${e.board} | ${e.year} | ${e.percent}</p>`).join('')}
        </div>
        <div style="margin-top:20px;">
            <h3 style="letter-spacing:2px; text-transform:uppercase; font-size:14px;">Other Qualifications</h3>
            <hr>
            ${data.qualifications.map(q => `<p>${q.name} - ${q.institute} (${q.year})</p>`).join('')}
        </div>
        ${data.declaration ? '<p style="margin-top:40px; font-size:12px; color:#777;">I declare that all information furnished above is true.</p>' : ''}
    </div>`;
}
