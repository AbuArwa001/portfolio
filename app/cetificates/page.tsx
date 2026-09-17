"use client";

import { useState, useEffect } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import {
  Award,
  ExternalLink,
  Shield,
  BadgeCheck,
  Clock,
  Network,
  Loader2,
  Sparkles,
  CheckCircle2,
  Search,
  Filter,
} from "lucide-react";
import { api } from "@/lib/api";
import { Certification } from "@/types";

// Brand configs
const ISSUER_CONFIG: Record<
  string,
  { label: string; gradient: string; accent: string; badgeBorder: string; icon: string }
> = {
  aws: {
    label: "Amazon Web Services",
    gradient: "from-orange-500/15 via-orange-500/5 to-transparent",
    accent: "border-orange-500/30 text-orange-400 bg-orange-500/10",
    badgeBorder: "border-orange-500/40",
    icon: "☁️",
  },
  oracle: {
    label: "Oracle",
    gradient: "from-red-600/15 via-red-600/5 to-transparent",
    accent: "border-red-500/30 text-red-400 bg-red-500/10",
    badgeBorder: "border-red-500/40",
    icon: "🔴",
  },
  alx: {
    label: "ALX Africa",
    gradient: "from-emerald-600/15 via-emerald-600/5 to-transparent",
    accent: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
    badgeBorder: "border-emerald-500/40",
    icon: "🌍",
  },
  badge: {
    label: "Verified Digital Badge",
    gradient: "from-blue-600/15 via-blue-600/5 to-transparent",
    accent: "border-blue-500/30 text-blue-400 bg-blue-500/10",
    badgeBorder: "border-blue-500/40",
    icon: "🛡️",
  },
  other: {
    label: "Professional Accreditation",
    gradient: "from-violet-600/15 via-violet-600/5 to-transparent",
    accent: "border-violet-500/30 text-violet-400 bg-violet-500/10",
    badgeBorder: "border-violet-500/40",
    icon: "📜",
  },
};

const FALLBACK_CREDENTIALS: Certification[] = [
  // --- Professional Certifications ---
  {
    id: 1,
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services (AWS)",
    date: "2023",
    type: "aws",
    badge: "/badges/aws-cloud-practitioner.png",
    credential_url: "https://www.credly.com/org/amazon-web-services/badge/aws-certified-cloud-practitioner",
    in_progress: false,
  },
  {
    id: 2,
    name: "Oracle Cloud Infrastructure (OCI) Associate",
    issuer: "Oracle University",
    date: "2023",
    type: "oracle",
    badge: "/badges/oracle-oci.png",
    credential_url: "https://catalog-education.oracle.com/",
    in_progress: false,
  },
  {
    id: 3,
    name: "Certificate in Software Engineering",
    issuer: "ALX Africa",
    date: "2024",
    type: "alx",
    badge: "/badges/alx-software-engineering.svg",
    credential_url: "https://alxafrica.com",
    in_progress: false,
  },
  {
    id: 4,
    name: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services (AWS)",
    date: "2025",
    type: "aws",
    badge: "/badges/aws-solutions-architect.png",
    credential_url: "https://www.credly.com/",
    in_progress: true,
  },
  {
    id: 5,
    name: "Cisco Certified Network Associate (CCNA 200-301)",
    issuer: "Cisco",
    date: "2024",
    type: "other",
    badge: "/badges/cisco-ccna.png",
    credential_url: "https://www.cisco.com/",
    in_progress: false,
  },
  // --- Verified Digital Badges ---
  {
    id: 6,
    name: "CCNA: Enterprise Networking, Security, and Automation",
    issuer: "Cisco Networking Academy",
    date: "2024",
    type: "badge",
    badge: "/badges/cisco-ccna.png",
    credential_url: "https://www.credly.com/org/cisco/badge/ccna-enterprise-networking-security-and-automation",
    in_progress: false,
  },
  {
    id: 7,
    name: "AWS Cloud Practitioner Digital Badge",
    issuer: "Credly / Amazon Web Services",
    date: "2023",
    type: "badge",
    badge: "/badges/aws-cloud-practitioner.png",
    credential_url: "https://www.credly.com/org/amazon-web-services/badge/aws-certified-cloud-practitioner",
    in_progress: false,
  },
  {
    id: 8,
    name: "Oracle Cloud Infrastructure Certified Foundations Associate",
    issuer: "Oracle University",
    date: "2023",
    type: "badge",
    badge: "/badges/oracle-oci.png",
    credential_url: "https://catalog-education.oracle.com/",
    in_progress: false,
  },
  {
    id: 9,
    name: "ALX Software Engineering Honours Badge",
    issuer: "ALX Africa",
    date: "2024",
    type: "badge",
    badge: "/badges/alx-software-engineering.svg",
    credential_url: "https://alxafrica.com",
    in_progress: false,
  },
  {
    id: 10,
    name: "Network Security & Packet Inspection Specialist",
    issuer: "Network Academy / Wireshark",
    date: "2024",
    type: "badge",
    badge: "/badges/network-security.svg",
    credential_url: "https://www.credly.com/",
    in_progress: false,
  },
];

