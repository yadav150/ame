// form.js – 5‑step form with multi‑select & PDF auto‑download

let currentStep = 1;
let eduCounter = 1;
let qualCounter = 1;

// Multi‑select data
const skillsOptions = [
  'HTML', 'CSS', 'JavaScript', 'React', 'Angular', 'Vue', 'Node.js', 'Python',
  'Java', 'C++', 'C#', 'PHP', 'SQL', 'MongoDB', 'Git', 'Docker', 'AWS',
  'Figma', 'Adobe XD', 'Photoshop', 'Illustrator', 'Excel', 'PowerPoint',
  'Word', 'Data Analysis', 'Machine Learning', 'Deep Learning', 'Flutter'
];

const languageOptions = [
  'English', 'Hindi', 'Nepali', 'Bengali', 'Urdu', 'Punjabi', 'Gujarati',
  'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Odia', 'Assamese',
  'Sanskrit', 'French', 'German', 'Spanish', 'Chinese', 'Japanese', 'Korean',
  'Arabic', 'Russian', 'Portuguese', 'Italian'
];

// Selected values (max 5)
let selectedSkills = [];
let selectedLanguages = [];

function initFormPage() {
  const form = document.getElementById('resumeForm');
  if (!form) return;

  // Navigation buttons
  document.querySelectorAll('.next-step').forEach(btn => {
    btn.addEventListener('click', () => {
      const next = parseInt(btn.dataset.next);
      if (validateStep(currentStep)) {
        goToStep(next);
      }
    });
  });
  document.querySelectorAll('.prev-step').forEach(btn => {
    btn.addEventListener('click', () => {
      const prev = parseInt(btn.dataset.prev);
      goToStep(prev);
    });
  });

  document.getElementById('addMoreEducation')?.addEventListener('click', addEducationEntry);
  document.getElementById('addMoreQualification')?.addEventListener('click', addQualificationEntry);

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-edu')) e.target.closest('.education-entry').remove();
    if (e.target.classList.contains('remove-qual')) e.target.closest('.qualification-entry').remove();
  });

  // Photo upload
  const photoArea = document.getElementById('photoUploadArea');
  const photoInput = document.getElementById('photoInput');
  if (photoArea && photoInput) {
    photoArea.addEventListener('click', () => photoInput.click());
    photoInput.addEventListener('change', handlePhotoUpload);
  }

  // Build multi‑select checkboxes
  buildMultiSelect('skillsContainer', skillsOptions, selectedSkills, 'skill', 5);
  buildMultiSelect('languagesContainer', languageOptions, selectedLanguages, 'lang', 5);

  form.addEventListener('submit', handleSubmit);

  goToStep(1);
}

// Multi‑select builder
function buildMultiSelect(containerId, options, selectedArray, prefix, max) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  options.forEach(option => {
    const id = `${prefix}_${option.replace(/\s+/g, '_')}`;
    const label = document.createElement('label');
    label.className = 'checkbox-label multi-select-label';
    label.style.cssText = 'display:inline-flex; margin-right:12px; margin-bottom:8px; align-items:center; gap:4px; font-size:0.9rem;';

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.id = id;
    cb.value = option;
    cb.checked = selectedArray.includes(option);

    cb.addEventListener('change', () => {
      if (cb.checked) {
        if (selectedArray.length >= max) {
          cb.checked = false;
          alert(`Maximum ${max} selections allowed.`);
          return;
        }
        selectedArray.push(option);
      } else {
        const idx = selectedArray.indexOf(option);
        if (idx > -1) selectedArray.splice(idx, 1);
      }
      // Update all checkboxes of this group
      updateCheckboxGroup(prefix, selectedArray);
    });

    label.appendChild(cb);
    label.appendChild(document.createTextNode(option));
    container.appendChild(label);
  });
}

function updateCheckboxGroup(prefix, selected) {
  const allCB = document.querySelectorAll(`input[type="checkbox"][id^="${prefix}_"]`);
  allCB.forEach(cb => {
    cb.checked = selected.includes(cb.value);
  });
}

// Step navigation & validation (unchanged except step count)
function goToStep(step) {
  document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
  document.getElementById(`step${step}`).classList.add('active');
  currentStep = step;
  updateStepIndicator();
}

function updateStepIndicator() {
  document.querySelectorAll('.step').forEach(el => {
    const stepNum = parseInt(el.dataset.step);
    el.classList.remove('active', 'completed');
    if (stepNum === currentStep) el.classList.add('active');
    else if (stepNum < currentStep) el.classList.add('completed');
  });
}

function validateStep(step) {
  let isValid = true;
  const stepEl = document.getElementById(`step${step}`);
  stepEl.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
  stepEl.querySelectorAll('.error-msg').forEach(e => e.textContent = '');

  if (step === 1) {
    const fullName = stepEl.querySelector('input[name="fullName"]');
    const mobile = stepEl.querySelector('input[name="mobile"]');
    const email = stepEl.querySelector('input[name="email"]');
    if (fullName && !fullName.value.trim()) { showError(fullName, 'Full name is required'); isValid = false; }
    if (mobile && !mobile.value.trim()) { showError(mobile, 'Mobile number is required'); isValid = false; }
    if (email && !email.value.trim()) { showError(email, 'Email is required'); isValid = false; }
    else if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { showError(email, 'Invalid email'); isValid = false; }
  } else if (step === 2) {
    const firstExam = stepEl.querySelector('input[name="eduExam_0"]');
    if (firstExam && !firstExam.value.trim()) { showError(firstExam, 'Exam name is required'); isValid = false; }
  } else if (step === 4) {
    // Skills / Languages validation (optional but ensure not empty if required)
    // We can leave it optional – no validation
  } else if (step === 5) {
    const declaration = document.getElementById('declaration');
    if (declaration && !declaration.checked) {
      document.getElementById('declarationError').textContent = 'You must agree to the declaration';
      isValid = false;
    } else {
      document.getElementById('declarationError').textContent = '';
    }
  }
  return isValid;
}

