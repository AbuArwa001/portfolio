"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Linkedin,
  Mail,
  Phone,
  Building2,
  User,
  Quote,
  ExternalLink,
  Plus,
  Star,
} from "lucide-react";
import Link from "next/link";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Reference {
  id: number;
  name: string;
  title: string;
  company: string;
  relationship: string;
  quote: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  avatar?: string; // initials fallback if no image
  avatarColor: string;
  featured?: boolean;
}

// ─── Data ──────────────────────────────────────────────────────────────────────
// TODO: Replace placeholder data with your real references
const REFERENCES: Reference[] = [
  {
    id: 1,
    name: "— Add Reference —",
    title: "Senior Manager / Director",
    company: "Organisation Name",
    relationship: "Direct Supervisor",
    quote:
      "Add a brief recommendation or endorsement here. This is where your referee's testimonial about your work, character, and skills will appear.",
    email: "email@example.com",
    linkedin: "https://linkedin.com",
    avatar: "AR",
    avatarColor: "from-indigo-500 to-purple-600",
    featured: true,
  },
  {
    id: 2,
    name: "— Add Reference —",
    title: "Technical Lead / CTO",
    company: "Organisation Name",
    relationship: "Technical Mentor",
    quote:
      "Add a brief recommendation or endorsement here. This is where your referee's testimonial about your technical abilities will appear.",
    email: "email@example.com",
    linkedin: "https://linkedin.com",
    avatar: "AR",
    avatarColor: "from-sky-500 to-blue-600",
    featured: true,
  },
  {
    id: 3,
    name: "— Add Reference —",
    title: "Project Manager / CEO",
    company: "Organisation Name",
    relationship: "Client / Stakeholder",
    quote:
      "Add a brief recommendation or endorsement here. This is where a client's or colleague's testimonial about your deliverables will appear.",
    email: "email@example.com",
    linkedin: "https://linkedin.com",
    avatar: "AR",
    avatarColor: "from-emerald-500 to-teal-600",
  },
];

// ─── Animation variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

// ─── Reference Card ────────────────────────────────────────────────────────────
function ReferenceCard({
  ref: _ref,
  reference,
  index,
}: {
  ref?: React.Ref<HTMLDivElement>;
  reference: Reference;
  index: number;
}) {
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={cardRef}
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className={`group relative flex flex-col rounded-2xl border bg-card overflow-hidden transition-all duration-500 hover:shadow-[0_0_50px_-15px] ${
        reference.featured
          ? "border-primary/40 hover:border-primary/60 hover:shadow-primary/20"
          : "border-border/60 hover:border-primary/30 hover:shadow-primary/15"
      }`}
    >
      {reference.featured && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
            <Star className="h-3 w-3" /> Featured
          </span>
        </div>
      )}

      <div className="p-7 flex flex-col flex-1">
        {/* Quote */}
        <div className="mb-6">
          <Quote className="h-6 w-6 text-primary/30 mb-3" />
          <p className="text-muted-foreground leading-relaxed italic text-sm">
            &ldquo;{reference.quote}&rdquo;
          </p>
        </div>

        {/* Person info */}
        <div className="flex items-center gap-4 mt-auto pt-5 border-t border-border/40">
          {/* Avatar */}
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${reference.avatarColor} flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md`}
          >
            {reference.avatar}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground text-sm truncate">
              {reference.name}
            </p>
            <p className="text-xs text-primary font-medium truncate">
              {reference.title}
            </p>
            <div className="flex items-center gap-1 mt-0.5">
              <Building2 className="h-3 w-3 text-muted-foreground/60" />
              <p className="text-xs text-muted-foreground truncate">
                {reference.company}
              </p>
            </div>
          </div>
        </div>

        {/* Relationship badge */}
        <div className="mt-4">
          <span className="text-xs px-2.5 py-1 rounded-full bg-muted/50 border border-border/40 text-muted-foreground font-medium">
            <User className="h-3 w-3 inline mr-1" />
            {reference.relationship}
          </span>
        </div>

        {/* Contact links */}
        {(reference.email || reference.phone || reference.linkedin) && (
          <div className="mt-5 pt-4 border-t border-border/40 flex items-center gap-2">
            {reference.email && (
              <a
                href={`mailto:${reference.email}`}
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            )}
            {reference.phone && (
              <a
                href={`tel:${reference.phone}`}
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                aria-label="Phone"
              >
                <Phone className="h-4 w-4" />
              </a>
            )}
            {reference.linkedin && (
              <a
                href={reference.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function ReferencesPage() {
  return (
    <div className="relative min-h-screen bg-background selection:bg-primary/30">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] opacity-15 dark:opacity-20 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-indigo-500/30 to-purple-500/20 blur-[120px] rounded-full" />
      </div>

      <div className="container px-4 mx-auto pt-32 pb-24">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
            <Star className="w-4 h-4" />
            <span>Professional References & Endorsements</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-5">
            Professional{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">
              References
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Colleagues, supervisors, and clients who can speak to the quality
            of my work, reliability, and technical expertise.
          </p>
        </motion.div>

        {/* ── Notice banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-3"
        >
          <Plus className="h-5 w-5 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-400">
              How to add your references
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Open{" "}
              <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
                app/references/page.tsx
              </code>{" "}
              and edit the <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">REFERENCES</code> array.
              Replace the placeholder name, title, company, quote, and contact
              details with your actual referees. You can add as many as needed.
            </p>
          </div>
        </motion.div>

        {/* ── Section divider ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary/70 mb-2">
            Referee Cards
          </h2>
          <div className="h-px bg-gradient-to-r from-primary/40 via-border/40 to-transparent mb-10" />
        </motion.div>

        {/* ── Reference Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {REFERENCES.map((ref, i) => (
            <ReferenceCard key={ref.id} reference={ref} index={i} />
          ))}
        </div>

        {/* ── Privacy Note ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 p-6 rounded-2xl border border-border/60 bg-card/60 flex items-start gap-4"
        >
          <ExternalLink className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-foreground mb-1">
              Full References Available on Request
            </p>
            <p className="text-sm text-muted-foreground">
              Detailed contact information and full written references can be
              furnished to prospective employers upon request. Please reach out
              via the contact form and I will coordinate accordingly.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-sm text-primary font-medium mt-3 hover:underline"
            >
              Request Full References <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-block rounded-3xl border border-border/60 bg-card p-10">
            <Linkedin className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3">
              See LinkedIn Recommendations
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              I have several public endorsements and recommendations visible on
              my LinkedIn profile — feel free to check them out.
            </p>
            <a
              href="https://www.linkedin.com/in/khalfaniathman"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
            >
              <Linkedin className="h-4 w-4" /> LinkedIn Profile{" "}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
