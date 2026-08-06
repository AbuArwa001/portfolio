"use client";

import { useState, useEffect, useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User, Briefcase, GraduationCap, Code2, Award,
  Plus, Trash2, Save, ExternalLink, ChevronRight,
  CheckCircle2, AlertCircle, Printer, Quote
} from "lucide-react";
import { getResumeData, saveResumeData, ResumeData } from "@/lib/resume-actions";
import ReferencesTab from "./ReferencesTab";

type Tab = "profile" | "experience" | "education" | "skills" | "certifications" | "references";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
  { id: "experience", label: "Experience", icon: <Briefcase className="h-4 w-4" /> },
  { id: "education", label: "Education", icon: <GraduationCap className="h-4 w-4" /> },
  { id: "skills", label: "Skills", icon: <Code2 className="h-4 w-4" /> },
  { id: "certifications", label: "Certifications", icon: <Award className="h-4 w-4" /> },
  { id: "references", label: "References", icon: <Quote className="h-4 w-4" /> },
];

function Field({ label, value, onChange, type = "text", placeholder = "" }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-4 py-2.5 rounded-xl border border-border/60 bg-background text-foreground text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
      />
    </div>
  );
}

function Textarea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="px-4 py-2.5 rounded-xl border border-border/60 bg-background text-foreground text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-y"
      />
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [data, setData] = useState<ResumeData | null>(null);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Auth guard
  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin");
  }, [status, router]);

  // Load data
  useEffect(() => {
    if (status === "authenticated") {
      getResumeData().then(setData);
    }
  }, [status]);

  if (status === "loading" || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await saveResumeData(data);
      if (res.ok) showToast("success", "CV saved successfully!");
      else showToast("error", res.error || "Failed to save.");
    });
  };

  // ── Profile tab ──────────────────────────────────────────────────────────────
  const ProfileTab = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <Field label="Full Name" value={data.profile.name} onChange={(v) => setData({ ...data, profile: { ...data.profile, name: v } })} />
      <Field label="Role / Title" value={data.profile.role} onChange={(v) => setData({ ...data, profile: { ...data.profile, role: v } })} />
      <Field label="Avatar URL" value={data.profile.avatar} onChange={(v) => setData({ ...data, profile: { ...data.profile, avatar: v } })} type="url" placeholder="https://..." />
      <Field label="Location" value={data.profile.location || ""} onChange={(v) => setData({ ...data, profile: { ...data.profile, location: v } })} placeholder="Nairobi, Kenya" />
      <Field label="Phone" value={data.profile.phone || ""} onChange={(v) => setData({ ...data, profile: { ...data.profile, phone: v } })} placeholder="+254 ..." />
      <div className="md:col-span-2">
        <Textarea label="Bio / Summary" value={data.profile.bio || ""} onChange={(v) => setData({ ...data, profile: { ...data.profile, bio: v } })} />
      </div>
      <Field label="Email" value={data.contact.email} onChange={(v) => setData({ ...data, contact: { ...data.contact, email: v } })} type="email" />
      <Field label="LinkedIn URL" value={data.contact.linkedin} onChange={(v) => setData({ ...data, contact: { ...data.contact, linkedin: v } })} type="url" />
      <Field label="GitHub URL" value={data.contact.github} onChange={(v) => setData({ ...data, contact: { ...data.contact, github: v } })} type="url" />
      <Field label="Website" value={data.contact.website || ""} onChange={(v) => setData({ ...data, contact: { ...data.contact, website: v } })} type="url" placeholder="https://..." />
    </div>
  );

  // ── Experience tab ───────────────────────────────────────────────────────────
  const ExperienceTab = () => (
    <div className="flex flex-col gap-6">
      {data.experience.map((job, i) => (
        <div key={i} className="rounded-2xl border border-border/60 bg-background p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-primary/70 uppercase tracking-widest">Position #{i + 1}</span>
            <button onClick={() => {
              const exp = [...data.experience];
              exp.splice(i, 1);
              setData({ ...data, experience: exp });
            }} className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Job Title" value={job.title} onChange={(v) => { const exp = [...data.experience]; exp[i] = { ...exp[i], title: v }; setData({ ...data, experience: exp }); }} />
            <Field label="Company" value={job.company} onChange={(v) => { const exp = [...data.experience]; exp[i] = { ...exp[i], company: v }; setData({ ...data, experience: exp }); }} />
            <Field label="Period" value={job.period} onChange={(v) => { const exp = [...data.experience]; exp[i] = { ...exp[i], period: v }; setData({ ...data, experience: exp }); }} placeholder="2023 – Present" />
            <Field label="Location" value={job.location} onChange={(v) => { const exp = [...data.experience]; exp[i] = { ...exp[i], location: v }; setData({ ...data, experience: exp }); }} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Achievements (one per line)</label>
            <textarea
              rows={4}
              value={job.achievements.join("\n")}
              onChange={(e) => {
                const exp = [...data.experience];
                exp[i] = { ...exp[i], achievements: e.target.value.split("\n") };
                setData({ ...data, experience: exp });
              }}
              className="px-4 py-2.5 rounded-xl border border-border/60 bg-background text-foreground text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-y"
            />
          </div>
        </div>
      ))}
      <button
        onClick={() => setData({ ...data, experience: [...data.experience, { title: "", company: "", period: "", location: "", achievements: [""] }] })}
        className="flex items-center gap-2 px-5 py-3 rounded-xl border border-dashed border-primary/40 text-primary hover:bg-primary/5 transition-colors text-sm font-medium"
      >
        <Plus className="h-4 w-4" /> Add Position
      </button>
    </div>
  );

  // ── Education tab ─────────────────────────────────────────────────────────
  const EducationTab = () => (
    <div className="flex flex-col gap-6">
      {data.education.map((edu, i) => (
        <div key={i} className="rounded-2xl border border-border/60 bg-background p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-primary/70 uppercase tracking-widest">Entry #{i + 1}</span>
            <button onClick={() => { const ed = [...data.education]; ed.splice(i, 1); setData({ ...data, education: ed }); }} className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"><Trash2 className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="School / Institution" value={edu.school} onChange={(v) => { const ed = [...data.education]; ed[i] = { ...ed[i], school: v }; setData({ ...data, education: ed }); }} />
            <Field label="Degree / Qualification" value={edu.degree} onChange={(v) => { const ed = [...data.education]; ed[i] = { ...ed[i], degree: v }; setData({ ...data, education: ed }); }} />
            <Field label="Year / Period" value={edu.period} onChange={(v) => { const ed = [...data.education]; ed[i] = { ...ed[i], period: v }; setData({ ...data, education: ed }); }} placeholder="2018" />
          </div>
        </div>
      ))}
      <button onClick={() => setData({ ...data, education: [...data.education, { school: "", degree: "", period: "" }] })} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-dashed border-primary/40 text-primary hover:bg-primary/5 transition-colors text-sm font-medium">
        <Plus className="h-4 w-4" /> Add Education
      </button>
    </div>
  );

  // ── Skills tab ────────────────────────────────────────────────────────────
  const SkillsTab = () => (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">Enter each skill on its own line.</p>
      <textarea
        rows={12}
        value={data.skills.join("\n")}
        onChange={(e) => setData({ ...data, skills: e.target.value.split("\n").filter(Boolean) })}
        placeholder="Python (Django/DRF)&#10;TypeScript (Next.js)&#10;Networking (TCP/IP, Firewalls)&#10;..."
        className="px-4 py-3 rounded-xl border border-border/60 bg-background text-foreground text-sm font-mono focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-y"
      />
      <div className="flex flex-wrap gap-2 mt-2">
        {data.skills.filter(Boolean).map((s, i) => (
          <span key={i} className="text-xs font-mono px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">{s}</span>
        ))}
      </div>
    </div>
  );

  // ── Certifications tab ────────────────────────────────────────────────────
  const CertificationsTab = () => (
    <div className="flex flex-col gap-6">
      {data.certifications.map((cert, i) => (
        <div key={i} className="rounded-2xl border border-border/60 bg-background p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-primary/70 uppercase tracking-widest">Cert #{i + 1}</span>
            <button onClick={() => { const c = [...data.certifications]; c.splice(i, 1); setData({ ...data, certifications: c }); }} className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors"><Trash2 className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Certificate Name" value={cert.name} onChange={(v) => { const c = [...data.certifications]; c[i] = { ...c[i], name: v }; setData({ ...data, certifications: c }); }} />
            <Field label="Issuer" value={cert.issuer} onChange={(v) => { const c = [...data.certifications]; c[i] = { ...c[i], issuer: v }; setData({ ...data, certifications: c }); }} />
            <Field label="Year" value={cert.year} onChange={(v) => { const c = [...data.certifications]; c[i] = { ...c[i], year: v }; setData({ ...data, certifications: c }); }} placeholder="2023" />
          </div>
        </div>
      ))}
      <button onClick={() => setData({ ...data, certifications: [...data.certifications, { name: "", issuer: "", year: "" }] })} className="flex items-center gap-2 px-5 py-3 rounded-xl border border-dashed border-primary/40 text-primary hover:bg-primary/5 transition-colors text-sm font-medium">
        <Plus className="h-4 w-4" /> Add Certification
      </button>
    </div>
  );


  const CONTENT: Record<Tab, React.ReactNode> = {
    profile: <ProfileTab />,
    experience: <ExperienceTab />,
    education: <EducationTab />,
    skills: <SkillsTab />,
    certifications: <CertificationsTab />,
    references: <ReferencesTab />,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] opacity-10 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-blue-500/30 blur-[100px] rounded-full" />
      </div>

      <div className="container px-4 mx-auto pt-28 pb-24 max-w-5xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <span>Admin</span><ChevronRight className="h-3 w-3" /><span className="text-primary">CV Editor</span>
            </div>
            <h1 className="text-3xl font-extrabold font-heading">CV Editor</h1>
            <p className="text-muted-foreground text-sm mt-1">Welcome back, {session?.user?.name}. Edit and save your CV below.</p>
          </div>
          <div className="flex gap-3">
            <a
              href="/cv/print"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            >
              <Printer className="h-4 w-4" /> Preview CV
            </a>
            <a
              href="/resume"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/60 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            >
              <ExternalLink className="h-4 w-4" /> Live Résumé
            </a>
            <button
              onClick={handleSave}
              disabled={isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-[0_0_20px_-8px] shadow-primary/50"
            >
              {isPending ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </button>
          </div>
        </motion.div>

        {/* Toast */}
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl border mb-6 text-sm font-medium ${
              toast.type === "success"
                ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-400"
                : "bg-red-400/10 border-red-400/30 text-red-400"
            }`}
          >
            {toast.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {toast.msg}
          </motion.div>
        )}

        {/* Tab layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar tabs */}
          <nav className="lg:w-52 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible flex-shrink-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium text-left whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                {tab.icon}{tab.label}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="rounded-2xl border border-border/60 bg-card p-6 lg:p-8"
            >
              <h2 className="text-lg font-bold mb-6 capitalize flex items-center gap-2">
                {TABS.find((t) => t.id === activeTab)?.icon}
                {TABS.find((t) => t.id === activeTab)?.label}
              </h2>
              {CONTENT[activeTab]}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
