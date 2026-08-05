"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import {
  Award,
  ExternalLink,
  Shield,
  BadgeCheck,
  Clock,
  Network,
  Loader2,
} from "lucide-react";
import { api } from "@/lib/api";
import { Certification } from "@/types";

// ── Issuer brand config ─────────────────────────────────────────────────────
const ISSUER_CONFIG: Record<
  string,
  { label: string; gradient: string; accent: string; icon: React.ReactNode }
> = {
  aws: {
    label: "Amazon Web Services",
    gradient: "from-orange-500/20 to-yellow-500/10",
    accent: "border-orange-500/30 text-orange-400",
    icon: <span className="text-2xl">☁️</span>,
  },
  alx: {
    label: "ALX Africa",
    gradient: "from-green-600/20 to-emerald-500/10",
    accent: "border-green-500/30 text-green-400",
    icon: <span className="text-2xl">🌍</span>,
  },
  oracle: {
    label: "Oracle",
    gradient: "from-red-600/20 to-rose-500/10",
    accent: "border-red-500/30 text-red-400",
    icon: <span className="text-2xl">🔴</span>,
  },
  badge: {
    label: "Network Badges",
    gradient: "from-blue-600/20 to-indigo-500/10",
    accent: "border-blue-500/30 text-blue-400",
    icon: <Network className="h-6 w-6" />,
  },
  other: {
    label: "Other",
    gradient: "from-violet-600/20 to-purple-500/10",
    accent: "border-violet-500/30 text-violet-400",
    icon: <Award className="h-6 w-6" />,
  },
};

const TYPE_LABELS: Record<string, string> = {
  aws: "AWS",
  alx: "ALX",
  oracle: "Oracle",
  badge: "Badge",
  other: "Other",
};

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item: Variants = {
  hidden: { y: 24, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 200, damping: 22 } },
};

function CertCard({ cert }: { cert: Certification }) {
  const cfg = ISSUER_CONFIG[cert.type] ?? ISSUER_CONFIG.other;

  return (
    <motion.div
      variants={item}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`group relative flex flex-col rounded-2xl border bg-gradient-to-br ${cfg.gradient} border-border/50 hover:border-primary/40 p-6 gap-4 transition-all duration-300 hover:shadow-[0_8px_32px_-8px] hover:shadow-primary/20 overflow-hidden`}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full border ${cfg.accent} bg-background/40 backdrop-blur-sm`}
            >
              {TYPE_LABELS[cert.type]}
            </span>
            {cert.in_progress && (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full border border-yellow-500/30 text-yellow-400 bg-yellow-500/10">
                <Clock className="h-3 w-3" />
                In Progress
              </span>
            )}
          </div>
          <h3 className="font-bold text-foreground text-base leading-snug line-clamp-2">
            {cert.name}
          </h3>
        </div>

        {/* Badge image or fallback icon */}
        <div className="flex-shrink-0">
          {cert.badge ? (
            <img
              src={cert.badge}
              alt={`${cert.name} badge`}
              className="w-14 h-14 object-contain rounded-xl border border-border/40 bg-background/30 p-1"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div
              className={`w-14 h-14 flex items-center justify-center rounded-xl border ${cfg.accent} bg-background/30`}
            >
              {cfg.icon}
            </div>
          )}
        </div>
      </div>

      {/* Issuer & date */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <BadgeCheck className="h-4 w-4 text-primary/70" />
          {cert.issuer}
        </span>
        <span>{cert.date}</span>
      </div>

      {/* Credential link */}
      {cert.credential_url && (
        <a
          href={cert.credential_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors mt-auto pt-2 border-t border-border/30"
        >
          <Shield className="h-3.5 w-3.5" />
          Verify Credential
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </motion.div>
  );
}

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    api.certifications
      .getPublic()
      .then(setCerts)
      .catch(() => setCerts([]))
      .finally(() => setLoading(false));
  }, []);

  // Determine which types are present
  const presentTypes = Array.from(new Set(certs.map((c) => c.type)));

  const filtered =
    filter === "all" ? certs : certs.filter((c) => c.type === filter);

  const totalCerts = certs.filter((c) => c.type !== "badge").length;
  const totalBadges = certs.filter((c) => c.type === "badge").length;

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-blue-500/50 blur-[120px] rounded-full" />
      </div>

      <div className="container px-4 mx-auto py-24 relative">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
            <Award className="w-4 h-4" />
            <span>Credentials & Badges</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl mb-4">
            Certifications &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
              Achievements
            </span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Industry-recognized certifications and professional badges
            demonstrating expertise across cloud infrastructure, network
            engineering, and software development.
          </p>
        </motion.div>

        {/* Stats bar */}
        {!loading && certs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-6 mb-12 pb-12 border-b border-border/40"
          >
            {[
              { label: "Certificates", value: totalCerts, icon: <Award className="h-5 w-5 text-primary" /> },
              { label: "Badges", value: totalBadges, icon: <Network className="h-5 w-5 text-blue-400" /> },
              { label: "Issuers", value: presentTypes.length, icon: <BadgeCheck className="h-5 w-5 text-green-400" /> },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                {s.icon}
                <div>
                  <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Filter tabs */}
        {!loading && certs.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {["all", ...presentTypes].map((t) => {
              const cfg = ISSUER_CONFIG[t];
              const isActive = filter === t;
              return (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-[0_0_12px_-3px] shadow-primary/50"
                      : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  {t === "all" ? "All" : cfg?.label ?? TYPE_LABELS[t] ?? t}
                  <span className="ml-2 text-xs opacity-70">
                    ({t === "all" ? certs.length : certs.filter((c) => c.type === t).length})
                  </span>
                </button>
              );
            })}
          </motion.div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading credentials…</p>
          </div>
        ) : certs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
            <Award className="h-16 w-16 text-muted-foreground/30" />
            <p className="text-xl font-semibold text-muted-foreground">No credentials yet</p>
            <p className="text-sm text-muted-foreground/60 max-w-sm">
              Certifications and badges will appear here once added.
            </p>
          </div>
        ) : (
          <motion.div
            key={filter}
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((cert) => (
              <CertCard key={cert.id} cert={cert} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}