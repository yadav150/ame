// dashboard.js - Real Firebase user + localStorage resumes

function initDashboard() {
  auth.onAuthStateChanged((user) => {
    if (!user) {
      // Not signed in – redirect to login
      window.location.href = 'login.html';
      return;
    }

    // Firebase user is valid
    const userEmail = user.email;
    const userName = user.displayName || userEmail.split('@')[0];

    // --- Profile Section ---
    document.getElementById('profileAvatar').textContent = userEmail.charAt(0).toUpperCase();
    document.getElementById('welcomeMessage').textContent = `Welcome, ${userName}`;
    document.getElementById('profileEmail').textContent = userEmail;

    // --- Load Resumes from localStorage (keyed by email) ---
    const key = `resumes_${userEmail}`;
    const resumes = JSON.parse(localStorage.getItem(key) || '[]');
    const grid = document.getElementById('resumesGrid');
    const emptyState = document.getElementById('emptyState');

    if (resumes.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      grid.innerHTML = ''; // clear any previous content
    } else {
      if (emptyState) emptyState.style.display = 'none';
      grid.innerHTML = resumes.map((resume, idx) => `
        <div class="template-card resume-saved-card">
          <div class="template-preview" style="height:150px; background:#f1f5f9; display:flex; align-items:center; justify-content:center;">
            <span style="font-size:2rem;">📄</span>
          </div>
          <div class="template-info">
            <h3>Resume ${idx + 1}</h3>
            <p>Template ${resume.template} • ${new Date(resume.created).toLocaleDateString()}</p>
            <button class="btn btn-outline btn-sm view-saved-btn" data-id="${resume.id}">👁️ View</button>
          </div>
        </div>
      `).join('');

      // Attach click handlers to view buttons
      document.querySelectorAll('.view-saved-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.dataset.id);
          const resume = resumes.find(r => r.id === id);
          if (resume) {
            let html = '';
            // Use template render functions (must be loaded on the page)
            switch (resume.template) {
              case '1': html = renderTemplate1(resume.data); break;
              case '2': html = renderTemplate2(resume.data); break;
              case '3': html = renderTemplate3(resume.data); break;
              default: html = '<p>Template not found.</p>';
            }
            const win = window.open('', '_blank');
            win.document.write(html);
            win.document.close();
          }
        });
      });
    }

    // --- Logout button ---
    document.getElementById('dashboardLogoutBtn')?.addEventListener('click', logout);
  });
}
