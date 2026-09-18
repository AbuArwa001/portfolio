"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Quote, Briefcase, Mail, Phone, Linkedin, Users, ArrowUpRight,
  Building2, UserCheck, Plus, Sparkles,
} from "lucide-react";
import { getApiUrl } from "@/lib/config";

const API = `${getApiUrl()}/api/v1/references/`;

export interface Reference {
  id?: number;
  name: string;
  title: string;
  company: string;
  relationship: string;
  quote: string;
  email: string;
  phone: string;
  linkedin: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const AVATAR_COLORS = [
  "from-indigo-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-sky-500 to-blue-600",
  "from-violet-500 to-fuchsia-600",
];

function Initials({ name, idx }: { name: string; idx: number }) {
  const parts = name.trim().split(" ");
  const init = parts.length >= 2
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`
    : parts[0]?.[0] ?? "?";
  return (
    <div
      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center text-white text-lg font-extrabold shadow-lg shrink-0`}
    >
      {init.toUpperCase()}
    </div>
  );
}

function ReferenceCard({ ref: r, idx }: { ref: Reference; idx: number }) {
  return (
    <motion.div
      custom={idx}
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="group relative flex flex-col rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 hover:border-primary/40 hover:shadow-[0_0_40px_-12px] hover:shadow-primary/20 transition-all duration-300"
    >
      {/* Decorative quote mark */}
      <Quote className="absolute top-5 right-5 h-8 w-8 text-primary/8 group-hover:text-primary/15 transition-colors" />

      {/* Quote */}
      {r.quote && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1 italic">
          &ldquo;{r.quote}&rdquo;
        </p>
      )}

      {/* Divider */}
      {r.quote && <div className="h-px bg-gradient-to-r from-primary/20 via-border/40 to-transparent mb-5" />}

      {/* Referee info */}
      <div className="flex items-start gap-4">
        <Initials name={r.name || "?"} idx={idx} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-foreground text-base leading-tight">{r.name}</p>
          <p className="text-sm text-primary font-medium mt-0.5 truncate">{r.title}</p>
          {r.company && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Building2 className="h-3 w-3 shrink-0" />
              <span className="truncate">{r.company}</span>
            </p>
          )}
          {r.relationship && (
            <p className="text-xs text-muted-foreground/70 mt-0.5 flex items-center gap-1">
              <UserCheck className="h-3 w-3 shrink-0" />
              <span>{r.relationship}</span>
            </p>
          )}
        </div>
      </div>

      {/* Contact links */}
      {(r.email || r.phone || r.linkedin) && (
        <div className="flex flex-wrap gap-3 mt-5 pt-4 border-t border-border/40">
          {r.email && (
            <a
              href={`mailto:${r.email}`}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors max-w-full"
            >
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{r.email}</span>
            </a>
          )}
          {r.phone && (
            <a
              href={`tel:${r.phone}`}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span>{r.phone}</span>
            </a>
          )}
          {r.linkedin && (
            <a
              href={r.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="h-3.5 w-3.5 shrink-0" />
              <span>LinkedIn</span>
              <ArrowUpRight className="h-3 w-3 shrink-0" />
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}

// Props from the server component (initial seed)
interface Props {
  references: Reference[];
}

export default function ReferencesClient({ references: initialRefs }: Props) {
  const [refs, setRefs] = useState<Reference[]>(initialRefs ?? []);
  const [loading, setLoading] = useState(initialRefs.length === 0);

  // Fetch fresh from the API (overrides server-passed data if available)
  useEffect(() => {
    fetch(API)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setRefs(data);
      })
      .catch(() => {/* silently keep initialRefs */})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen bg-background selection:bg-primary/30 overflow-x-hidden">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[900px] h-[400px] opacity-15 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/50 via-primary/30 to-indigo-500/20 blur-[120px] rounded-full" />
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto pt-24 sm:pt-32 pb-16 sm:pb-24">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 sm:mb-6 text-xs sm:text-sm font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Professional References</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-4 sm:mb-5">
              What{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-400">
                People Say
              </span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
              A curated list of professional referees who can speak to my expertise,
              work ethic, and impact across network engineering and IT leadership roles.
            </p>
          </div>

          <div className="shrink-0 w-full sm:w-auto">
            <Link
              href="/references/submit"
              className="inline-flex items-center justify-center w-full sm:w-auto gap-2 px-5 py-3 rounded-2xl bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Submit an Endorsement</span>
            </Link>
          </div>
        </motion.div>

        {/* ── Loading ── */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-24"
            >
              <div className="w-9 h-9 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Empty state ── */}
        {!loading && refs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center gap-4"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Quote className="h-7 w-7 text-primary/40" />
            </div>
            <p className="text-muted-foreground text-sm max-w-xs">
              References will appear here once they&apos;ve been added via the admin dashboard.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
              <Briefcase className="h-3.5 w-3.5" />
              Available upon request
            </div>
          </motion.div>
        )}

        {/* ── Cards grid ── */}
        {!loading && refs.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {refs.map((r, i) => (
                <ReferenceCard key={r.id ?? i} ref={r} idx={i} />
              ))}
            </div>

            {/* Footer note */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-muted-foreground/70 pt-6 border-t border-border/40"
            >
              <span className="flex items-center gap-1.5 text-xs">
                <UserCheck className="h-4 w-4 text-primary" />
                Additional verified references available upon request.
              </span>
              <span className="hidden sm:inline text-muted-foreground/30">•</span>
              <Link
                href="/references/submit"
                className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline"
              >
                Worked with Khalfan? Leave an endorsement &rarr;
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
