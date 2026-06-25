// form.js
document.addEventListener('DOMContentLoaded', () => {
    // ---------- Firebase Init ----------
    const firebaseConfig = {
        apiKey: "AIzaSyBLX-DBrAZZgi7OGRW3-oeno0PJsZ9hzEg",
        authDomain: "its-me-ame.firebaseapp.com",
        projectId: "its-me-ame",
        storageBucket: "its-me-ame.firebasestorage.app",
        messagingSenderId: "832380884001",
        appId: "1:832380884001:web:0c9239588ceb8d8995bf60",
        measurementId: "G-L12EEJG7L9"
    };
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    // ---------- Auth State & Navbar ----------
    const authLink = document.getElementById('authLink');
    const userDisplay = document.getElementById('userDisplay');
    const userNameSpan = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');

    auth.onAuthStateChanged((user) => {
        if (user) {
            authLink.style.display = 'none';
            userDisplay.style.display = 'flex';
            userNameSpan.textContent = user.displayName || user.email;
            const emailField = document.getElementById('email');
            if (emailField && !emailField.value) {
                emailField.value = user.email;
            }
        } else {
            authLink.style.display = 'block';
            userDisplay.style.display = 'none';
        }
    });

    logoutBtn.addEventListener('click', () => {
        auth.signOut().then(() => {
            window.location.href = 'index.html';
        });
    });

    // ---------- Step Navigation ----------
    const steps = document.querySelectorAll('.form-step');
    const stepIndicators = document.querySelectorAll('.step');
    let currentStep = 1;

    function showStep(stepNumber) {
        steps.forEach(step => step.classList.remove('active'));
        document.getElementById(`step${stepNumber}`).classList.add('active');
        stepIndicators.forEach(ind => {
            const num = parseInt(ind.dataset.step);
            ind.classList.remove('active', 'completed');
            if (num === stepNumber) ind.classList.add('active');
            else if (num < stepNumber) ind.classList.add('completed');
        });
        currentStep = stepNumber;
        if (stepNumber === 4) {
            const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
            document.getElementById('dateAuto').value = today;
        }
    }

    function validateStep(stepNumber) {
        const currentStepEl = document.getElementById(`step${stepNumber}`);
        const requiredFields = currentStepEl.querySelectorAll('[required]');
        let isValid = true;
        requiredFields.forEach(field => {
            if (field.type === 'checkbox' && !field.checked) {
                field.classList.add('error');
                isValid = false;
            } else if (field.type === 'file' && field.files.length === 0) {
                field.classList.add('error');
                isValid = false;
            } else if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });
        if (!isValid) {
            const firstInvalid = currentStepEl.querySelector('.error');
            if (firstInvalid) firstInvalid.focus();
        }
        return isValid;
    }

    document.querySelectorAll('.btn-next').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextStep = parseInt(btn.dataset.next);
            if (validateStep(currentStep)) showStep(nextStep);
        });
    });

    document.querySelectorAll('.btn-prev').forEach(btn => {
        btn.addEventListener('click', () => {
            const prevStep = parseInt(btn.dataset.prev);
            showStep(prevStep);
        });
    });

    document.getElementById('addEducation').addEventListener('click', () => {
        const container = document.getElementById('educationContainer');
        const newEntry = document.createElement('div');
        newEntry.className = 'education-entry';
        newEntry.innerHTML = `
            <div class="form-row">
                <div class="form-group"><label>Exam Name <span class="req">*</span></label><input type="text" class="examName" required></div>
                <div class="form-group"><label>Board/University <span class="req">*</span></label><input type="text" class="board" required></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Passing Year <span class="req">*</span></label><input type="text" class="passYear" required placeholder="YYYY"></div>
                <div class="form-group"><label>Percentage <span class="req">*</span></label><input type="text" class="percentage" required placeholder="e.g. 85%"></div>
            </div>
            <div class="form-group"><label>Division <span class="req">*</span></label>
                <select class="division" required>
                    <option value="">-- Division --</option>
                    <option value="First">First</option>
                    <option value="Second">Second</option>
                    <option value="Third">Third</option>
                </select>
            </div>
        `;
        container.appendChild(newEntry);
    });

    document.getElementById('addOtherQual').addEventListener('click', () => {
        const container = document.getElementById('otherQualContainer');
        const newEntry = document.createElement('div');
        newEntry.className = 'other-entry';
        newEntry.innerHTML = `
            <div class="form-row">
                <div class="form-group"><label>Qualification Name <span class="req">*</span></label><input type="text" class="qualName" required></div>
                <div class="form-group"><label>Institute/Organization <span class="req">*</span></label><input type="text" class="institute" required></div>
            </div>
            <div class="form-row">
                <div class="form-group"><label>Passing Year <span class="req">*</span></label><input type="text" class="qualYear" required placeholder="YYYY"></div>
                <div class="form-group"><label>Score/Grade <span class="req">*</span></label><input type="text" class="score" required></div>
            </div>
            <div class="form-group"><label>Duration <span class="req">*</span></label><input type="text" class="duration" required placeholder="e.g., 6 months"></div>
        `;
        container.appendChild(newEntry);
    });

    document.getElementById('photoUpload')?.addEventListener('change', function(e) {
        const file = e.target.files[0];
        const status = document.getElementById('photoStatus');
        if (file) {
            status.textContent = `File: ${file.name} (${(file.size/1024).toFixed(1)} KB) - Ready to upload`;
        } else {
            status.textContent = 'No file chosen';
        }
    });

    // ---------- Generate PDF ----------
    document.getElementById('generateBtn').addEventListener('click', async () => {
        if (!validateStep(4)) return;

        const user = auth.currentUser;
        if (!user) {
            alert('Please log in first to download your resume.');
            window.location.href = 'login.html';
            return;
        }

        // Gather form data
        const data = {
            name: document.getElementById('applicantName').value,
            father: document.getElementById('fatherName').value,
            mother: document.getElementById('motherName').value,
            mobile: document.getElementById('mobile').value,
            email: document.getElementById('email').value,
            dob: document.getElementById('dob').value,
            gender: document.getElementById('gender').value,
            languages: document.getElementById('languages').value,
            address: document.getElementById('address').value,
            category: document.getElementById('category').value,
            marital: document.getElementById('maritalStatus').value,
            experience: document.getElementById('experience').value,
            place: document.getElementById('place').value || 'Guwahati',
            date: document.getElementById('dateAuto').value,
            education: [],
            otherQual: [],
            photo: null
        };

        // Education entries
        document.querySelectorAll('.education-entry').forEach(entry => {
            const exam = entry.querySelector('.examName')?.value;
            const board = entry.querySelector('.board')?.value;
            const year = entry.querySelector('.passYear')?.value;
            const percent = entry.querySelector('.percentage')?.value;
            const division = entry.querySelector('.division')?.value;
            if (exam && board) data.education.push({ exam, board, year, percent, division });
        });

        // Other qualifications
        document.querySelectorAll('.other-entry').forEach(entry => {
            const qual = entry.querySelector('.qualName')?.value;
            const inst = entry.querySelector('.institute')?.value;
            const year = entry.querySelector('.qualYear')?.value;
            const score = entry.querySelector('.score')?.value;
            const duration = entry.querySelector('.duration')?.value;
            if (qual && inst) data.otherQual.push({ qual, inst, year, score, duration });
        });

        // Photo
        const photoFile = document.getElementById('photoUpload').files[0];
        if (photoFile) {
            data.photo = await readFileAsDataURL(photoFile);
        }

        // Get selected template
        const template = localStorage.getItem('selectedTemplate') || 'elf';

        // Build HTML
        const html = buildResumeHTML(data, template);

        // Convert to PDF
        const element = document.createElement('div');
        element.innerHTML = html;
        element.style.position = 'absolute';
        element.style.left = '-9999px';
        element.style.width = '800px';
        element.style.padding = '20px';
        document.body.appendChild(element);

        html2canvas(element, { scale: 2, useCORS: true }).then(canvas => {
            document.body.removeChild(element);
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 297;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            while (heightLeft > 0) {
                position = position - pageHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            pdf.save(`${data.name.replace(/\s+/g, '_')}_Resume.pdf`);
            document.getElementById('successMessage').style.display = 'flex';
        }).catch(err => {
            console.error('PDF generation error:', err);
            alert('Something went wrong while generating PDF.');
        });
    });

    document.getElementById('closeSuccess').addEventListener('click', () => {
        document.getElementById('successMessage').style.display = 'none';
    });

    // Read template from URL
    const urlParams = new URLSearchParams(window.location.search);
    const template = urlParams.get('template');
    if (template) {
        localStorage.setItem('selectedTemplate', template);
    }

    showStep(1);
});

