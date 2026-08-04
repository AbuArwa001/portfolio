import { getResumeData } from "@/lib/resume-actions";
import { PrintButton } from "./PrintButton";

export default async function PrintCVPage() {
  const d = await getResumeData();

  return (
    <>
      {/* Print trigger button — hidden in print */}
      <div className="no-print fixed top-4 right-4 z-50 flex gap-3">
        <PrintButton />
        <a
          href="/resume"
          className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors bg-white"
        >
          ← Back
        </a>
      </div>

      {/* A4 CV Document */}
      <div id="cv-document" className="cv-page">
        {/* Header */}
        <header className="cv-header">
          <div className="cv-header-info">
            <h1 className="cv-name">{d.profile.name}</h1>
            <p className="cv-role">{d.profile.role}</p>
            {d.profile.bio && <p className="cv-bio">{d.profile.bio}</p>}
          </div>
          <div className="cv-contact">
            <p>✉ {d.contact.email}</p>
            {d.profile.phone && <p>📞 {d.profile.phone}</p>}
            {d.profile.location && <p>📍 {d.profile.location}</p>}
            <p>🔗 {d.contact.linkedin.replace("https://", "")}</p>
            <p>💻 {d.contact.github.replace("https://", "")}</p>
            {d.contact.website && <p>🌐 {d.contact.website.replace("https://", "")}</p>}
          </div>
        </header>

        <hr className="cv-divider" />

        {/* Experience */}
        <section className="cv-section">
          <h2 className="cv-section-title">Work Experience</h2>
          {d.experience.map((job, i) => (
            <div key={i} className="cv-entry">
              <div className="cv-entry-header">
                <div>
                  <h3 className="cv-entry-title">{job.title}</h3>
                  <p className="cv-entry-sub">{job.company} · {job.location}</p>
                </div>
                <span className="cv-entry-period">{job.period}</span>
              </div>
              <ul className="cv-list">
                {job.achievements.filter(Boolean).map((ach, j) => (
                  <li key={j}>{ach}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* Education */}
        <section className="cv-section">
          <h2 className="cv-section-title">Education</h2>
          {d.education.map((edu, i) => (
            <div key={i} className="cv-entry">
              <div className="cv-entry-header">
                <div>
                  <h3 className="cv-entry-title">{edu.school}</h3>
                  <p className="cv-entry-sub">{edu.degree}</p>
                </div>
                <span className="cv-entry-period">{edu.period}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section className="cv-section">
          <h2 className="cv-section-title">Skills</h2>
          <div className="cv-skills">
            {d.skills.filter(Boolean).map((skill, i) => (
              <span key={i} className="cv-skill-tag">{skill}</span>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section className="cv-section">
          <h2 className="cv-section-title">Certifications</h2>
          {d.certifications.map((cert, i) => (
            <div key={i} className="cv-entry">
              <div className="cv-entry-header">
                <div>
                  <h3 className="cv-entry-title">{cert.name}</h3>
                  <p className="cv-entry-sub">{cert.issuer}</p>
                </div>
                <span className="cv-entry-period">{cert.year}</span>
              </div>
            </div>
          ))}
        </section>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f5f5; font-family: 'Georgia', serif; }

        .no-print { }
        @media print { .no-print { display: none !important; } }

        .cv-page {
          max-width: 210mm;
          min-height: 297mm;
          margin: 20px auto;
          padding: 32px 36px;
          background: white;
          box-shadow: 0 4px 40px rgba(0,0,0,0.12);
          border-radius: 4px;
        }
        @media print {
          body { background: white; }
          .cv-page { margin: 0; padding: 18mm 20mm; box-shadow: none; border-radius: 0; }
        }

        /* Header */
        .cv-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; margin-bottom: 20px; }
        .cv-header-info { flex: 1; }
        .cv-name { font-size: 28px; font-weight: 700; color: #0f172a; letter-spacing: -0.5px; line-height: 1.1; }
        .cv-role { font-size: 14px; color: #0d9488; font-weight: 600; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
        .cv-bio { font-size: 12px; color: #475569; margin-top: 10px; line-height: 1.6; max-width: 420px; }
        .cv-contact { text-align: right; font-size: 11.5px; color: #475569; line-height: 1.8; }

        /* Divider */
        .cv-divider { border: none; border-top: 2px solid #0d9488; margin: 16px 0; }

        /* Section */
        .cv-section { margin-bottom: 22px; }
        .cv-section-title {
          font-size: 13px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 1.5px; color: #0d9488;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 6px; margin-bottom: 14px;
        }

        /* Entries */
        .cv-entry { margin-bottom: 14px; }
        .cv-entry-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 6px; }
        .cv-entry-title { font-size: 13.5px; font-weight: 700; color: #1e293b; }
        .cv-entry-sub { font-size: 12px; color: #64748b; margin-top: 1px; }
        .cv-entry-period { font-size: 11.5px; color: #94a3b8; white-space: nowrap; font-style: italic; }
        .cv-list { list-style: none; padding: 0; }
        .cv-list li { font-size: 12px; color: #475569; padding: 2px 0 2px 14px; position: relative; line-height: 1.6; }
        .cv-list li::before { content: "▸"; position: absolute; left: 0; color: #0d9488; }

        /* Skills */
        .cv-skills { display: flex; flex-wrap: wrap; gap: 6px; }
        .cv-skill-tag {
          font-size: 11px; font-family: monospace; padding: 3px 10px;
          border: 1px solid #cbd5e1; border-radius: 99px;
          color: #334155; background: #f8fafc;
        }
      `}</style>
    </>
  );
}
