"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Mail,
  Linkedin,
  Github,
  Calendar,
  MapPin,
  ExternalLink,
  FileText,
  Layers,
  Copy,
  Check,
  Shield,
  Briefcase,
  Code2,
  GraduationCap,
  Award,
  Users,
  Terminal,
  Network,
} from "lucide-react";

// Section transition animations
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// Import JSON data
import resumeData from "./resume.json";

export default function ResumePage() {
  const [activeSection, setActiveSection] = useState("experience");
  const [copied, setCopied] = useState(false);

  // Generate clean plain-text ATS copy for applicant tracking systems
  const handleCopyATS = async () => {
    const lines: string[] = [];
    lines.push(resumeData.profile.name.toUpperCase());
    lines.push(resumeData.profile.role);
    lines.push(
      [
        resumeData.profile.location,
        resumeData.profile.phone,
        resumeData.contact.email,
        resumeData.contact.linkedin.replace("https://", ""),
        resumeData.contact.github.replace("https://", ""),
      ]
        .filter(Boolean)
        .join(" | ")
    );
    lines.push("\nPROFESSIONAL SUMMARY\n" + (resumeData.profile.bio || ""));
    lines.push("\nPROFESSIONAL EXPERIENCE\n");
    resumeData.experience.forEach((job) => {
      lines.push(`${job.title} | ${job.company} (${job.period})`);
      job.achievements.forEach((ach) => lines.push(`• ${ach}`));
      lines.push("");
    });
    if (resumeData.projects) {
      lines.push("KEY PROJECTS\n");
      resumeData.projects.forEach((p) => {
        lines.push(`${p.name} - ${p.role} (${p.period}): ${p.description}`);
      });
      lines.push("");
    }
    lines.push(
      "TECHNICAL SKILLS\n" +
        (resumeData.skills_categorized
          ? Object.entries(resumeData.skills_categorized)
              .map(([cat, s]) => `${cat}: ${s.join(", ")}`)
              .join("\n")
          : resumeData.skills.join(", "))
    );
    lines.push("\nEDUCATION\n");
    resumeData.education.forEach((e) => lines.push(`${e.degree} - ${e.school} (${e.period})`));
    lines.push("\nCERTIFICATIONS\n");
    resumeData.certifications.forEach((c) => lines.push(`• ${c.name} (${c.issuer}, ${c.year})`));

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const sections = [
    { id: "summary", label: "Executive Summary", icon: <FileText className="h-4 w-4" /> },
    { id: "experience", label: "Work Experience", icon: <Briefcase className="h-4 w-4" /> },
    { id: "projects", label: "Production Projects", icon: <Code2 className="h-4 w-4" /> },
    { id: "skills", label: "Skills Matrix", icon: <Terminal className="h-4 w-4" /> },
    { id: "certifications", label: "Certifications", icon: <Award className="h-4 w-4" /> },
    { id: "badges", label: "Digital Badges", icon: <Network className="h-4 w-4" /> },
    { id: "education", label: "Education", icon: <GraduationCap className="h-4 w-4" /> },
    { id: "references", label: "References", icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      {/* ===== Header ===== */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6 pb-8 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-semibold text-primary bg-primary/10 rounded-full border border-primary/20">
            <FileText className="w-3.5 h-3.5" />
            <span>Curriculum Vitae &amp; Resume</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Professional Resume &amp; CV
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 max-w-2xl">
            Download an ATS-friendly resume formatted for automated tracking systems,
            or access the comprehensive engineering CV dossier.
          </p>
        </div>

        {/* Download Action Hub */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* ATS Resume Download Button */}
          <a
            href="/cv/ats"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-[0_0_20px_-6px] shadow-emerald-600/50 transition-all hover:scale-[1.02]"
          >
            <Download className="h-4 w-4" />
            <span>Download ATS Resume</span>
            <span className="text-[10px] font-mono bg-emerald-700/80 px-1.5 py-0.5 rounded-full text-emerald-100">
              1-2 Pg
            </span>
          </a>

          {/* Detailed CV Download Button */}
          <a
            href="/cv/detailed"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-foreground text-white font-bold text-sm border border-slate-700/60 shadow-md transition-all hover:scale-[1.02]"
          >
            <Layers className="h-4 w-4 text-blue-400" />
            <span>Detailed Engineering CV</span>
            <span className="text-[10px] font-mono bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-full">
              Dossier
            </span>
          </a>

          {/* One-Click ATS Plain-Text Copy */}
          <button
            onClick={handleCopyATS}
            className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-border/80 bg-card hover:bg-accent text-xs font-semibold text-foreground transition-colors"
            title="Copy plain text formatted for applicant tracking systems (Jobvite, Workday, Taleo)"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-500 font-bold">Copied ATS Text!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Plain Text</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ===== Layout ===== */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* ===== Sidebar ===== */}
        <aside className="lg:w-1/4 space-y-6">
          {/* Profile Card */}
          <Card className="overflow-hidden text-center border-border/60 shadow-sm">
            <CardContent className="p-6">
              <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden border-2 border-primary/40 shadow-lg relative bg-accent/40 flex items-center justify-center">
                <Image
                  src={resumeData.profile.avatar}
                  alt={resumeData.profile.name}
                  width={96}
                  height={96}
                  className="object-cover"
                />
              </div>
              <h2 className="mt-4 text-lg font-bold text-foreground">
                {resumeData.profile.name}
              </h2>
              <Badge variant="secondary" className="mt-1 text-xs">
                {resumeData.profile.role}
              </Badge>
              <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
                <MapPin className="h-3 w-3" /> {resumeData.profile.location}
              </p>
            </CardContent>
          </Card>

          {/* Navigation Sections */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Sections
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-3">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeSection === sec.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                  }`}
                >
                  {sec.icon}
                  <span>{sec.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Contact Details */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                Contact &amp; Profiles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <a
                  href={`mailto:${resumeData.contact.email}`}
                  className="truncate hover:text-foreground transition-colors"
                >
                  {resumeData.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Linkedin className="h-4 w-4 text-primary shrink-0" />
                <a
                  href={resumeData.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  LinkedIn Profile
                </a>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Github className="h-4 w-4 text-primary shrink-0" />
                <a
                  href={resumeData.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  GitHub Repository
                </a>
              </div>
              {resumeData.contact.website && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ExternalLink className="h-4 w-4 text-primary shrink-0" />
                  <a
                    href={resumeData.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors"
                  >
                    Personal Portfolio
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </aside>

        {/* ===== Main Content Area ===== */}
        <main className="lg:w-3/4 space-y-6">
          <AnimatePresence mode="wait">
            {/* 1. Summary */}
            {activeSection === "summary" && (
              <motion.div
                key="summary"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Executive Summary &amp; Professional Philosophy
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {resumeData.profile.bio}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/40">
                      <div className="p-4 rounded-xl bg-accent/40 border border-border/50">
                        <p className="text-2xl font-black text-primary">6+ Years</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Enterprise IT &amp; Web Systems
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-accent/40 border border-border/50">
                        <p className="text-2xl font-black text-blue-500">4 Flagship</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Live National Deployments
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-accent/40 border border-border/50">
                        <p className="text-2xl font-black text-emerald-500">Dual Domain</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Networking &amp; Full-Stack Dev
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 2. Experience */}
            {activeSection === "experience" && (
              <motion.div
                key="experience"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-primary" />
                      Professional Work Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {resumeData.experience.map((job, i) => (
                      <div
                        key={i}
                        className="p-5 rounded-xl border border-border/60 bg-card hover:border-primary/40 transition-all shadow-xs"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 mb-2">
                          <h3 className="text-base font-bold text-foreground">
                            {job.title}
                          </h3>
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent text-muted-foreground">
                            {job.period}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-primary mb-3">
                          {job.company} · {job.location}
                        </p>
                        <ul className="space-y-2">
                          {job.achievements.map((ach, j) => (
                            <li
                              key={j}
                              className="text-xs sm:text-sm text-muted-foreground flex items-start gap-2.5 leading-relaxed"
                            >
                              <span className="text-primary font-bold mt-0.5">▸</span>
                              <span>{ach}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 3. Projects */}
            {activeSection === "projects" && (
              <motion.div
                key="projects"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Code2 className="h-5 w-5 text-primary" />
                      Flagship Production Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resumeData.projects?.map((proj, i) => (
                      <div
                        key={i}
                        className="p-5 rounded-xl border border-border/60 bg-card hover:border-primary/40 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="text-base font-bold text-foreground">
                              {proj.name}
                            </h3>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-accent text-muted-foreground">
                              {proj.period}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-primary mb-2">
                            {proj.role}
                          </p>
                          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                            {proj.description}
                          </p>
                        </div>
                        <div className="pt-3 border-t border-border/40 text-xs">
                          <p className="text-[11px] text-muted-foreground mb-2">
                            <span className="font-semibold text-foreground">Stack:</span>{" "}
                            {proj.tech}
                          </p>
                          <a
                            href={proj.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline text-xs"
                          >
                            <span>Live Platform</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 4. Skills */}
            {activeSection === "skills" && (
              <motion.div
                key="skills"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Terminal className="h-5 w-5 text-primary" />
                      Categorized Technical Skills Matrix
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {resumeData.skills_categorized &&
                      Object.entries(resumeData.skills_categorized).map(([cat, skills]) => (
                        <div key={cat}>
                          <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2.5">
                            {cat}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {skills.map((s, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="px-3 py-1 text-xs border border-border/50"
                              >
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 5. Certifications */}
            {activeSection === "certifications" && (
              <motion.div
                key="certifications"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Professional Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {resumeData.certifications.map((cert, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl border border-border/60 bg-card flex justify-between items-start"
                      >
                        <div>
                          <h3 className="text-sm font-bold text-foreground">
                            {cert.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {cert.issuer}
                          </p>
                        </div>
                        <span className="text-xs font-mono font-semibold text-primary">
                          {cert.year}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 6. Badges */}
            {activeSection === "badges" && (
              <motion.div
                key="badges"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Network className="h-5 w-5 text-primary" />
                      Verified Digital &amp; Network Badges
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {resumeData.badges?.map((badge, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl border border-border/60 bg-card hover:border-primary/40 transition-all flex items-center gap-4"
                      >
                        {badge.image && (
                          <div className="w-14 h-14 shrink-0 rounded-xl bg-background border border-border/60 p-1 flex items-center justify-center">
                            <img
                              src={badge.image}
                              alt={badge.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xs font-bold text-foreground leading-tight truncate">
                            {badge.name}
                          </h3>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {badge.issuer} · {badge.year}
                          </p>
                          {badge.credential_url && (
                            <a
                              href={badge.credential_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline mt-1"
                            >
                              <Shield className="h-3 w-3" />
                              Verify on Credly
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 7. Education */}
            {activeSection === "education" && (
              <motion.div
                key="education"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" />
                      Education &amp; Academic Background
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {resumeData.education.map((edu, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl border border-border/60 bg-card flex justify-between items-center"
                      >
                        <div>
                          <h3 className="text-sm font-bold text-foreground">
                            {edu.degree}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {edu.school}
                          </p>
                        </div>
                        <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-accent text-foreground">
                          {edu.period}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* 8. References */}
            {activeSection === "references" && (
              <motion.div
                key="references"
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Card className="border-border/60 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Professional References
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {resumeData.references?.map((r, i) => (
                      <div
                        key={i}
                        className="p-4 rounded-xl border border-border/60 bg-card flex flex-col justify-between"
                      >
                        <div>
                          <h3 className="text-sm font-bold text-foreground">
                            {r.name}
                          </h3>
                          <p className="text-xs font-semibold text-primary mt-0.5">
                            {r.title}
                          </p>
                          <p className="text-xs text-muted-foreground">{r.company}</p>
                          <p className="text-[11px] text-muted-foreground/80 italic mt-1">
                            {r.relationship}
                          </p>
                        </div>
                        <div className="pt-3 mt-3 border-t border-border/40 text-[11px] text-muted-foreground space-y-0.5">
                          <p>✉ {r.email}</p>
                          <p>📞 {r.phone}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
