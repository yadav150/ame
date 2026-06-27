function renderTemplate2(data) {
    const p = data.personal;
    return `
    <div style="font-family: 'Inter', sans-serif; max-width:800px; margin:0 auto; display:flex; box-shadow:0 0 10px rgba(0,0,0,0.1);">
        <div style="width:35%; background:#4f46e5; color:white; padding:30px 20px;">
            <div style="text-align:center; margin-bottom:30px;">
                <div style="width:100px; height:100px; background:#fff; border-radius:50%; margin:0 auto; overflow:hidden;">
                    ${data.photo ? `<img src="${data.photo}" style="width:100%; height:100%; object-fit:cover;">` : '<span style="font-size:40px; display:flex; align-items:center; justify-content:center; height:100%;">👤</span>'}
                </div>
                <h2 style="margin:10px 0 0;">${p.fullName}</h2>
            </div>
            <div style="margin-top:20px;">
                <h4>Contact</h4>
                <p>📧 ${p.email}</p><p>📱 ${p.mobile}</p><p>📍 ${p.address}</p>
                <h4>DOB</h4><p>${p.dob}</p>
                <h4>Languages</h4><p>${p.languages}</p>
            </div>
        </div>
        <div style="width:65%; padding:30px;">
            <h3 style="color:#4f46e5;">Education</h3>
            ${data.education.map(e => `<p><strong>${e.exam}</strong> (${e.year}) - ${e.board} - ${e.percent}</p>`).join('')}
            <h3 style="color:#4f46e5; margin-top:20px;">Qualifications</h3>
            ${data.qualifications.map(q => `<p>${q.name} - ${q.institute}</p>`).join('')}
            ${data.declaration ? '<p style="margin-top:20px; font-style:italic;">Declaration: All info is true.</p>' : ''}
        </div>
    </div>`;
}
