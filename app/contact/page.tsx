"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Linkedin,
  Github,
  MessageSquare,
  Paperclip,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Clock,
  ExternalLink,
} from "lucide-react";

/* ── shared input style ─────────────────────────────────────── */
const inputCls =
  "w-full px-4 py-3 rounded-xl border border-border/60 bg-background/50 " +
  "text-sm text-foreground placeholder:text-muted-foreground/40 " +
  "focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 " +
  "transition-all duration-200 hover:border-border/80 min-h-[44px]";

/* ── field wrapper with floating error ──────────────────────── */
function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-foreground">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-[11px] text-red-400 flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3 shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── sidebar info row ───────────────────────────────────────── */
function InfoRow({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-start gap-3.5 p-3.5 rounded-xl hover:bg-primary/5 transition-colors duration-200 group">
      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/15 transition-colors">
        <Icon className="w-3.5 h-3.5 text-primary" />
      </div>
      <div>
        <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-medium text-foreground mt-0.5 group-hover:text-primary transition-colors">
          {value}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return inner;
}

/* ════════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════════ */
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setIsMounted(true); }, []);

  /* ── validation ── */
  const validateForm = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim())    e.name    = "Name is required";
    if (!formData.email.trim())   e.email   = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
                                  e.email   = "Please enter a valid email";
    if (!formData.subject.trim()) e.subject = "Subject is required";
    if (!formData.message.trim()) e.message = "Message is required";
    else if (formData.message.length < 10)
                                  e.message = "Message should be at least 10 characters";
    if (attachments.length > 0) {
      const total = attachments.reduce((s, f) => s + f.size, 0);
      if (total > 10 * 1024 * 1024) e.attachments = "Total attachments cannot exceed 10 MB";
      for (const f of attachments)
        if (f.size > 5 * 1024 * 1024) { e.attachments = "Individual files cannot exceed 5 MB"; break; }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    if (submitError)  setSubmitError("");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const next = Array.from(files).filter(
      (f) => !attachments.some((a) => a.name === f.name && a.size === f.size)
    );
    setAttachments((p) => [...p, ...next]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (i: number) =>
    setAttachments((p) => p.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const fd = new FormData();
      fd.append("name",    formData.name);
      fd.append("email",   formData.email);
      fd.append("subject", formData.subject);
      fd.append("message", formData.message);
      attachments.forEach((f) => fd.append("attachments", f));

      const res  = await fetch("/api/contact", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to send message");

      setIsSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setAttachments([]);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── loading skeleton ── */
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  /* ── page ── */
  return (
    <div className="relative min-h-screen bg-background selection:bg-primary/30 pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-x-hidden">

      {/* Ambient blobs */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[600px] opacity-[0.12] pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary rounded-full blur-[160px]" />
        <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-violet-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 w-[200px] h-[200px] bg-emerald-500 rounded-full blur-[100px]" />
      </div>

      <div className="container max-w-6xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 text-xs font-semibold text-primary bg-primary/10 rounded-full border border-primary/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Open to Opportunities &amp; Collaboration
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4 leading-tight font-heading">
            Let&apos;s{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-teal-400">
              Connect
            </span>
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Have a project, opportunity, or idea? Drop me a message and I&apos;ll
            get back to you — usually within 24 hours.
          </p>
        </motion.div>

        {/* ── Two-column grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── LEFT: Sidebar ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-4 space-y-4 lg:sticky lg:top-28"
          >
            {/* Contact info card */}
            <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md p-5 shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/60 via-emerald-400/30 to-transparent rounded-t-2xl" />
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary mb-4">
                Contact Information
              </p>
              <div className="space-y-1">
                <InfoRow
                  icon={Mail}
                  label="Email"
                  value="khalfan@khalfanathman.dev"
                  href="mailto:khalfan@khalfanathman.dev"
                />
                <InfoRow
                  icon={Phone}
                  label="Phone"
                  value="+254 719 401 851"
                  href="tel:+254719401851"
                />
                <InfoRow
                  icon={MapPin}
                  label="Location"
                  value="Nairobi, Kenya"
                />
              </div>
            </div>

            {/* Social links card */}
            <div className="rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md p-5 shadow-xl">
              <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-primary mb-4">
                Connect Online
              </p>
              <div className="space-y-2.5">
                {[
                  {
                    icon: Linkedin,
                    label: "LinkedIn",
                    handle: "@khalfaniathman",
                    href: "https://www.linkedin.com/in/khalfaniathman",
                    color: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
                    iconColor: "text-blue-400",
                  },
                  {
                    icon: Github,
                    label: "GitHub",
                    handle: "@AbuArwa001",
                    href: "https://github.com/AbuArwa001",
                    color: "from-zinc-500/20 to-zinc-600/10 border-zinc-500/30",
                    iconColor: "text-zinc-400",
                  },
                ].map(({ icon: Icon, label, handle, href, color, iconColor }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-3.5 rounded-xl border bg-gradient-to-r ${color} hover:opacity-90 transition-all duration-200 group`}
                  >
                    <Icon className={`w-4 h-4 ${iconColor} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground">{label}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{handle}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                  </a>
                ))}
              </div>
            </div>

            {/* Response time card */}
            <div className="rounded-2xl border border-border/50 bg-primary/5 border-primary/20 p-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Quick Response</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    I typically reply within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-8"
          >
            <div className="relative rounded-2xl border border-border/60 bg-card/70 backdrop-blur-md shadow-2xl overflow-hidden">
              {/* Top gradient stripe */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/70 via-emerald-400/50 to-teal-400/30" />

              <div className="p-6 sm:p-8">
                {/* Card header */}
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-foreground">Send Me a Message</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">All fields marked * are required</p>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {/* ── SUCCESS STATE ── */}
                  {isSubmitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="py-12 text-center"
                    >
                      <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping [animation-duration:2s] [animation-iteration-count:3]" />
                        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-emerald-400/20 border border-primary/30 flex items-center justify-center shadow-xl shadow-primary/10">
                          <CheckCircle2 className="w-10 h-10 text-primary" />
                        </div>
                      </div>

                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20 mb-5">
                        Message Delivered
                      </span>

                      <h3 className="text-2xl font-extrabold text-foreground mb-3 font-heading">
                        Message Sent!
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mx-auto mb-8">
                        Thanks for reaching out. I&apos;ll review your message and get
                        back to you as soon as possible — usually within 24 hours.
                      </p>
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-border/80 bg-background/80 hover:bg-muted text-sm font-semibold text-foreground transition-all"
                      >
                        <MessageSquare className="w-4 h-4" />
                        Send Another Message
                      </button>
                    </motion.div>

                  ) : (
                    /* ── FORM ── */
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      noValidate
                      className="space-y-5"
                    >
                      {/* Submit error */}
                      <AnimatePresence>
                        {submitError && (
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            className="flex items-start gap-3 p-4 rounded-2xl border border-red-500/30 bg-red-500/[0.07] text-red-400 text-sm"
                          >
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{submitError}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Name + Email row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Full Name" error={errors.name} required>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            autoFocus
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Ahmed Salim"
                            className={`${inputCls} ${errors.name ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                          />
                        </Field>
                        <Field label="Email Address" error={errors.email} required>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className={`${inputCls} ${errors.email ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                          />
                        </Field>
                      </div>

                      {/* Subject */}
                      <Field label="Subject" error={errors.subject} required>
                        <input
                          id="subject"
                          name="subject"
                          type="text"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="What is this regarding?"
                          className={`${inputCls} ${errors.subject ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                        />
                      </Field>

                      {/* Message */}
                      <Field label="Message" error={errors.message} required>
                        <textarea
                          id="message"
                          name="message"
                          rows={6}
                          maxLength={500}
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Tell me how I can help you..."
                          className={`${inputCls} resize-y leading-relaxed min-h-[140px] ${errors.message ? "border-red-500/60 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                        />
                        <div className="flex justify-end mt-1">
                          <span
                            className={`text-[10px] font-mono tabular-nums transition-colors ${
                              formData.message.length > 450 ? "text-amber-400" : "text-muted-foreground"
                            }`}
                          >
                            {formData.message.length} / 500
                          </span>
                        </div>
                      </Field>

                      {/* Attachments */}
                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-foreground">
                          Attachments{" "}
                          <span className="text-muted-foreground font-normal">(optional · max 5 MB / file)</span>
                        </label>

                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          onChange={handleFileSelect}
                          className="hidden"
                          id="attachments"
                        />

                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border/70 bg-background/60 hover:bg-muted text-xs font-semibold text-foreground transition-all duration-200"
                        >
                          <Paperclip className="w-3.5 h-3.5 text-primary" />
                          Add Files
                        </button>

                        <AnimatePresence>
                          {errors.attachments && (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="text-[11px] text-red-400 flex items-center gap-1"
                            >
                              <AlertCircle className="w-3 h-3" />
                              {errors.attachments}
                            </motion.p>
                          )}
                        </AnimatePresence>

                        {attachments.length > 0 && (
                          <div className="space-y-2 mt-2">
                            {attachments.map((file, i) => (
                              <motion.div
                                key={`${file.name}-${i}`}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 8 }}
                                className="flex items-center justify-between px-3 py-2 rounded-xl border border-border/50 bg-muted/40 text-xs"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <Paperclip className="w-3.5 h-3.5 text-primary/60 shrink-0" />
                                  <span className="truncate text-foreground font-medium max-w-[200px]">
                                    {file.name}
                                  </span>
                                  <span className="text-muted-foreground shrink-0">
                                    ({(file.size / 1024).toFixed(0)} KB)
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeAttachment(i)}
                                  className="w-5 h-5 rounded-md hover:bg-red-500/15 flex items-center justify-center text-muted-foreground hover:text-red-400 transition-colors shrink-0 ml-2"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Submit */}
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-primary via-emerald-500 to-teal-500 hover:opacity-90 text-white font-bold text-sm shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed min-h-[50px]"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Sending…
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Send Message
                          </>
                        )}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
