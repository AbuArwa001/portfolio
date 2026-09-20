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
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");

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

  // Normalize LinkedIn / website URLs (auto-prefixes https:// if missing)
  const normalizeUrl = (raw: string): string => {
    const trimmed = raw.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    return `https://${trimmed}`;
  };

  const notifyError = (msg: string) => {
    setError(msg);
    setMobileTab("form");
    if (typeof window !== "undefined") {
      const el = document.getElementById("endorsement-form-card");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleChange = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    if (!formData.name.trim()) return notifyError("Please provide your full name.");
    if (!formData.title.trim()) return notifyError("Please provide your job title.");
    if (!formData.company.trim()) return notifyError("Please provide your organization / company.");
    if (!formData.relationship.trim()) return notifyError("Please specify your professional relationship to Khalfan.");
    if (!formData.quote.trim()) return notifyError("Please write a brief endorsement or quote.");
    if (!formData.email.trim()) return notifyError("Please provide your work or professional email.");

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      return notifyError("Please enter a valid email address (e.g. referee@company.org).");
    }

    const payload = {
      ...formData,
      name: formData.name.trim(),
      title: formData.title.trim(),
      company: formData.company.trim(),
      relationship: formData.relationship.trim(),
      quote: formData.quote.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      linkedin: normalizeUrl(formData.linkedin),
    };

    setSubmitting(true);
    setError(null);

    try {
      const primaryUrl = getApiUrl();
      const primaryEndpoint = `${primaryUrl}/api/v1/references/submit/`;
      const fallbackEndpoint = "https://api.khalfanathman.dev/api/v1/references/submit/";

      let res: Response;
      try {
        res = await fetch(primaryEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (primaryErr) {
        // If local dev server is offline and we aren't already targeting production, fallback to production backend
        if (primaryUrl !== "https://api.khalfanathman.dev") {
          res = await fetch(fallbackEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        } else {
          throw primaryErr;
        }
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        let errMsg = "Submission failed. Please verify your information.";
        if (errJson) {
          if (errJson.detail) errMsg = errJson.detail;
          else if (errJson.message) errMsg = errJson.message;
          else {
            errMsg = Object.entries(errJson)
              .map(
                ([k, v]) =>
                  `${k.charAt(0).toUpperCase() + k.slice(1)}: ${
                    Array.isArray(v) ? v.join(", ") : v
                  }`
              )
              .join(" • ");
          }
        } else {
          errMsg = `Server returned HTTP ${res.status}`;
        }
        throw new Error(errMsg);
      }

      setSubmitted(true);
    } catch (err: any) {
      notifyError(
        err?.message ||
          "Failed to submit your reference. Please check your network and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background selection:bg-primary/30 pt-24 pb-16 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[350px] sm:h-[450px] opacity-20 pointer-events-none -z-10 overflow-hidden">
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
              <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 px-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 sm:mb-4 text-xs font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Professional Endorsement Portal</span>
                </div>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-3 sm:mb-4 leading-tight">
                  Referee <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-400">Endorsement</span> Form
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                  Thank you for taking a moment to provide a verified professional testimonial for
                  <strong> Khalfan Athman</strong>. Your feedback highlights real-world technical impact and work ethic.
                </p>
              </div>

              {/* Mobile View Toggle (Visible only on < lg screens) */}
              <div className="lg:hidden flex items-center justify-center p-1 mb-6 rounded-2xl bg-card/90 backdrop-blur-md border border-border/80 max-w-sm mx-auto shadow-sm">
                <button
                  type="button"
                  onClick={() => setMobileTab("form")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    mobileTab === "form"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>1. Write Details</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMobileTab("preview")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    mobileTab === "preview"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>2. Live Preview</span>
                  {formData.name.trim() && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </button>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                {/* ── Left: The Form ── */}
                <div
                  id="endorsement-form-card"
                  className={`lg:col-span-7 rounded-3xl border border-border/60 bg-card/70 backdrop-blur-xl p-5 sm:p-8 shadow-xl ${
                    mobileTab === "preview" ? "hidden lg:block" : "block"
                  }`}
                >
                  <form onSubmit={handleSubmit} noValidate className="space-y-5 sm:space-y-6">
                    {/* Error Banner */}
                    {error && (
                      <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs leading-relaxed">
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
                            className="w-full px-3.5 py-3 sm:py-2.5 rounded-xl border border-border bg-background/60 text-base sm:text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[44px]"
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
                            className="w-full px-3.5 py-3 sm:py-2.5 rounded-xl border border-border bg-background/60 text-base sm:text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[44px]"
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
                          className="w-full px-3.5 py-3 sm:py-2.5 rounded-xl border border-border bg-background/60 text-base sm:text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[44px]"
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
                          className="w-full px-3.5 py-3 sm:py-2.5 rounded-xl border border-border bg-background/60 text-base sm:text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[44px]"
                        />
                      </div>

                      {/* Quick presets */}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                        <span className="text-[11px] text-muted-foreground self-center mr-1">Quick picks:</span>
                        {RELATIONSHIP_PRESETS.map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => handleChange("relationship", preset)}
                            className={`text-xs sm:text-[10px] px-3 py-1.5 sm:px-2.5 sm:py-1 rounded-full border transition-all cursor-pointer ${
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
                          className="w-full px-3.5 py-3 sm:py-2.5 rounded-xl border border-border bg-background/60 text-base sm:text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-y leading-relaxed min-h-[120px]"
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
                            className="w-full px-3.5 py-3 sm:py-2.5 rounded-xl border border-border bg-background/60 text-base sm:text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[44px]"
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
                            className="w-full px-3.5 py-3 sm:py-2.5 rounded-xl border border-border bg-background/60 text-base sm:text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[44px]"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          LinkedIn Profile URL <span className="text-muted-foreground text-[10px]">(optional)</span>
                        </label>
                        <input
                          type="text"
                          inputMode="url"
                          placeholder="e.g. linkedin.com/in/username or https://..."
                          value={formData.linkedin}
                          onChange={(e) => handleChange("linkedin", e.target.value)}
                          className="w-full px-3.5 py-3 sm:py-2.5 rounded-xl border border-border bg-background/60 text-base sm:text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all min-h-[44px]"
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

                    {/* Bottom Error Banner */}
                    {error && (
                      <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs leading-relaxed animate-shake">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-4 sm:py-3.5 px-6 rounded-2xl bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-700 text-white font-bold text-sm shadow-xl shadow-primary/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 min-h-[48px]"
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
                <div
                  className={`lg:col-span-5 lg:sticky lg:top-28 space-y-4 ${
                    mobileTab === "form" ? "hidden lg:block" : "block"
                  }`}
                >
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted/60 border border-border/60 text-xs font-mono text-muted-foreground w-fit">
                    <Eye className="w-3.5 h-3.5 text-primary" />
                    <span>Live Portfolio Card Preview</span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    This is an exact preview of how your reference will be showcased to prospective clients, employers, and partners:
                  </p>

                  {/* Rendered Reference Card */}
                  <div className="group relative flex flex-col rounded-2xl border border-border/80 bg-card/90 backdrop-blur-md p-5 sm:p-6 shadow-xl transition-all">
                    {/* Decorative quote mark */}
                    <Quote className="absolute top-5 right-5 h-8 w-8 text-primary/10" />

                    {/* Quote */}
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1 italic min-h-[4rem] break-words">
                      &ldquo;
                      {formData.quote.trim() ||
                        "Your endorsement and recommendation quote will appear here as you write it..."}
                      &rdquo;
                    </p>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-primary/25 via-border/40 to-transparent mb-5" />

                    {/* Referee info */}
                    <div className="flex items-start gap-3.5 sm:gap-4">
                      <div
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${AVATAR_COLORS[0]} flex items-center justify-center text-white text-base sm:text-lg font-extrabold shadow-lg shrink-0`}
                      >
                        {getInitials(formData.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground text-sm sm:text-base leading-tight truncate break-words">
                          {formData.name.trim() || "Your Name"}
                        </p>
                        <p className="text-xs sm:text-sm text-primary font-medium mt-0.5 truncate">
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
                      <div className="flex flex-wrap gap-2.5 sm:gap-3 mt-5 pt-4 border-t border-border/40">
                        {formData.email && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground break-all">
                            <Mail className="h-3.5 w-3.5 shrink-0" />
                            {formData.email}
                          </span>
                        )}
                        {formData.phone && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground">
                            <Phone className="h-3.5 w-3.5 shrink-0" />
                            {formData.phone}
                          </span>
                        )}
                        {formData.linkedin && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground">
                            <Linkedin className="h-3.5 w-3.5 shrink-0" />
                            LinkedIn
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Mobile Quick Action Pills in Preview Mode */}
                  <div className="lg:hidden flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setMobileTab("form")}
                      className="flex-1 py-3 px-4 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSubmit()}
                      disabled={submitting}
                      className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {submitting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>Submit Now</span>
                    </button>
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
