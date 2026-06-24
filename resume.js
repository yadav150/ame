<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Templates — Resume Builder</title>
    <link rel="stylesheet" href="style.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap" rel="stylesheet" />
    <script src="script.js" defer></script>
</head>
<body>
    <nav class="navbar" id="navbar">
        <div class="container navbar__container">
            <a href="index.html" class="navbar__logo"><i class="fas fa-file-alt"></i><span>Resume<span class="navbar__logo-highlight">Builder</span></span></a>
            <button class="navbar__toggle" id="navToggle"><i class="fas fa-bars"></i></button>
            <ul class="navbar__links" id="navLinks">
                <li><a href="index.html">Home</a></li>
                <li><a href="templates.html" class="active">Templates</a></li>
                <li><a href="index.html#features">Features</a></li>
                <li><a href="index.html#faq">FAQ</a></li>
                <li><a href="index.html#contact">Contact</a></li>
                <li><a href="resume.html" class="btn btn--primary btn--small">Get Started</a></li>
            </ul>
        </div>
    </nav>

    <section style="padding:120px 0 60px;text-align:center;">
        <div class="container">
            <h1 style="font-size:3rem;font-weight:800;">Choose Your Template</h1>
            <p style="color:var(--text-light);font-size:1.2rem;max-width:600px;margin:12px auto 40px;">All templates are ATS-friendly, print-ready, and fully customizable.</p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:30px;text-align:left;">
                <div class="template-card"><div class="template-card__preview"><div class="template-card__mockup" style="padding:20px;background:#f1f5f9;"><div style="font-weight:700;">Modern</div><div style="font-size:0.85rem;color:var(--text-light);">Clean & minimal</div></div></div><h4 class="template-card__name">Modern</h4><p class="template-card__desc">Sleek design with a contemporary feel.</p></div>
                <div class="template-card"><div class="template-card__preview"><div class="template-card__mockup" style="padding:20px;background:#f1f5f9;"><div style="font-weight:700;">Classic</div><div style="font-size:0.85rem;color:var(--text-light);">Timeless & professional</div></div></div><h4 class="template-card__name">Classic</h4><p class="template-card__desc">Traditional layout trusted by recruiters.</p></div>
                <div class="template-card"><div class="template-card__preview"><div class="template-card__mockup" style="padding:20px;background:#f1f5f9;"><div style="font-weight:700;">Creative</div><div style="font-size:0.85rem;color:var(--text-light);">Bold & expressive</div></div></div><h4 class="template-card__name">Creative</h4><p class="template-card__desc">Stand out with a unique visual style.</p></div>
                <div class="template-card"><div class="template-card__preview"><div class="template-card__mockup" style="padding:20px;background:#f1f5f9;"><div style="font-weight:700;">Minimal</div><div style="font-size:0.85rem;color:var(--text-light);">Less is more</div></div></div><h4 class="template-card__name">Minimal</h4><p class="template-card__desc">Ultra-clean, focused, and readable.</p></div>
            </div>
            <div style="margin-top:40px;"><a href="resume.html" class="btn btn--primary btn--large"><i class="fas fa-pen-fancy"></i> Build Your Resume</a></div>
        </div>
    </section>

    <footer class="footer" style="margin-top:40px;">
        <div class="container"><div class="footer__bottom"><p>&copy; 2026 Resume Builder By Ame. All rights reserved.</p></div></div>
    </footer>
</body>
</html>
