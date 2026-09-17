"use client";

import { useState } from "react";
import Image from "next/image";
import { ResumeData } from "@/lib/resume-actions";
import { CVToolbar } from "./CVToolbar";
import { ExternalLink, Shield, CheckCircle2 } from "lucide-react";

interface CVDocumentViewerProps {
  initialFormat?: "ats" | "detailed";
  data: ResumeData;
}

export function CVDocumentViewer({ initialFormat = "ats", data }: CVDocumentViewerProps) {
  const [format, setFormat] = useState<"ats" | "detailed">(initialFormat);

  // Generate clean plain-text ATS copy for applicant tracking systems
  const generatePlainText = () => {
    const lines: string[] = [];
    lines.push(data.profile.name.toUpperCase());
    lines.push(data.profile.role);
    lines.push(
      [
        data.profile.location,
        data.profile.phone,
        data.contact.email,
        data.contact.linkedin.replace("https://", ""),
        data.contact.github.replace("https://", ""),
        data.contact.website?.replace("https://", ""),
      ]
        .filter(Boolean)
        .join(" | ")
    );
    lines.push("\n" + "=".repeat(60) + "\n");

    lines.push("PROFESSIONAL SUMMARY");
    lines.push("-".repeat(40));
    lines.push(data.profile.bio || "");
    lines.push("\n" + "=".repeat(60) + "\n");

    lines.push("CORE TECHNICAL COMPETENCIES");
    lines.push("-".repeat(40));
    if (data.skills_categorized) {
      Object.entries(data.skills_categorized).forEach(([category, skills]) => {
        lines.push(`${category.toUpperCase()}: ${skills.join(", ")}`);
      });
    } else {
      lines.push(data.skills.join(", "));
    }
    lines.push("\n" + "=".repeat(60) + "\n");

    lines.push("PROFESSIONAL EXPERIENCE");
    lines.push("-".repeat(40));
    data.experience.forEach((job) => {
      lines.push(`${job.title.toUpperCase()} | ${job.company}`);
      lines.push(`${job.period} | ${job.location}`);
      job.achievements.forEach((ach) => {
        lines.push(`• ${ach}`);
      });
      lines.push("");
    });
    lines.push("=".repeat(60) + "\n");

    if (data.projects && data.projects.length > 0) {
      lines.push("KEY ENGINEERING PROJECTS");
      lines.push("-".repeat(40));
      data.projects.forEach((proj) => {
        lines.push(`${proj.name.toUpperCase()} - ${proj.role} (${proj.period})`);
        lines.push(`URL: ${proj.url}`);
        lines.push(`Technologies: ${proj.tech}`);
        lines.push(`Description: ${proj.description}`);
        lines.push("");
      });
      lines.push("=".repeat(60) + "\n");
    }

    lines.push("EDUCATION");
    lines.push("-".repeat(40));
    data.education.forEach((edu) => {
      lines.push(`${edu.degree.toUpperCase()} | ${edu.school} (${edu.period})`);
    });
    lines.push("\n" + "=".repeat(60) + "\n");

    lines.push("CERTIFICATIONS & CREDENTIALS");
    lines.push("-".repeat(40));
    data.certifications.forEach((cert) => {
      lines.push(`• ${cert.name} - ${cert.issuer} (${cert.year})`);
    });

    if (data.badges && data.badges.length > 0) {
      lines.push("\nVERIFIED DIGITAL BADGES");
      lines.push("-".repeat(40));
      data.badges.forEach((b) => {
        lines.push(`• ${b.name} - ${b.issuer} (${b.year}) [${b.credential_url || "Verified"}]`);
      });
    }

    if (data.references && data.references.length > 0) {
      lines.push("\n" + "=".repeat(60) + "\n");
      lines.push("PROFESSIONAL REFERENCES");
      lines.push("-".repeat(40));
      data.references.forEach((r) => {
        lines.push(`${r.name} - ${r.title}, ${r.company}`);
        lines.push(`Relationship: ${r.relationship} | Email: ${r.email} | Phone: ${r.phone}`);
      });
    }

    return lines.join("\n");
  };

  const plainText = generatePlainText();

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-12 px-4 sm:px-6 transition-colors print:p-0 print:m-0 print:bg-white print:min-h-0">
      {/* Floating Toolbar */}
      <CVToolbar format={format} onFormatChange={setFormat} plainText={plainText} />

      {/* Render Document based on format */}
      <div className="max-w-[850px] mx-auto mt-12 mb-16 print:m-0 print:p-0 print:max-w-full">
        {format === "ats" ? (
          <ATSResumeView data={data} />
        ) : (
          <DetailedCVView data={data} />
        )}
      </div>

      {/* Print Specific CSS Rules */}
      <style jsx global>{`
        @media print {
          nav,
          header:not(.cv-header),
          footer,
          .no-print,
          [data-no-print] {
            display: none !important;
          }
          html,
          body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm 12mm 10mm 12mm;
          }
          .ats-document,
          .detailed-document {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
            width: 100% !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          .page-break-inside-avoid {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ==========================================================================
   1. ATS-FRIENDLY RESUME COMPONENT (Strict Single-Column, Clean Sans-Serif)
   ========================================================================== */
function ATSResumeView({ data }: { data: ResumeData }) {
  const contactParts = [
    data.profile.location,
    data.profile.phone,
    data.contact.email,
    data.contact.linkedin.replace("https://", ""),
    data.contact.github.replace("https://", ""),
    data.contact.website ? data.contact.website.replace("https://", "") : null,
  ].filter(Boolean);

  return (
    <div
      id="ats-resume-doc"
      className="ats-document bg-white text-slate-900 font-sans p-8 sm:p-12 shadow-xl rounded-lg border border-slate-200 transition-all leading-relaxed"
      style={{
        fontFamily: "Calibri, Arial, Helvetica, 'Segoe UI', sans-serif",
        fontSize: "10.5pt",
        color: "#111827",
      }}
    >
      {/* ATS Header (Single Column, strictly centered or left-aligned without floating elements) */}
      <header className="cv-header border-b-2 border-slate-800 pb-4 mb-5 text-center page-break-inside-avoid">
        <h1
          className="text-3xl font-extrabold tracking-tight uppercase text-slate-950"
          style={{ letterSpacing: "0.5px" }}
        >
          {data.profile.name}
        </h1>
        <p className="text-base font-bold text-slate-800 mt-1 uppercase tracking-wide">
          {data.profile.role}
        </p>
        <div className="text-xs text-slate-700 mt-2 font-medium flex flex-wrap justify-center gap-x-2 gap-y-1">
          {contactParts.map((part, idx) => (
            <span key={idx} className="inline-flex items-center">
              {idx > 0 && <span className="mx-1.5 text-slate-400">|</span>}
              <span>{part}</span>
            </span>
          ))}
        </div>
      </header>

      {/* Professional Summary */}
      {data.profile.bio && (
        <section className="mb-5 page-break-inside-avoid">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-950 border-b border-slate-400 pb-1 mb-2">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-justify text-[10pt] leading-normal text-slate-800">
            {data.profile.bio}
          </p>
        </section>
      )}

      {/* Core Technical Competencies */}
      <section className="mb-5 page-break-inside-avoid">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-950 border-b border-slate-400 pb-1 mb-2">
          CORE TECHNICAL COMPETENCIES
        </h2>
        <div className="space-y-1.5 text-[9.5pt]">
          {data.skills_categorized ? (
            Object.entries(data.skills_categorized).map(([cat, skills]) => (
              <div key={cat} className="flex flex-col sm:flex-row sm:items-baseline">
                <span className="font-bold text-slate-950 sm:w-48 shrink-0">
                  {cat}:
                </span>
                <span className="text-slate-800">{skills.join(", ")}</span>
              </div>
            ))
          ) : (
            <p className="text-slate-800">{data.skills.join(", ")}</p>
          )}
        </div>
      </section>

      {/* Professional Experience */}
      <section className="mb-5">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-950 border-b border-slate-400 pb-1 mb-3">
          PROFESSIONAL EXPERIENCE
        </h2>
        <div className="space-y-4">
          {data.experience.map((job, i) => (
            <div key={i} className="page-break-inside-avoid">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                <div>
                  <span className="font-extrabold text-slate-950 text-[10.5pt]">
                    {job.title}
                  </span>{" "}
                  <span className="font-medium text-slate-700 text-[10pt]">
                    — {job.company}
                  </span>
                </div>
                <div className="text-[9.5pt] font-semibold text-slate-600 sm:text-right">
                  {job.period} | {job.location}
                </div>
              </div>
              <ul className="list-disc ml-5 space-y-1 text-[9.5pt] text-slate-800 leading-snug">
                {job.achievements.filter(Boolean).map((ach, j) => (
                  <li key={j}>{ach}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Key Engineering Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-950 border-b border-slate-400 pb-1 mb-3">
            KEY ENGINEERING PROJECTS
          </h2>
          <div className="space-y-3">
            {data.projects.map((proj, i) => (
              <div key={i} className="page-break-inside-avoid text-[9.5pt]">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline font-bold text-slate-950">
                  <span>
                    {proj.name} —{" "}
                    <span className="font-normal text-slate-700">{proj.role}</span>
                  </span>
                  <span className="text-xs text-slate-600 font-normal">
                    {proj.period}
                  </span>
                </div>
                <div className="text-slate-600 text-[9pt] font-mono">
                  URL: {proj.url} | Stack: {proj.tech}
                </div>
                <p className="text-slate-800 text-[9.5pt] mt-0.5 leading-tight">
                  {proj.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      <section className="mb-5 page-break-inside-avoid">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-950 border-b border-slate-400 pb-1 mb-2">
          EDUCATION
        </h2>
        <div className="space-y-2">
          {data.education.map((edu, i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline text-[9.5pt]"
            >
              <div>
                <span className="font-bold text-slate-950">{edu.degree}</span>
                <span className="text-slate-700"> — {edu.school}</span>
              </div>
              <span className="text-slate-600 text-[9pt] font-medium">
                {edu.period}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications & Badges */}
      <section className="page-break-inside-avoid">
        <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-950 border-b border-slate-400 pb-1 mb-2">
          CERTIFICATIONS &amp; CREDENTIALS
        </h2>
        <ul className="list-disc ml-5 space-y-1 text-[9.5pt] text-slate-800">
          {data.certifications.map((cert, i) => (
            <li key={i}>
              <span className="font-bold text-slate-950">{cert.name}</span> —{" "}
              <span>{cert.issuer}</span> ({cert.year})
            </li>
          ))}
          {data.badges &&
            data.badges.map((b, i) => (
              <li key={`badge-${i}`}>
                <span className="font-bold text-slate-950">{b.name}</span> —{" "}
                <span>{b.issuer}</span> ({b.year})
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}

/* ==========================================================================
   2. DETAILED ENGINEERING CV DOSSIER (Full Technical Breakdown & References)
   ========================================================================== */
function DetailedCVView({ data }: { data: ResumeData }) {
  return (
    <div
      id="detailed-cv-doc"
      className="detailed-document bg-white text-slate-900 font-sans p-8 sm:p-14 shadow-2xl rounded-xl border border-slate-200 transition-all leading-relaxed"
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontSize: "10.5pt",
      }}
    >
      {/* Executive Header */}
      <header className="cv-header border-b-2 border-emerald-600 pb-6 mb-8 page-break-inside-avoid">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              {data.profile.name}
            </h1>
            <p className="text-lg font-bold text-emerald-700 mt-1">
              {data.profile.role}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive Engineering Dossier &amp; Curriculum Vitae
            </p>
          </div>

          <div className="text-xs sm:text-right space-y-1 text-slate-600 border-l-2 md:border-l-0 md:border-r-2 border-emerald-500/40 pl-3 md:pl-0 md:pr-3">
            <p>
              <span className="font-bold text-slate-900">Location:</span>{" "}
              {data.profile.location}
            </p>
            <p>
              <span className="font-bold text-slate-900">Phone:</span>{" "}
              {data.profile.phone}
            </p>
            <p>
              <span className="font-bold text-slate-900">Email:</span>{" "}
              <a
                href={`mailto:${data.contact.email}`}
                className="text-emerald-700 hover:underline"
              >
                {data.contact.email}
              </a>
            </p>
            <p>
              <span className="font-bold text-slate-900">LinkedIn:</span>{" "}
              <a
                href={data.contact.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:underline"
              >
                {data.contact.linkedin.replace("https://", "")}
              </a>
            </p>
            <p>
              <span className="font-bold text-slate-900">GitHub:</span>{" "}
              <a
                href={data.contact.github}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:underline"
              >
                {data.contact.github.replace("https://", "")}
              </a>
            </p>
            {data.contact.website && (
              <p>
                <span className="font-bold text-slate-900">Portfolio:</span>{" "}
                <a
                  href={data.contact.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 hover:underline"
                >
                  {data.contact.website.replace("https://", "")}
                </a>
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Executive Summary */}
      {data.profile.bio && (
        <section className="mb-8 page-break-inside-avoid">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Executive Profile &amp; Engineering Philosophy
            </h2>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-[10pt] text-slate-800 leading-relaxed text-justify">
            {data.profile.bio}
          </div>
        </section>
      )}

      {/* Comprehensive Skills Matrix */}
      <section className="mb-8 page-break-inside-avoid">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
            Technical Competencies &amp; Systems Architecture Matrix
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[9.5pt]">
          {data.skills_categorized ? (
            Object.entries(data.skills_categorized).map(([category, skills]) => (
              <div
                key={category}
                className="p-3.5 rounded-lg border border-slate-200 bg-white"
              >
                <h3 className="font-extrabold text-emerald-800 text-xs uppercase tracking-wider mb-1.5">
                  {category}
                </h3>
                <p className="text-slate-700 leading-relaxed">{skills.join(" • ")}</p>
              </div>
            ))
          ) : (
            <div className="p-3.5 rounded-lg border border-slate-200 bg-white md:col-span-2">
              <p className="text-slate-700 leading-relaxed">{data.skills.join(" • ")}</p>
            </div>
          )}
        </div>
      </section>

      {/* Professional Work Experience */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
            Professional Engineering &amp; IT Management Experience
          </h2>
        </div>
        <div className="space-y-6">
          {data.experience.map((job, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 page-break-inside-avoid"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-2 mb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {job.title}
                  </h3>
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                    {job.company} — {job.location}
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-white border border-slate-300 text-slate-700 mt-2 sm:mt-0">
                  {job.period}
                </span>
              </div>
              <ul className="space-y-2 text-[9.5pt] text-slate-700">
                {job.achievements.filter(Boolean).map((ach, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold mt-0.5">▸</span>
                    <span className="leading-snug">{ach}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Flagship Production Projects Case Studies */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Flagship Production Projects &amp; Systems Case Studies
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.projects.map((proj, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col justify-between page-break-inside-avoid shadow-xs"
              >
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-black text-slate-900 text-[10.5pt]">
                      {proj.name}
                    </h3>
                    <span className="text-[9pt] font-mono text-slate-500">
                      {proj.period}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-emerald-700 mb-2">
                    {proj.role}
                  </p>
                  <p className="text-[9.5pt] text-slate-700 mb-3 leading-snug">
                    {proj.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 text-xs">
                  <p className="text-[8.5pt] text-slate-500 mb-1">
                    <span className="font-bold text-slate-700">Stack:</span>{" "}
                    {proj.tech}
                  </p>
                  <a
                    href={proj.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:underline"
                  >
                    <span>{proj.url}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Badges Section */}
      <section className="mb-8 page-break-inside-avoid">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
            Professional Certifications &amp; Accreditations
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[9.5pt]">
          {data.certifications.map((cert, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 flex items-start justify-between gap-2"
            >
              <div>
                <p className="font-bold text-slate-900">{cert.name}</p>
                <p className="text-xs text-slate-600">{cert.issuer}</p>
              </div>
              <span className="text-xs font-mono text-slate-500 font-semibold shrink-0">
                {cert.year}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Dedicated Badges Section */}
      {data.badges && data.badges.length > 0 && (
        <section className="mb-8 page-break-inside-avoid">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Verified Digital &amp; Technical Badges
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {data.badges.map((b, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-slate-200 bg-white flex items-center gap-3 shadow-xs"
              >
                {b.image && (
                  <div className="w-12 h-12 shrink-0 relative rounded-lg border border-slate-200 bg-slate-50 p-1 flex items-center justify-center">
                    <img
                      src={b.image}
                      alt={b.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-slate-900 text-xs leading-tight truncate">
                    {b.name}
                  </p>
                  <p className="text-[10px] text-slate-500">{b.issuer} • {b.year}</p>
                  {b.credential_url && (
                    <a
                      href={b.credential_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:underline mt-0.5"
                    >
                      <Shield className="h-2.5 w-2.5" />
                      Verify Badge
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      <section className="mb-8 page-break-inside-avoid">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
            Education &amp; Academic Qualifications
          </h2>
        </div>
        <div className="space-y-3">
          {data.education.map((edu, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-white flex justify-between items-center text-[9.5pt]"
            >
              <div>
                <p className="font-bold text-slate-900">{edu.degree}</p>
                <p className="text-xs text-slate-600">{edu.school}</p>
              </div>
              <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {edu.period}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Professional References */}
      {data.references && data.references.length > 0 && (
        <section className="page-break-inside-avoid">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Professional &amp; Technical References
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {data.references.map((r, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between text-xs"
              >
                <div>
                  <p className="font-black text-slate-900 text-sm">{r.name}</p>
                  <p className="font-bold text-emerald-700 text-[11px] mt-0.5">
                    {r.title}
                  </p>
                  <p className="text-slate-600 text-[10.5px]">{r.company}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 italic">
                    {r.relationship}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-slate-200/80 space-y-0.5 text-[10.5px] text-slate-600 font-mono">
                  <p>✉ {r.email}</p>
                  <p>📞 {r.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
