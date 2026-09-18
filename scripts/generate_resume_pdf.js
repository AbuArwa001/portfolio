const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const resumeData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../app/resume/resume.json"), "utf-8")
);

// Read avatar image as base64 so it renders reliably in headless Chromium without web server
let avatarBase64 = "";
try {
  const avatarPath = path.join(__dirname, "../public/profile.jpg");
  if (fs.existsSync(avatarPath)) {
    const avatarBuffer = fs.readFileSync(avatarPath);
    avatarBase64 = `data:image/jpeg;base64,${avatarBuffer.toString("base64")}`;
  }
} catch (e) {
  console.warn("Avatar reading failed, using fallback");
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${resumeData.profile.name} - Curriculum Vitae & Résumé</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 10mm 12mm 10mm 12mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 9.5pt;
      line-height: 1.45;
      color: #0f172a;
      background: #ffffff;
      padding: 0;
      margin: 0;
    }
    .container {
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
    }
    
    /* Header */
    .header {
      border-bottom: 2.5px solid #059669;
      padding-bottom: 16px;
      margin-bottom: 18px;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
    }
    .profile-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .avatar {
      width: 82px;
      height: 82px;
      border-radius: 16px;
      border: 2px solid #10b981;
      object-fit: cover;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      background-color: #f1f5f9;
    }
    .name-title h1 {
      font-size: 20pt;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #020617;
      text-transform: uppercase;
      line-height: 1.1;
    }
    .role-badge {
      display: inline-block;
      font-size: 10pt;
      font-weight: 700;
      color: #047857;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 3px;
    }
    .location-tag {
      font-size: 8pt;
      color: #64748b;
      font-family: monospace;
      margin-top: 2px;
    }
    .contact-box {
      font-size: 8.5pt;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 10px 14px;
      text-align: right;
      line-height: 1.5;
    }
    .contact-box strong {
      color: #0f172a;
    }
    .contact-box a {
      color: #047857;
      text-decoration: none;
    }

    /* Metric Highlight Cards */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
    }
    .metric-card {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 8px 10px;
      text-align: center;
    }
    .metric-val {
      font-size: 13pt;
      font-weight: 900;
      line-height: 1.1;
    }
    .metric-val.emerald { color: #059669; }
    .metric-val.blue { color: #2563eb; }
    .metric-val.teal { color: #0d9488; }
    .metric-lbl {
      font-size: 7.5pt;
      text-transform: uppercase;
      font-weight: 700;
      color: #475569;
      letter-spacing: 0.5px;
      margin-top: 2px;
    }

    /* Section Styles */
    .section {
      margin-bottom: 16px;
      page-break-inside: auto;
    }
    .section-title {
      font-size: 9.5pt;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;
      border-bottom: 1.5px solid #cbd5e1;
      padding-bottom: 3px;
    }
    .section-title::before {
      content: "";
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #059669;
      display: inline-block;
    }

    .summary-text {
      font-size: 9pt;
      color: #334155;
      line-height: 1.45;
      text-align: justify;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px 12px;
    }

    /* Skills Grid */
    .skills-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }
    .skill-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 7px 10px;
    }
    .skill-category {
      font-size: 8pt;
      font-weight: 800;
      text-transform: uppercase;
      color: #065f46;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .skill-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
    .badge {
      font-size: 7.5pt;
      font-weight: 600;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      color: #1e293b;
      padding: 1px 6px;
      border-radius: 4px;
    }

    /* Experience */
    .job-card {
      background: #fafafa;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px 12px;
      margin-bottom: 10px;
      page-break-inside: avoid;
    }
    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 4px;
      margin-bottom: 6px;
    }
    .job-title {
      font-size: 10pt;
      font-weight: 800;
      color: #0f172a;
    }
    .job-company {
      font-size: 8.5pt;
      font-weight: 700;
      color: #047857;
      text-transform: uppercase;
    }
    .job-meta {
      font-size: 8pt;
      font-family: monospace;
      font-weight: 600;
      color: #475569;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      padding: 2px 7px;
      border-radius: 6px;
    }
    .job-bullets {
      list-style-type: none;
      padding-left: 0;
    }
    .job-bullets li {
      position: relative;
      padding-left: 14px;
      font-size: 8.5pt;
      color: #334155;
      margin-bottom: 3px;
      line-height: 1.35;
    }
    .job-bullets li::before {
      content: "▸";
      position: absolute;
      left: 0;
      color: #059669;
      font-weight: bold;
    }

    /* Projects Grid */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }
    .project-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 8px 10px;
      page-break-inside: avoid;
    }
    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .project-name {
      font-size: 9pt;
      font-weight: 800;
      color: #0f172a;
    }
    .project-role {
      font-size: 7.5pt;
      font-weight: 700;
      color: #047857;
    }
    .project-desc {
      font-size: 8pt;
      color: #475569;
      margin-top: 3px;
      line-height: 1.3;
    }
    .project-tech {
      font-size: 7.5pt;
      font-family: monospace;
      color: #64748b;
      margin-top: 4px;
      padding-top: 3px;
      border-top: 1px dashed #e2e8f0;
    }

    /* Education & Certs Grid */
    .two-col-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    .card-item {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 7px 10px;
      page-break-inside: avoid;
    }
    .card-item-title {
      font-size: 8.5pt;
      font-weight: 700;
      color: #0f172a;
    }
    .card-item-sub {
      font-size: 7.5pt;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="header-top">
        <div class="profile-left">
          ${avatarBase64 ? `<img src="${avatarBase64}" alt="${resumeData.profile.name}" class="avatar" />` : ""}
          <div class="name-title">
            <h1>${resumeData.profile.name}</h1>
            <div class="role-badge">${resumeData.profile.role}</div>
            <div class="location-tag">📍 ${resumeData.profile.location || "Nairobi, Kenya"} • Verified Full-Stack Engineer</div>
          </div>
        </div>

        <div class="contact-box">
          <div><strong>Email:</strong> <a href="mailto:${resumeData.contact.email}">${resumeData.contact.email}</a></div>
          <div><strong>Phone:</strong> ${resumeData.profile.phone}</div>
          <div><strong>LinkedIn:</strong> ${resumeData.contact.linkedin.replace("https://", "")}</div>
          <div><strong>GitHub:</strong> ${resumeData.contact.github.replace("https://", "")}</div>
          <div><strong>Portfolio:</strong> ${resumeData.contact.website ? resumeData.contact.website.replace("https://", "") : ""}</div>
        </div>
      </div>

      <!-- 3 Metrics Highlights -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-val emerald">6+ Years</div>
          <div class="metric-lbl">Enterprise IT & Web Systems</div>
        </div>
        <div class="metric-card">
          <div class="metric-val blue">4 Flagship</div>
          <div class="metric-lbl">Live National Deployments</div>
        </div>
        <div class="metric-card">
          <div class="metric-val teal">Dual Domain</div>
          <div class="metric-lbl">Networking & Full-Stack</div>
        </div>
      </div>
    </div>

    <!-- Executive Summary -->
    <div class="section">
      <div class="section-title">Executive Profile & Engineering Philosophy</div>
      <div class="summary-text">${resumeData.profile.bio}</div>
    </div>

    <!-- Technical Competencies Matrix -->
    <div class="section">
      <div class="section-title">Technical Competencies & Systems Architecture Matrix</div>
      <div class="skills-grid">
        ${Object.entries(resumeData.skills_categorized || {}).map(([cat, skills]) => `
          <div class="skill-card">
            <div class="skill-category">${cat}</div>
            <div class="skill-badges">
              ${skills.map(s => `<span class="badge">${s}</span>`).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Work Experience -->
    <div class="section">
      <div class="section-title">Professional Engineering & IT Management Experience</div>
      ${resumeData.experience.map(job => `
        <div class="job-card">
          <div class="job-header">
            <div>
              <span class="job-title">${job.title}</span> — 
              <span class="job-company">${job.company}</span>
            </div>
            <span class="job-meta">${job.period} | ${job.location}</span>
          </div>
          <ul class="job-bullets">
            ${job.achievements.map(ach => `<li>${ach}</li>`).join("")}
          </ul>
        </div>
      `).join("")}
    </div>

    <!-- Production Projects -->
    <div class="section">
      <div class="section-title">Flagship Production Projects & Deployments</div>
      <div class="projects-grid">
        ${(resumeData.projects || []).map(p => `
          <div class="project-card">
            <div class="project-header">
              <span class="project-name">${p.name}</span>
              <span class="project-role">${p.role}</span>
            </div>
            <div class="project-desc">${p.description}</div>
            <div class="project-tech">Stack: ${p.tech}</div>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Education & Certifications -->
    <div class="section">
      <div class="section-title">Education, Certifications & Credentials</div>
      <div class="two-col-grid">
        <div class="card-item">
          <div class="card-item-title">Software Engineering Certification</div>
          <div class="card-item-sub">ALX Africa / Holberton School (2023 – 2024)</div>
        </div>
        ${(resumeData.certifications || []).map(c => `
          <div class="card-item">
            <div class="card-item-title">${c.name}</div>
            <div class="card-item-sub">${c.issuer} (${c.year})</div>
          </div>
        `).join("")}
      </div>
    </div>
  </div>
</body>
</html>`;

const tempHtmlPath = path.join(__dirname, "../public/resume-preview.html");
const outputPdfPath = path.join(__dirname, "../public/Khalfan_Athman_Resume.pdf");

fs.writeFileSync(tempHtmlPath, html, "utf-8");
console.log("HTML preview generated at:", tempHtmlPath);

try {
  // Use Chromium to render PDF
  const cmd = `chromium --headless --disable-gpu --no-sandbox --print-to-pdf="${outputPdfPath}" "${tempHtmlPath}"`;
  console.log("Running Chromium PDF generator...");
  execSync(cmd, { stdio: "inherit" });
  console.log("SUCCESS: Khalfan_Athman_Resume.pdf successfully generated at:", outputPdfPath);
} catch (err) {
  console.error("Chromium PDF compilation error:", err);
  process.exit(1);
}