function showError(input, message) {
  const group = input.closest('.form-group');
  if (group) {
    group.classList.add('error');
    const errorEl = group.querySelector('.error-msg');
    if (errorEl) errorEl.textContent = message;
  }
}

// Dynamic entries (same as before)
function addEducationEntry() {
  const container = document.getElementById('educationContainer');
  const index = eduCounter++;
  const html = `
    <div class="education-entry" data-index="${index}">
      <h4 class="entry-label">Education #${index+1}</h4>
      <div class="form-row">
        <div class="form-group required"><label>Exam Name</label><input type="text" name="eduExam_${index}" placeholder="e.g., B.Tech"><span class="error-msg"></span></div>
        <div class="form-group"><label>Board / University</label><input type="text" name="eduBoard_${index}"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Year</label><input type="text" name="eduYear_${index}" placeholder="2024"></div>
        <div class="form-group"><label>Percentage / CGPA</label><input type="text" name="eduPercent_${index}"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Division</label>
          <select name="eduDivision_${index}">
            <option value="">Select</option>
            <option value="First">First</option>
            <option value="Second">Second</option>
            <option value="Third">Third</option>
            <option value="Distinction">Distinction</option>
          </select>
        </div>
      </div>
      <button type="button" class="btn btn-sm btn-outline remove-edu">Remove</button>
    </div>`;
  container.insertAdjacentHTML('beforeend', html);
}

function addQualificationEntry() {
  const container = document.getElementById('qualificationsContainer');
  const index = qualCounter++;
  const html = `
    <div class="qualification-entry" data-index="${index}">
      <h4 class="entry-label">Qualification #${index+1}</h4>
      <div class="form-row">
        <div class="form-group"><label>Qualification Name</label><input type="text" name="qualName_${index}"></div>
        <div class="form-group"><label>Institute</label><input type="text" name="qualInstitute_${index}"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Year</label><input type="text" name="qualYear_${index}"></div>
        <div class="form-group"><label>Grade / Score</label><input type="text" name="qualGrade_${index}"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Duration</label><input type="text" name="qualDuration_${index}"></div>
      </div>
      <button type="button" class="btn btn-sm btn-outline remove-qual">Remove</button>
    </div>`;
  container.insertAdjacentHTML('beforeend', html);
}

function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      document.getElementById('photoPreview').src = event.target.result;
      document.getElementById('photoPreview').style.display = 'block';
      document.querySelector('.upload-placeholder').style.display = 'none';
    };
    reader.readAsDataURL(file);
  }
}

// Collect all form data
function collectFormData() {
  const form = document.getElementById('resumeForm');
  const data = {
    personal: {},
    education: [],
    qualifications: [],
    skills: [...selectedSkills],
    languages: [...selectedLanguages],
    place: document.getElementById('placeInput')?.value || '',
    declaration: document.getElementById('declaration')?.checked || false,
    photo: document.getElementById('photoPreview')?.src || ''
  };

  const personalFields = ['fullName', 'fatherName', 'motherName', 'mobile', 'email', 'dob', 'gender', 'languages', 'address', 'category', 'maritalStatus', 'experience'];
  personalFields.forEach(field => {
    const input = form.querySelector(`[name="${field}"]`);
    if (input) data.personal[field] = input.value;
  });

  document.querySelectorAll('.education-entry').forEach(entry => {
    const idx = entry.dataset.index;
    data.education.push({
      exam: entry.querySelector(`[name="eduExam_${idx}"]`)?.value || '',
      board: entry.querySelector(`[name="eduBoard_${idx}"]`)?.value || '',
      year: entry.querySelector(`[name="eduYear_${idx}"]`)?.value || '',
      percent: entry.querySelector(`[name="eduPercent_${idx}"]`)?.value || '',
      division: entry.querySelector(`[name="eduDivision_${idx}"]`)?.value || ''
    });
  });

  document.querySelectorAll('.qualification-entry').forEach(entry => {
    const idx = entry.dataset.index;
    data.qualifications.push({
      name: entry.querySelector(`[name="qualName_${idx}"]`)?.value || '',
      institute: entry.querySelector(`[name="qualInstitute_${idx}"]`)?.value || '',
      year: entry.querySelector(`[name="qualYear_${idx}"]`)?.value || '',
      grade: entry.querySelector(`[name="qualGrade_${idx}"]`)?.value || '',
      duration: entry.querySelector(`[name="qualDuration_${idx}"]`)?.value || ''
    });
  });

  return data;
}

// Handle submission
function handleSubmit(e) {
  e.preventDefault();
  if (!validateStep(5)) return;

  const formData = collectFormData();

  // Show spinner & disable form
  const overlay = document.getElementById('loadingOverlay');
  const form = document.getElementById('resumeForm');
  if (overlay) overlay.style.display = 'flex';
  form.querySelectorAll('input, select, textarea, button').forEach(el => el.disabled = true);

    setTimeout(() => {
    try {
      // ---------- Choose the correct template based on user selection ----------
      const templateId = localStorage.getItem('selectedTemplate') || '4';
      switch (templateId) {
        case '1':
          generateTemplate1PDF(formData);   // Modern Sidebar
          break;
        case '4':
        default:
          generateTemplate4PDF(formData);   // Professional A4 Photo
          break;
      }
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF. Please check the console for details.');
    } finally {
      if (overlay) overlay.style.display = 'none';
      form.querySelectorAll('input, select, textarea, button').forEach(el => el.disabled = false);
    }
  }, 400);
}
