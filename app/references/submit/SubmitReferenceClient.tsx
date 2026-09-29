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
  Star,
  BadgeCheck,
  Globe,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { getApiUrl } from "@/lib/config";
import SubmissionProgressModal, { ProgressStage } from "./SubmissionProgressModal";

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

const inputCls =
  "w-full px-4 py-3 sm:py-2.5 rounded-xl border border-border/70 bg-background/50 text-base sm:text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 min-h-[44px] hover:border-border";

/* ─────────────────────────────────────────────────────────────────
   STEP DEFINITIONS
───────────────────────────────────────────────────────────────── */
const STEPS = [
  { label: "Your Details",   icon: UserCheck },
  { label: "Relationship",   icon: Briefcase },
  { label: "Endorsement",    icon: Quote     },
  { label: "Contact",        icon: Mail      },
];

/* ─────────────────────────────────────────────────────────────────
   STEP INDICATOR
───────────────────────────────────────────────────────────────── */
function StepIndicator({
  currentStep,
  completedSteps,
}: {
  currentStep: number;
  completedSteps: boolean[];
}) {
  return (
    <div className="flex items-center justify-center w-full max-w-lg mx-auto mb-8">
      {STEPS.map((step, idx) => {
        const Icon = step.icon;
        const isActive = idx === currentStep;
        const isDone   = completedSteps[idx];
        const isLast   = idx === STEPS.length - 1;

        return (
          <div key={idx} className="flex items-center flex-1 min-w-0">
            {/* Circle + label */}
            <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
              <motion.div
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                  isDone
                    ? "bg-primary/20 border-primary/40 text-primary"
                    : isActive
                    ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/30"
                    : "bg-card/60 border-border/50 text-muted-foreground"
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </motion.div>
              <span
                className={`text-[10px] font-semibold text-center leading-tight transition-colors duration-200 hidden sm:block ${
                  isActive ? "text-foreground" : isDone ? "text-primary/70" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {!isLast && (
              <div className="flex-1 mx-2 mt-[-14px] sm:mt-[-28px]">
                <div className="h-0.5 w-full bg-border/40 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-emerald-400"
                    animate={{ width: isDone ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────────── */
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

  const [currentStep, setCurrentStep] = useState(0);
  const [direction,   setDirection]   = useState(1); // 1 = fwd, -1 = back
  const [submitting,  setSubmitting]  = useState(false);
  const [submitted,   setSubmitted]   = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [mobileTab,   setMobileTab]   = useState<"form" | "preview">("form");

  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressStage,     setProgressStage]     = useState<ProgressStage>("validating");
  const [progressPercent,   setProgressPercent]   = useState(0);

  /* Pre-fill from URL query params */
  useEffect(() => {
    const qName    = searchParams.get("name")    || searchParams.get("referee") || "";
    const qEmail   = searchParams.get("email")   || "";
    const qCompany = searchParams.get("company") || "";
    const qTitle   = searchParams.get("title")   || "";
    setFormData((prev) => ({
      ...prev,
      name:    qName    || prev.name,
      email:   qEmail   || prev.email,
      company: qCompany || prev.company,
      title:   qTitle   || prev.title,
    }));
  }, [searchParams]);

  const normalizeUrl = (raw: string): string => {
    const t = raw.trim();
    if (!t) return "";
    if (t.startsWith("http://") || t.startsWith("https://")) return t;
    return `https://${t}`;
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  /* Per-step validation */
  const validateStep = (step: number): string | null => {
    if (step === 0) {
      if (!formData.name.trim())    return "Please provide your full name.";
      if (!formData.title.trim())   return "Please provide your job title.";
      if (!formData.company.trim()) return "Please provide your organization / company.";
    }
    if (step === 1) {
      if (!formData.relationship.trim())
        return "Please specify your professional relationship to Khalfan.";
    }
    if (step === 2) {
      if (!formData.quote.trim()) return "Please write a brief endorsement or quote.";
    }
    if (step === 3) {
      if (!formData.email.trim())
        return "Please provide your work or professional email.";
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(formData.email.trim()))
        return "Please enter a valid email address (e.g. referee@company.org).";
    }
    return null;
  };

  const goNext = () => {
    const err = validateStep(currentStep);
    if (err) { setError(err); return; }
    setError(null);
    setDirection(1);
    setCurrentStep((s) => s + 1);
  };

  const goBack = () => {
    setError(null);
    setDirection(-1);
    setCurrentStep((s) => s - 1);
  };

  const handleDismissModalError = () => {
    setShowProgressModal(false);
    setError(error || "Submission failed.");
  };

  const handleRetrySubmit = () => handleSubmit();

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    // Final guard: validate last step
    const lastErr = validateStep(3);
    if (lastErr) { setError(lastErr); return; }

    const payload = {
      ...formData,
      name:         formData.name.trim(),
      title:        formData.title.trim(),
      company:      formData.company.trim(),
      relationship: formData.relationship.trim(),
      quote:        formData.quote.trim(),
      email:        formData.email.trim(),
      phone:        formData.phone.trim(),
      linkedin:     normalizeUrl(formData.linkedin),
    };

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    setShowProgressModal(true);
    setProgressStage("validating");
    setProgressPercent(20);
    setSubmitting(true);
    setError(null);

    try {
      await sleep(350);
      setProgressStage("transmitting");
      setProgressPercent(60);

      const primaryUrl      = getApiUrl();
      const primaryEndpoint = `${primaryUrl}/api/v1/references/submit/`;
      const fallbackEndpoint = "https://api.khalfanathman.dev/api/v1/references/submit/";

      let res: Response;
      try {
        res = await fetch(primaryEndpoint, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify(payload),
        });
      } catch (primaryErr) {
        const isLocal = primaryUrl.includes("localhost") || primaryUrl.includes("127.0.0.1");
        if (isLocal)
          throw new Error(
            `Failed to reach local backend at ${primaryUrl}. Please ensure your Django server is running.`
          );
        if (primaryUrl !== "https://api.khalfanathman.dev") {
          res = await fetch(fallbackEndpoint, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(payload),
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
          else
            errMsg = Object.entries(errJson)
              .map(
                ([k, v]) =>
                  `${k.charAt(0).toUpperCase() + k.slice(1)}: ${Array.isArray(v) ? v.join(", ") : v}`
              )
              .join(" • ");
        } else {
          errMsg = `Server returned HTTP ${res.status}`;
        }
        throw new Error(errMsg);
      }

      setProgressStage("finalizing");
      setProgressPercent(90);
      await sleep(400);

      setProgressStage("success");
      setProgressPercent(100);
      await sleep(750);

      setShowProgressModal(false);
      setSubmitted(true);
    } catch (err: any) {
      const msg =
        err?.message || "Failed to submit your reference. Please check your network and try again.";
      setError(msg);
      setProgressStage("error");
    } finally {
      setSubmitting(false);
    }
  };

  /* Section completion flags */
  const sec1Done = !!(formData.name.trim() && formData.title.trim() && formData.company.trim());
  const sec2Done = !!formData.relationship.trim();
  const sec3Done = !!formData.quote.trim();
  const sec4Done = !!formData.email.trim();
  const completedSteps  = [sec1Done, sec2Done, sec3Done, sec4Done];
  const completedCount  = completedSteps.filter(Boolean).length;

  /* Slide animation variants */
  const slideVariants = {
    enter:  (dir: number) => ({ opacity: 0, x: dir * 48 }),
    center: { opacity: 1, x: 0 },
    exit:   (dir: number) => ({ opacity: 0, x: dir * -48 }),
  };

  /* ── JSX ── */
  return (
    <div className="relative min-h-screen bg-background selection:bg-primary/30 pt-24 pb-16 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      {/* Ambient blobs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[500px] opacity-[0.15] pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-[160px]" />
        <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-violet-600 rounded-full blur-[120px]" />
      </div>

      <div className="container max-w-6xl mx-auto">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <Link
            href="/references"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
          >
            <span className="w-7 h-7 rounded-lg bg-card/80 border border-border/60 flex items-center justify-center group-hover:border-primary/40 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
            </span>
            Back to References
          </Link>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ══════════════════ SUCCESS STATE ══════════════════ */}
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative rounded-3xl border border-primary/20 bg-card/80 backdrop-blur-2xl p-8 sm:p-12 text-center shadow-2xl overflow-hidden">
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 right-0 w-48 h-48 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping [animation-duration:2s] [animation-iteration-count:3]" />
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-emerald-400/20 border border-primary/30 flex items-center justify-center shadow-xl shadow-primary/10">
                    <CheckCircle2 className="w-12 h-12 text-primary" />
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20 mb-5">
                  <HeartHandshake className="w-3.5 h-3.5" /> Endorsement Received
                </span>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-4 font-heading">
                  Thank You,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
                    {formData.name || "Referee"}!
                  </span>
                </h2>

                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-8">
                  Your professional reference and testimonial have been successfully recorded. Khalfan
                  will review it and publish it on the portfolio — thank you for your time and support!
                </p>

                <div className="rounded-2xl border border-border/60 bg-muted/30 p-5 text-left mb-8 max-w-md mx-auto space-y-2">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-primary font-bold mb-3">
                    Submission Summary
                  </p>
                  {[
                    { label: "Name",         value: formData.name },
                    { label: "Role",         value: `${formData.title} at ${formData.company}` },
                    { label: "Relationship", value: formData.relationship },
                    { label: "Email",        value: formData.email },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-start gap-2 text-xs">
                      <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">{label}:</strong> {value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/references"
                    className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                  >
                    <Globe className="w-4 h-4" />
                    View Live References
                  </Link>
                  <Link
                    href="/"
                    className="px-6 py-3 rounded-xl border border-border/80 bg-background/80 hover:bg-muted font-semibold text-sm text-foreground transition-all flex items-center gap-2"
                  >
                    Explore Portfolio
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Link>
                </div>
              </div>
            </motion.div>

          ) : (
            /* ══════════════════ WIZARD FORM ══════════════════ */
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Page Header */}
              <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10 px-2">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-xs font-semibold text-primary bg-primary/10 rounded-full border border-primary/20"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Professional Endorsement Portal
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground mb-4 leading-tight font-heading"
                >
                  Referee{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-teal-400">
                    Endorsement
                  </span>{" "}
                  Form
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-sm sm:text-base text-muted-foreground leading-relaxed"
                >
                  Thank you for taking a moment to provide a verified professional testimonial for{" "}
                  <strong className="text-foreground">Khalfan Athman</strong>. Your feedback highlights
                  real-world technical impact and work ethic.
                </motion.p>

                {/* Trust bar */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap items-center justify-center gap-5 mt-6 text-[11px] text-muted-foreground"
                >
                  {[
                    { icon: ShieldCheck, text: "Secure & Encrypted" },
                    { icon: BadgeCheck,  text: "Admin Reviewed" },
                    { icon: Star,        text: "Publicly Showcased" },
                  ].map(({ icon: Icon, text }) => (
                    <span key={text} className="flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                      {text}
                    </span>
                  ))}
                </motion.div>
              </div>

              {/* Mobile tab toggle */}
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
                  1. Write Details
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
                  2. Live Preview
                  {formData.name.trim() && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  )}
                </button>
              </div>

              {/* ── Main two-column grid ── */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">

                {/* LEFT: wizard */}
                <div
                  id="endorsement-form-card"
                  className={`lg:col-span-7 ${mobileTab === "preview" ? "hidden lg:block" : "block"}`}
                >
                  {/* Step indicator */}
                  <StepIndicator currentStep={currentStep} completedSteps={completedSteps} />

                  {/* Error banner */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="flex items-start gap-3 p-4 mb-4 rounded-2xl border border-red-500/30 bg-red-500/[0.07] text-red-400 text-sm leading-relaxed"
                      >
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Step card */}
                  <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm overflow-hidden">
                    <AnimatePresence custom={direction} mode="wait">
                      <motion.div
                        key={currentStep}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="p-5 sm:p-6 min-h-[280px]"
                      >

                        {/* ── STEP 0: Your Details ── */}
                        {currentStep === 0 && (
                          <div className="space-y-5">
                            <div>
                              <h2 className="text-base font-bold text-foreground">Your Details</h2>
                              <p className="text-xs text-muted-foreground mt-0.5">Who you are and where you lead.</p>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-foreground">
                                  Full Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                  type="text"
                                  required
                                  autoFocus
                                  placeholder="e.g. Eng. Ahmed Salim"
                                  value={formData.name}
                                  onChange={(e) => handleChange("name", e.target.value)}
                                  className={inputCls}
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
                                  className={inputCls}
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
                                className={inputCls}
                              />
                            </div>
                          </div>
                        )}

                        {/* ── STEP 1: Professional Relationship ── */}
                        {currentStep === 1 && (
                          <div className="space-y-5">
                            <div>
                              <h2 className="text-base font-bold text-foreground">Professional Relationship</h2>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                In what capacity did you work with or supervise Khalfan?
                              </p>
                            </div>
                            <div className="space-y-3">
                              <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-foreground">
                                  Relationship Title <span className="text-red-400">*</span>
                                </label>
                                <input
                                  type="text"
                                  required
                                  autoFocus
                                  placeholder="e.g. Direct Supervisor, Project Director, or Lead Mentor"
                                  value={formData.relationship}
                                  onChange={(e) => handleChange("relationship", e.target.value)}
                                  className={inputCls}
                                />
                              </div>
                              <div>
                                <p className="text-[10px] text-muted-foreground mb-2 font-medium uppercase tracking-wider">
                                  Quick picks
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {RELATIONSHIP_PRESETS.map((preset) => (
                                    <button
                                      key={preset}
                                      type="button"
                                      onClick={() => handleChange("relationship", preset)}
                                      className={`text-[11px] px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer font-medium ${
                                        formData.relationship === preset
                                          ? "bg-primary/15 border-primary/50 text-primary shadow-sm shadow-primary/10"
                                          : "bg-muted/40 border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted hover:border-border"
                                      }`}
                                    >
                                      {preset}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ── STEP 2: Endorsement Quote ── */}
                        {currentStep === 2 && (
                          <div className="space-y-5">
                            <div>
                              <h2 className="text-base font-bold text-foreground">Endorsement &amp; Recommendation</h2>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Share your thoughts on Khalfan&apos;s technical expertise, problem solving, delivery, or communication.
                              </p>
                            </div>
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-foreground">
                                  Your Quote / Testimonial <span className="text-red-400">*</span>
                                </label>
                                <span
                                  className={`text-[10px] font-mono tabular-nums transition-colors ${
                                    formData.quote.length > 50 ? "text-primary" : "text-muted-foreground"
                                  }`}
                                >
                                  {formData.quote.length} chars
                                </span>
                              </div>
                              <textarea
                                rows={8}
                                required
                                autoFocus
                                placeholder="e.g. Khalfan engineered our national digital portal with remarkable reliability. His mastery of both network infrastructure and decoupled web applications delivered a system that effortlessly handled high concurrent loads..."
                                value={formData.quote}
                                onChange={(e) => handleChange("quote", e.target.value)}
                                className={`${inputCls} resize-y leading-relaxed min-h-[180px]`}
                              />
                            </div>
                          </div>
                        )}

                        {/* ── STEP 3: Contact Information ── */}
                        {currentStep === 3 && (
                          <div className="space-y-5">
                            <div>
                              <h2 className="text-base font-bold text-foreground">Contact Information</h2>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Used for professional verification and optional direct contact buttons.
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
                                  autoFocus
                                  placeholder="referee@company.org"
                                  value={formData.email}
                                  onChange={(e) => handleChange("email", e.target.value)}
                                  className={inputCls}
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-foreground">
                                  Phone Number{" "}
                                  <span className="text-muted-foreground text-[10px] font-normal">(optional)</span>
                                </label>
                                <input
                                  type="tel"
                                  placeholder="+254 7..."
                                  value={formData.phone}
                                  onChange={(e) => handleChange("phone", e.target.value)}
                                  className={inputCls}
                                />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-foreground">
                                LinkedIn Profile URL{" "}
                                <span className="text-muted-foreground text-[10px] font-normal">(optional)</span>
                              </label>
                              <input
                                type="text"
                                inputMode="url"
                                placeholder="e.g. linkedin.com/in/username or https://..."
                                value={formData.linkedin}
                                onChange={(e) => handleChange("linkedin", e.target.value)}
                                className={inputCls}
                              />
                            </div>

                            {/* Privacy notice */}
                            <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/15 text-[11px] text-muted-foreground leading-relaxed">
                              <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                              <span>
                                By submitting, you consent to having your name, title, company, and quote
                                showcased on Khalfan Athman&apos;s professional portfolio. Your endorsement is
                                held for administrative review before going live.
                              </span>
                            </div>
                          </div>
                        )}

                      </motion.div>
                    </AnimatePresence>

                    {/* ── Step navigation bar ── */}
                    <div className="flex items-center justify-between gap-3 px-5 sm:px-6 pb-5 sm:pb-6 border-t border-border/30 pt-4">
                      <button
                        type="button"
                        onClick={goBack}
                        disabled={currentStep === 0}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border/70 bg-background/60 hover:bg-muted text-sm font-semibold text-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                      </button>

                      <span className="text-[11px] text-muted-foreground font-mono tabular-nums">
                        {currentStep + 1} / {STEPS.length}
                      </span>

                      {currentStep < STEPS.length - 1 ? (
                        <button
                          type="button"
                          onClick={goNext}
                          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold transition-all shadow-md shadow-primary/20"
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <motion.button
                          type="button"
                          onClick={() => handleSubmit()}
                          disabled={submitting}
                          whileHover={{ scale: submitting ? 1 : 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary via-emerald-500 to-teal-500 hover:opacity-90 text-white font-bold text-sm shadow-lg shadow-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Submitting…
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Submit Endorsement
                            </>
                          )}
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT: Live Preview + progress */}
                <div
                  className={`lg:col-span-5 lg:sticky lg:top-28 space-y-4 ${
                    mobileTab === "form" ? "hidden lg:block" : "block"
                  }`}
                >
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 border border-border/60 text-xs font-mono text-muted-foreground w-fit">
                    <Eye className="w-3.5 h-3.5 text-primary" />
                    Live Portfolio Card Preview
                    {formData.name.trim() && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    This is an exact preview of how your reference will appear to prospective
                    clients, employers, and partners:
                  </p>

                  {/* Reference card preview */}
                  <motion.div
                    layout
                    className="relative rounded-2xl border border-border/70 bg-card/95 backdrop-blur-md p-6 shadow-xl overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/60 via-emerald-400/40 to-transparent rounded-t-2xl" />
                    <Quote className="absolute top-5 right-5 h-10 w-10 text-primary/8" />

                    <p className="text-sm text-muted-foreground leading-relaxed mb-6 italic min-h-[4rem] break-words pr-8">
                      &ldquo;
                      {formData.quote.trim() ||
                        "Your endorsement and recommendation quote will appear here as you type..."}
                      &rdquo;
                    </p>

                    <div className="h-px bg-gradient-to-r from-primary/25 via-border/40 to-transparent mb-5" />

                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[0]} flex items-center justify-center text-white text-base font-extrabold shadow-lg shrink-0`}
                      >
                        {getInitials(formData.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground text-sm leading-tight truncate">
                          {formData.name.trim() || (
                            <span className="text-muted-foreground font-normal italic">Your Name</span>
                          )}
                        </p>
                        <p className="text-xs text-primary font-medium mt-0.5 truncate">
                          {formData.title.trim() || (
                            <span className="text-muted-foreground font-normal italic">Job Title</span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Building2 className="h-3 w-3 shrink-0 text-primary/60" />
                          <span className="truncate">
                            {formData.company.trim() || <span className="italic">Company / Organisation</span>}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-0.5 flex items-center gap-1">
                          <UserCheck className="h-3 w-3 shrink-0 text-primary/50" />
                          <span className="truncate">
                            {formData.relationship.trim() || <span className="italic">Professional Relationship</span>}
                          </span>
                        </p>
                      </div>
                    </div>

                    {(formData.email || formData.phone || formData.linkedin) && (
                      <div className="flex flex-wrap gap-2.5 mt-5 pt-4 border-t border-border/40">
                        {formData.email && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground break-all">
                            <Mail className="h-3.5 w-3.5 shrink-0 text-primary/60" />
                            {formData.email}
                          </span>
                        )}
                        {formData.phone && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Phone className="h-3.5 w-3.5 shrink-0 text-primary/60" />
                            {formData.phone}
                          </span>
                        )}
                        {formData.linkedin && (
                          <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Linkedin className="h-3.5 w-3.5 shrink-0 text-primary/60" />
                            LinkedIn
                          </span>
                        )}
                      </div>
                    )}
                  </motion.div>

                  {/* Form progress tracker */}
                  <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 space-y-2.5">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                      Form Progress
                    </p>
                    {[
                      { label: "Personal Details",   done: sec1Done },
                      { label: "Relationship",        done: sec2Done },
                      { label: "Endorsement Quote",   done: sec3Done },
                      { label: "Contact Info",        done: sec4Done },
                    ].map(({ label, done }) => (
                      <div key={label} className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                            done
                              ? "bg-primary/20 border border-primary/40"
                              : "border border-border/60 bg-background/50"
                          }`}
                        >
                          {done && <CheckCircle2 className="w-3 h-3 text-primary" />}
                        </div>
                        <span
                          className={`text-xs transition-colors duration-300 flex-1 ${
                            done ? "text-foreground font-medium" : "text-muted-foreground"
                          }`}
                        >
                          {label}
                        </span>
                        {done && (
                          <span className="text-[10px] text-primary font-mono">&#10003; Done</span>
                        )}
                      </div>
                    ))}
                    <div className="pt-1">
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full"
                          animate={{ width: `${(completedCount / 4) * 100}%` }}
                          transition={{ ease: "easeOut", duration: 0.4 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Mobile: preview → back / submit */}
                  <div className="lg:hidden flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setMobileTab("form")}
                      className="flex-1 py-3 px-4 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back to Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSubmit()}
                      disabled={submitting || currentStep < STEPS.length - 1}
                      className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {submitting
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Send className="w-3.5 h-3.5" />
                      }
                      Submit Now
                    </button>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Submission progress modal */}
      <SubmissionProgressModal
        isOpen={showProgressModal}
        stage={progressStage}
        progress={progressPercent}
        errorMessage={error}
        refereeName={formData.name.trim()}
        onDismissError={handleDismissModalError}
        onRetry={handleRetrySubmit}
      />
    </div>
  );
}