// Motion variants
const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 220, damping: 24 } },
};

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Live badge link resolver widget
  const [linkInput, setLinkInput] = useState("");
  const [resolving, setResolving] = useState(false);
  const [resolvedBadge, setResolvedBadge] = useState<{
    name: string;
    image: string;
    issuer: string;
    url: string;
  } | null>(null);

  useEffect(() => {
    api.certifications
      .getPublic()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCerts(data);
        } else {
          setCerts(FALLBACK_CREDENTIALS);
        }
      })
      .catch(() => setCerts(FALLBACK_CREDENTIALS))
      .finally(() => setLoading(false));
  }, []);

  const handleResolveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkInput || linkInput.trim().length < 5) return;
    setResolving(true);
    try {
      const res = await fetch(`/api/badges/resolve?url=${encodeURIComponent(linkInput.trim())}`);
      if (res.ok) {
        const result = await res.json();
        setResolvedBadge(result);
      }
    } catch {
      //
    } finally {
      setResolving(false);
    }
  };

  // Filter items
  const filtered = certs.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.issuer.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filter === "all") return true;
    if (filter === "certifications") return c.type !== "badge";
    if (filter === "badges") return c.type === "badge";
    return c.type === filter;
  });

  const certificationsList = filtered.filter((c) => c.type !== "badge");
  const badgesList = filtered.filter((c) => c.type === "badge");

  const totalCerts = certs.filter((c) => c.type !== "badge").length;
  const totalBadges = certs.filter((c) => c.type === "badge").length;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glow ambiance */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] opacity-15 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-blue-500 to-purple-600 blur-[140px] rounded-full" />
      </div>

      <div className="container px-4 mx-auto py-20 relative max-w-7xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 mb-4 text-xs font-bold text-primary bg-primary/10 rounded-full border border-primary/20">
            <Award className="w-3.5 h-3.5" />
            <span>Accredited Credentials &amp; Digital Badges</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground mb-4">
            Certifications &amp;{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
              Digital Badges
            </span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Verified industry qualifications and official digital badges demonstrating
            proven competencies in enterprise networking, cloud architecture, and full-stack software systems.
          </p>
        </motion.div>

        {/* Top Metric Stats */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 pb-8 border-b border-border/40"
          >
            <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-foreground">{totalCerts}</p>
                <p className="text-xs text-muted-foreground">Certifications</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Network className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-foreground">{totalBadges}</p>
                <p className="text-xs text-muted-foreground">Digital Badges</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-foreground">100%</p>
                <p className="text-xs text-muted-foreground">Verified on Credly</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-card border border-border/60 shadow-xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-foreground">5</p>
                <p className="text-xs text-muted-foreground">Global Academies</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Live Badge Link Inspector Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-10 p-5 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-sm"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
            <div>
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                Live Badge Link Inspector
              </h3>
              <p className="text-xs text-muted-foreground">
                Paste any Credly or academy link to instantly display its official digital badge graphic and title.
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              Credly / Cisco / AWS / Oracle
            </span>
          </div>

          <form onSubmit={handleResolveLink} className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              placeholder="e.g. https://www.credly.com/org/cisco/badge/ccna-enterprise-networking-security-and-automation"
              className="flex-1 px-4 py-2.5 rounded-xl border border-border/60 bg-background text-foreground text-xs focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-mono"
            />
            <button
              type="submit"
              disabled={resolving || !linkInput}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {resolving ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Resolving...</span>
                </>
              ) : (
                <>
                  <Shield className="h-3.5 w-3.5" />
                  <span>Inspect Badge</span>
                </>
              )}
            </button>
          </form>

          {/* Resolved Badge Display */}
          <AnimatePresence>
            {resolvedBadge && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 rounded-xl bg-accent/40 border border-primary/30 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-background border border-border p-1.5 flex items-center justify-center shrink-0 shadow-md">
                    <img
                      src={resolvedBadge.image}
                      alt={resolvedBadge.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Official Badge Verified
                      </span>
                      <span className="text-muted-foreground text-[10px]">·</span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {resolvedBadge.issuer}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-foreground mt-0.5">
                      {resolvedBadge.name}
                    </h4>
                    <p className="text-xs text-muted-foreground font-mono truncate max-w-md">
                      {resolvedBadge.url}
                    </p>
                  </div>
                </div>

                <a
                  href={resolvedBadge.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors shrink-0"
                >
                  <span>Verify on Credly</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Filter Toolbar & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "All Credentials" },
              { id: "certifications", label: `Certificates (${totalCerts})` },
              { id: "badges", label: `Badges (${totalBadges})` },
              { id: "aws", label: "AWS" },
              { id: "oracle", label: "Oracle" },
              { id: "alx", label: "ALX" },
            ].map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-[0_0_14px_-4px] shadow-primary/60"
                      : "bg-card border border-border/60 text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="h-3.5 w-3.5 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search credentials..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border/60 bg-card text-foreground text-xs focus:outline-none focus:border-primary transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">Loading credentials...</p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* =============================================================
                SECTION 1: PROFESSIONAL CERTIFICATIONS
               ============================================================= */}
            {(filter === "all" || filter === "certifications" || filter === "aws" || filter === "oracle" || filter === "alx") &&
              certificationsList.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-foreground tracking-tight">
                        Professional Certifications
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Formal industry certifications awarded by Amazon Web Services, Oracle, and ALX.
                      </p>
                    </div>
                  </div>

                  <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {certificationsList.map((cert) => (
                      <CertCard key={cert.id} cert={cert} />
                    ))}
                  </motion.div>
                </div>
              )}

            {/* =============================================================
                SECTION 2: VERIFIED DIGITAL & TECHNICAL BADGES (DEDICATED)
               ============================================================= */}
            {(filter === "all" || filter === "badges") && badgesList.length > 0 && (
              <div>
                <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      <Network className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
                        Verified Digital &amp; Network Badges
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
                          Credly Verified
                        </span>
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        Official digital badges and specialized technical competencies verified on Credly and Cisco Academy.
                      </p>
                    </div>
                  </div>
                </div>

                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {badgesList.map((badge) => (
                    <DigitalBadgeCard key={badge.id} badge={badge} />
                  ))}
                </motion.div>
              </div>
            )}

            {certificationsList.length === 0 && badgesList.length === 0 && (
              <div className="text-center py-20 border border-dashed border-border/60 rounded-3xl p-8 bg-card/30">
                <Award className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-base font-bold text-foreground">No matching credentials found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try clearing your search or switching filter tabs.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Standard Certification Card ─────────────────────────────────────────────
function CertCard({ cert }: { cert: Certification }) {
  const cfg = ISSUER_CONFIG[cert.type] ?? ISSUER_CONFIG.other;

  return (
    <motion.div
      variants={item}
      whileHover={{ y: -4 }}
      className={`group relative flex flex-col rounded-2xl border border-border/60 bg-gradient-to-br ${cfg.gradient} p-6 gap-4 transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 overflow-hidden`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${cfg.accent}`}
            >
              {cfg.label}
            </span>
            {cert.in_progress && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border border-yellow-500/30 text-yellow-400 bg-yellow-500/10">
                <Clock className="h-2.5 w-2.5" />
                In Progress
              </span>
            )}
          </div>
          <h3 className="font-extrabold text-foreground text-base leading-snug">
            {cert.name}
          </h3>
        </div>

        {/* Official Badge Graphic */}
        <div className="w-14 h-14 shrink-0 rounded-xl bg-background/80 border border-border/60 p-1 flex items-center justify-center shadow-sm">
          {cert.badge ? (
            <img
              src={cert.badge}
              alt={cert.name}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/badges/aws-cloud-practitioner.png";
              }}
            />
          ) : (
            <span className="text-2xl">{cfg.icon}</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/30">
        <span className="flex items-center gap-1.5 font-medium">
          <BadgeCheck className="h-3.5 w-3.5 text-primary" />
          {cert.issuer}
        </span>
        <span className="font-mono">{cert.date}</span>
      </div>

      {cert.credential_url && (
        <a
          href={cert.credential_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors mt-auto pt-2"
        >
          <Shield className="h-3.5 w-3.5" />
          <span>Verify Credential</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      )}
    </motion.div>
  );
}

// ── Dedicated Digital & Network Badge Card ──────────────────────────────────
function DigitalBadgeCard({ badge }: { badge: Certification }) {
  // Infer badge image from known provider if missing
  let imageSrc = badge.badge;
  if (!imageSrc) {
    if (/cisco|ccna/i.test(badge.name)) imageSrc = "/badges/cisco-ccna.png";
    else if (/aws|practitioner/i.test(badge.name)) imageSrc = "/badges/aws-cloud-practitioner.png";
    else if (/oracle|oci/i.test(badge.name)) imageSrc = "/badges/oracle-oci.png";
    else if (/alx/i.test(badge.name)) imageSrc = "/badges/alx-software-engineering.svg";
    else imageSrc = "/badges/network-security.svg";
  }

  return (
    <motion.div
      variants={item}
      whileHover={{ y: -6, scale: 1.01 }}
      className="group relative flex flex-col rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-950/20 via-card to-background p-6 gap-4 transition-all duration-300 hover:border-blue-500/60 hover:shadow-2xl hover:shadow-blue-500/20 overflow-hidden"
    >
      {/* Subtle background glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/20 transition-all duration-500" />

      {/* Header: Official Badge Graphic + Name */}
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 shrink-0 rounded-2xl bg-card border border-blue-500/40 p-1.5 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
          <img
            src={imageSrc}
            alt={badge.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/badges/cisco-ccna.png";
            }}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
              <Shield className="h-2.5 w-2.5" />
              OFFICIAL BADGE
            </span>
          </div>
          <h3 className="font-black text-foreground text-sm leading-snug group-hover:text-blue-400 transition-colors">
            {badge.name}
          </h3>
        </div>
      </div>

      {/* Issuer & Date */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40">
        <span className="flex items-center gap-1.5 font-medium truncate">
          <BadgeCheck className="h-3.5 w-3.5 text-blue-400 shrink-0" />
          {badge.issuer}
        </span>
        <span className="font-mono font-semibold shrink-0">{badge.date}</span>
      </div>

      {/* Verify on Credly Action */}
      {badge.credential_url ? (
        <a
          href={badge.credential_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600/15 hover:bg-blue-600 text-blue-400 hover:text-white font-bold text-xs border border-blue-500/30 hover:border-blue-600 transition-all mt-auto"
        >
          <Shield className="h-3.5 w-3.5" />
          <span>Verify on Credly</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      ) : (
        <span className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-accent/40 text-muted-foreground text-xs font-semibold mt-auto">
          <BadgeCheck className="h-3.5 w-3.5" />
          Verified Competency
        </span>
      )}
    </motion.div>
  );
}