"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Quote,
  Briefcase,
  Mail,
  Phone,
  Linkedin,
  Building2,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Sparkles,
  Send,
  Eye,
  ShieldCheck,
  HeartHandshake,
} from "lucide-react";
import { getApiUrl } from "@/lib/config";

const RELATIONSHIP_PRESETS = [
  "Direct Supervisor",
  "Project Director & Technical Overseer",
  "Lead Architect",
  "Senior Client / Executive",
  "Technical Mentor",
  "Senior Engineering Colleague",
  "Administrative Supervisor",
];

const AVATAR_COLORS = [
  "from-indigo-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-sky-500 to-blue-600",
  "from-violet-500 to-fuchsia-600",
];

function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length >= 2 && parts[0] && parts[parts.length - 1]) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return (parts[0]?.[0] ?? "?").toUpperCase();
}

export default function SubmitReferenceClient() {
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    company: "",
    relationship: "",
    quote: "",
    email: "",
    phone: "",
    linkedin: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill from query params if Khalfan provided them in the invite link
  useEffect(() => {
    const qName = searchParams.get("name") || searchParams.get("referee") || "";
    const qEmail = searchParams.get("email") || "";
    const qCompany = searchParams.get("company") || "";
    const qTitle = searchParams.get("title") || "";

    setFormData((prev) => ({
      ...prev,
      name: qName || prev.name,
      email: qEmail || prev.email,
      company: qCompany || prev.company,
      title: qTitle || prev.title,
    }));
  }, [searchParams]);

  const handleChange = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return setError("Please provide your full name.");
    if (!formData.title.trim()) return setError("Please provide your job title.");
    if (!formData.company.trim()) return setError("Please provide your organization / company.");
    if (!formData.relationship.trim()) return setError("Please specify your professional relationship to Khalfan.");
    if (!formData.quote.trim()) return setError("Please write a brief endorsement or quote.");
    if (!formData.email.trim()) return setError("Please provide your work or professional email.");

    setSubmitting(true);
    setError(null);

    try {
      const endpoint = `${getApiUrl()}/api/v1/references/submit/`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        const errMsg =
          errJson?.detail ||
          errJson?.message ||
          (errJson ? Object.values(errJson).flat().join(" ") : `Server returned HTTP ${res.status}`);
        throw new Error(errMsg);
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || "Failed to submit your reference. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background selection:bg-primary/30 py-28 px-4 sm:px-6">
      {/* Ambient background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] opacity-20 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/40 via-primary/30 to-sky-500/20 blur-[130px] rounded-full" />
      </div>

      <div className="container max-w-6xl mx-auto">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/references"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to References</span>
          </Link>
        </div>

        {/* ── Success State ── */}
        <AnimatePresence>
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl mx-auto rounded-3xl border border-primary/30 bg-card/80 backdrop-blur-xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 mx-auto flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20 mb-4">
                <HeartHandshake className="w-3.5 h-3.5" /> Endorsement Received
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4">
                Thank You, {formData.name || "Referee"}!
              </h2>

              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-8">
                Your professional reference and testimonial have been successfully recorded. Khalfan
                will review it and publish it on the portfolio. Thank you for your support and partnership!
              </p>

              <div className="rounded-2xl border border-border/60 bg-muted/30 p-5 text-left mb-8 max-w-md mx-auto">
                <p className="text-xs font-mono uppercase tracking-wider text-primary font-semibold mb-2">
                  Submission Summary
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><strong className="text-foreground">Role:</strong> {formData.title} at {formData.company}</p>
                  <p><strong className="text-foreground">Relationship:</strong> {formData.relationship}</p>
                  <p><strong className="text-foreground">Email:</strong> {formData.email}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/references"
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs transition-all shadow-md shadow-primary/20"
                >
                  View Live References
                </Link>
                <Link
                  href="/"
                  className="px-6 py-3 rounded-xl border border-border/80 bg-background/80 hover:bg-muted font-semibold text-xs text-foreground transition-all"
                >
                  Explore Portfolio Home
                </Link>
              </div>
            </motion.div>
          ) : (
            /* ── Form + Live Preview Grid ── */
            <div>
              {/* Header */}
              <div className="text-center max-w-2xl mx-auto mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-xs font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Professional Endorsement Portal</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                  Referee <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-400">Endorsement</span> Form
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Thank you for taking a moment to provide a verified professional testimonial for
                  <strong> Khalfan Athman</strong>. Your feedback highlights real-world technical impact and work ethic.
                </p>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* ── Left: The Form ── */}
                <div className="lg:col-span-7 rounded-3xl border border-border/60 bg-card/70 backdrop-blur-xl p-6 sm:p-8 shadow-xl">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Banner */}
                    {error && (
                      <div className="flex items-start gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs leading-relaxed">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Personal & Role */}
                    <div className="space-y-4">
                      <div className="border-b border-border/40 pb-2">
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-primary" />
                          <span>1. Your Details</span>
                        </h3>
                        <p className="text-[11px] text-muted-foreground">Who you are and where you lead.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground">
                            Full Name <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Eng. Ahmed Salim"
                            value={formData.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background/60 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground">
                            Job Title / Designation <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Lead Infrastructure Architect"
                            value={formData.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background/60 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          Organization / Company <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. SUPKEM ICT Directorate or Jamia Mosque Committee"
                          value={formData.company}
                          onChange={(e) => handleChange("company", e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background/60 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>

                    {/* Professional Relationship */}
                    <div className="space-y-4 pt-2">
                      <div className="border-b border-border/40 pb-2">
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-primary" />
                          <span>2. Professional Relationship</span>
                        </h3>
                        <p className="text-[11px] text-muted-foreground">In what capacity did you work with or supervise Khalfan?</p>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground">
                          Relationship Title <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Direct Supervisor, Project Director, or Lead Mentor"
                          value={formData.relationship}
                          onChange={(e) => handleChange("relationship", e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background/60 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>

                      {/* Quick presets */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="text-[10px] text-muted-foreground self-center mr-1">Quick picks:</span>
                        {RELATIONSHIP_PRESETS.map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => handleChange("relationship", preset)}
                            className={`text-[10px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                              formData.relationship === preset
                                ? "bg-primary/20 border-primary text-primary font-semibold"
                                : "bg-muted/40 border-border/60 text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Recommendation Quote */}
                    <div className="space-y-4 pt-2">
                      <div className="border-b border-border/40 pb-2">
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                          <Quote className="w-4 h-4 text-primary" />
                          <span>3. Endorsement &amp; Recommendation</span>
                        </h3>
                        <p className="text-[11px] text-muted-foreground">
                          Share your thoughts on Khalfan&apos;s technical expertise, problem solving, delivery, or communication.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground flex justify-between items-center">
                          <span>Your Quote / Testimonial <span className="text-red-400">*</span></span>
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {formData.quote.length} characters
                          </span>
                        </label>
                        <textarea
                          rows={4}
                          required
                          placeholder="e.g. Khalfan engineered our national digital portal with remarkable reliability. His mastery of both network infrastructure and decoupled web applications delivered a system that effortlessly handled high concurrent loads..."
                          value={formData.quote}
                          onChange={(e) => handleChange("quote", e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background/60 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-y leading-relaxed"
                        />
                      </div>
                    </div>

                    {/* Contact & Verification */}
                    <div className="space-y-4 pt-2">
                      <div className="border-b border-border/40 pb-2">
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          <span>4. Contact Information</span>
                        </h3>
                        <p className="text-[11px] text-muted-foreground">
                          Used for professional verification and optional direct referee contact buttons.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground">
                            Work / Professional Email <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="email"
                            required
                            placeholder="referee@company.org"
                            value={formData.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background/60 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-foreground">
                            Phone Number <span className="text-muted-foreground text-[10px]">(optional)</span>
                          </label>
                          <input
                            type="tel"
                            placeholder="+254 7..."
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background/60 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          LinkedIn Profile URL <span className="text-muted-foreground text-[10px]">(optional)</span>
                        </label>
                        <input
                          type="url"
                          placeholder="https://linkedin.com/in/..."
                          value={formData.linkedin}
                          onChange={(e) => handleChange("linkedin", e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background/60 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                      </div>
                    </div>

                    {/* Privacy notice */}
                    <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-muted/40 border border-border/50 text-[11px] text-muted-foreground leading-relaxed">
                      <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>
                        By submitting, you consent to having your name, title, company, and quote showcased on Khalfan Athman&apos;s professional portfolio. Your endorsement is held for administrative review before going live.
                      </span>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-700 text-white font-bold text-sm shadow-xl shadow-primary/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Submitting Endorsement...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Professional Endorsement</span>
                        </>
                      )}
                    </button>
                  </form>
                </div>

                {/* ── Right: Live Preview Card ── */}
                <div className="lg:col-span-5 sticky top-28 space-y-4">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/60 border border-border/60 text-xs font-mono text-muted-foreground w-fit">
                    <Eye className="w-3.5 h-3.5 text-primary" />
                    <span>Live Portfolio Card Preview</span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    This is an exact preview of how your reference will be showcased to prospective clients, employers, and partners:
                  </p>

                  {/* Rendered Reference Card */}
                  <div className="group relative flex flex-col rounded-2xl border border-border/80 bg-card/90 backdrop-blur-md p-6 shadow-xl transition-all">
                    {/* Decorative quote mark */}
                    <Quote className="absolute top-5 right-5 h-8 w-8 text-primary/10" />

                    {/* Quote */}
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1 italic min-h-[4rem]">
                      &ldquo;
                      {formData.quote.trim() ||
                        "Your endorsement and recommendation quote will appear here as you write it..."}
                      &rdquo;
                    </p>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-primary/25 via-border/40 to-transparent mb-5" />

                    {/* Referee info */}
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${AVATAR_COLORS[0]} flex items-center justify-center text-white text-lg font-extrabold shadow-lg shrink-0`}
                      >
                        {getInitials(formData.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground text-base leading-tight truncate">
                          {formData.name.trim() || "Your Name"}
                        </p>
                        <p className="text-sm text-primary font-medium mt-0.5 truncate">
                          {formData.title.trim() || "Job Title"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Building2 className="h-3 w-3 shrink-0" />
                          <span className="truncate">{formData.company.trim() || "Company / Organisation"}</span>
                        </p>
                        <p className="text-xs text-muted-foreground/80 mt-0.5 flex items-center gap-1">
                          <UserCheck className="h-3 w-3 shrink-0" />
                          <span className="truncate">{formData.relationship.trim() || "Professional Relationship"}</span>
                        </p>
                      </div>
                    </div>

                    {/* Contact links preview */}
                    {(formData.email || formData.phone || formData.linkedin) && (
                      <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-border/40">
                        {formData.email && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mail className="h-3.5 w-3.5" />
                            {formData.email}
                          </span>
                        )}
                        {formData.phone && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Phone className="h-3.5 w-3.5" />
                            {formData.phone}
                          </span>
                        )}
                        {formData.linkedin && (
                          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Linkedin className="h-3.5 w-3.5" />
                            LinkedIn
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