// ---------- Helper Functions ----------
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function buildResumeHTML(data, template) {
    const themes = {
        elf: {
            bg: '#f5f1e3', border: '#c9a84c', text: '#2d5a27', accent: '#c9a84c',
            headerBg: '#fdfcf5', font: "'Georgia', serif"
        },
        dwarf: {
            bg: '#fdf5e6', border: '#d4782f', text: '#4a2c17', accent: '#d4782f',
            headerBg: '#fdf0e0', font: "'Georgia', serif"
        },
        fae: {
            bg: '#fef9ff', border: '#e891b9', text: '#8b5cf6', accent: '#e891b9',
            headerBg: '#fdf0fa', font: "'Georgia', serif"
        },
        dragon: {
            bg: '#1c0f0f', border: '#d4a017', text: '#e0d5c0', accent: '#d4a017',
            headerBg: '#2a1515', font: "'Georgia', serif", dark: true
        },
        necro: {
            bg: '#111016', border: '#b8a9d4', text: '#d5cde8', accent: '#b8a9d4',
            headerBg: '#1a1822', font: "'Georgia', serif", dark: true
        }
    };
    const t = themes[template] || themes.elf;
    const dark = t.dark;
    const textColor = t.text;
    const bgColor = t.bg;
    const borderColor = t.border;
    const accentColor = t.accent;

    let eduRows = data.education.map(e => `
        <tr><td>${e.exam}</td><td>${e.board}</td><td>${e.year}</td><td>${e.percent}</td><td>${e.division}</td></tr>
    `).join('');

    let qualRows = data.otherQual.map(q => `
        <tr><td>${q.qual}</td><td>${q.inst}</td><td>${q.year}</td><td>${q.score}</td><td>${q.duration}</td></tr>
    `).join('');

    return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
    body { font-family: ${t.font}; background: ${bgColor}; color: ${textColor}; margin: 0; padding: 0; }
    .resume { width: 780px; margin: 0 auto; padding: 30px; border: 3px solid ${borderColor}; border-radius: 4px; }
    .header { text-align: center; border-bottom: 2px solid ${accentColor}; padding-bottom: 15px; margin-bottom: 20px; }
    .header h1 { margin: 0; font-size: 2rem; letter-spacing: 3px; color: ${accentColor}; }
    .photo { width: 100px; height: 120px; border: 2px solid ${borderColor}; float: right; margin-left: 20px; }
    .photo img { width: 100%; height: 100%; object-fit: cover; }
    .section-title { color: ${accentColor}; border-bottom: 1px solid ${borderColor}; padding-bottom: 5px; margin-top: 15px; text-transform: uppercase; letter-spacing: 2px; font-size: 0.95rem; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    th, td { border: 1px solid ${borderColor}; padding: 6px 8px; text-align: left; font-size: 0.85rem; }
    th { background: ${t.headerBg}; }
    .info-table td:first-child { font-weight: bold; width: 30%; }
    .declaration { margin-top: 20px; font-size: 0.9rem; }
    .signature { margin-top: 30px; text-align: right; }
</style></head><body>
<div class="resume">
    <div class="header"><h1>${data.name || 'Your Name'}</h1></div>
    <div style="overflow:hidden;">
        ${data.photo ? `<div class="photo"><img src="${data.photo}" alt="photo"/></div>` : ''}
        <table class="info-table">
            <tr><td>Father's Name</td><td>${data.father}</td></tr>
            <tr><td>Mother's Name</td><td>${data.mother}</td></tr>
            <tr><td>Mobile</td><td>${data.mobile}</td></tr>
            <tr><td>Email</td><td>${data.email}</td></tr>
            <tr><td>Date of Birth</td><td>${data.dob}</td></tr>
            <tr><td>Gender</td><td>${data.gender}</td></tr>
            <tr><td>Languages</td><td>${data.languages}</td></tr>
            <tr><td>Address</td><td>${data.address}</td></tr>
            <tr><td>Category</td><td>${data.category}</td></tr>
            <tr><td>Marital Status</td><td>${data.marital}</td></tr>
            <tr><td>Experience</td><td>${data.experience}</td></tr>
        </table>
    </div>
    <div class="section-title">Educational Qualifications</div>
    <table><tr><th>Exam</th><th>Board/University</th><th>Year</th><th>Percentage</th><th>Division</th></tr>${eduRows}</table>
    <div class="section-title">Other Qualifications</div>
    <table><tr><th>Qualification</th><th>Institute</th><th>Year</th><th>Score</th><th>Duration</th></tr>${qualRows}</table>
    <div class="declaration"><p>I declare that all information provided is true and correct.</p></div>
    <div class="signature">
        <p>Place: ${data.place}</p>
        <p>Date: ${data.date}</p>
        <p>Signature: ${data.name}</p>
    </div>
</div>
</body></html>`;
}
