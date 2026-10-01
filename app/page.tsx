"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Terminal,
  Database,
  Server,
  Network,
  Github,
  Linkedin,
  Mail,
  Layers,
  Zap,
  Code2,

  Star,
  BadgeCheck,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import CurrentlyStudyingBadge from "@/components/CurrentlyStudyingBadge";

// ── Animation variants ─────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

// ── Tech stack data ────────────────────────────────────────────────────────
const STACK = [
  { icon: Terminal,  label: "Next.js & React",  sub: "Frontend",       color: "text-primary",   bg: "bg-primary/10",   border: "border-primary/20"  },
  { icon: Database,  label: "Django & DRF",     sub: "Backend API",    color: "text-blue-500",  bg: "bg-blue-500/10",  border: "border-blue-500/20" },
  { icon: Server,    label: "Linux & C",        sub: "Systems",        color: "text-violet-400",bg: "bg-violet-500/10",border: "border-violet-500/20"},
  { icon: Network,   label: "Networking",       sub: "Infrastructure", color: "text-teal-400",  bg: "bg-teal-500/10",  border: "border-teal-500/20" },
];

// ── Stats bar ──────────────────────────────────────────────────────────────
const STATS = [
  { value: "6+",  label: "Years Engineering" },
  { value: "10+", label: "Live Projects" },
  { value: "4+",  label: "Enterprise Clients" },
  { value: "99%", label: "Uptime Delivered" },
];

// ── Projects ───────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    image: "/projects/langata-islamic-center.png",
    alt: "Langata Islamic Center",
    status: "Live",
    statusColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    dotColor: "bg-emerald-400",
    tags: [
      { label: "Next.js 15", color: "bg-primary/10 text-primary border-primary/20" },
      { label: "DRF API",    color: "bg-primary/10 text-primary border-primary/20" },
      { label: "PostgreSQL", color: "bg-primary/10 text-primary border-primary/20" },
    ],
    title: "Langata Islamic Center",
    description:
      "Full digital hub and web presence for Langata Islamic Center & Mosque. Features real-time donation drives, community announcements, prayer schedules, and programme management.",
    demoUrl: "https://www.langataislamiccenter.org/",
    demoLabel: "Visit Live Portal",
    accentCls: "hover:border-primary/50 hover:shadow-primary/10",
    linkCls: "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground",
  },
  {
    image: "/projects/supkem.png",
    alt: "SUPKEM Digital Portal",
    status: "Live",
    statusColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    dotColor: "bg-emerald-400",
    tags: [
      { label: "Next.js 15",  color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
      { label: "Django DRF",  color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
      { label: "PostgreSQL",  color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    ],
    title: "SUPKEM Digital Portal",
    description:
      "Comprehensive digital presence for the Supreme Council of Kenya Muslims featuring a bi-lingual news CMS, leadership directory, and national Quran Competition registration.",
    demoUrl: "https://www.supkem.org/",
    demoLabel: "Visit Live Portal",
    accentCls: "hover:border-blue-500/40 hover:shadow-blue-500/10",
    linkCls: "bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white",
  },
  {
    image: "/projects/jmc-admin-dashboard.png",
    alt: "jamiaGive Admin Dashboard",
    status: "In Progress",
    statusColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    dotColor: "bg-amber-400",
    tags: [
      { label: "Next.js",     color: "bg-primary/10 text-primary border-primary/20" },
      { label: "TypeScript",  color: "bg-primary/10 text-primary border-primary/20" },
      { label: "DRF Backend", color: "bg-primary/10 text-primary border-primary/20" },
    ],
    title: "jamiaGive Admin Dashboard",
    description:
      "Enterprise administrative dashboard for Jamia Mosque Nairobi. Features real-time donation auditing, structured fund categories, and secure transfers via a decoupled DRF API.",
    demoUrl: "https://jmc-admin-dashboard.vercel.app/",
    demoLabel: "Live Demo",
    accentCls: "hover:border-amber-500/40 hover:shadow-amber-500/10",
    linkCls: "bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-black",
  },
  {
    image: "/projects/seafood-dashboard.png",
    alt: "SeaFood Platform & Dashboard",
    status: "Live",
    statusColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    dotColor: "bg-emerald-400",
    tags: [
      { label: "Next.js",    color: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
      { label: "Python DRF", color: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
      { label: "Recharts",   color: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
    ],
    title: "SeaFood Logistics & Analytics",
    description:
      "Full-stack seafood supply management platform and executive dashboard. Delivers live revenue analytics, inventory tracking, and order fulfillment visualisations.",
    demoUrl: "https://seafooddashboard.vercel.app/",
    demoLabel: "Live Demo",
    accentCls: "hover:border-sky-500/40 hover:shadow-sky-500/10",
    linkCls: "bg-sky-500/10 text-sky-400 hover:bg-sky-500 hover:text-white",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background relative selection:bg-primary/30 overflow-x-hidden">

      {/* ── Background ambient glows ────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px]">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[140px] animate-pulse-glow" />
          <div className="absolute top-20 right-1/4 w-[300px] h-[300px] bg-teal-500/10 rounded-full blur-[100px]" />
        </div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      {/* ══ HERO ══════════════════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-36">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* Left: Text */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="space-y-7"
            >
              {/* Badges */}
              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-primary bg-primary/10 rounded-full border border-primary/20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                  </span>
                  Network Engineer & Full-Stack Developer
                </span>
                <CurrentlyStudyingBadge variant="pill" />
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeUp}
                className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-[1.07] font-heading"
              >
                Architecting{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-teal-400">
                  Robust
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-400 to-teal-400">
                  Infrastructure
                </span>
                {" "}& Web Apps
              </motion.h1>

              {/* Body */}
              <motion.p
                variants={fadeUp}
                className="text-lg text-muted-foreground max-w-xl leading-relaxed"
              >
                I bring{" "}
                <span className="text-foreground font-semibold">6+ years of network engineering</span>{" "}
                discipline to full-stack development. Specializing in{" "}
                <span className="text-foreground font-semibold">Django REST Framework</span> and{" "}
                <span className="text-foreground font-semibold">high-performance Next.js</span>{" "}
                frontends, I build solutions that don&apos;t just look premium — they scale flawlessly.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3.5">
                <Link
                  href="/projects"
                  className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-xl shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 hover:-translate-y-0.5"
                >
                  View Case Studies
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm hover:bg-card hover:border-primary/30 text-foreground font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
                >
                  Get in Touch
                </Link>
              </motion.div>

              {/* Social row */}
              <motion.div variants={fadeUp} className="flex items-center gap-1.5 pt-1">
                {[
                  { href: "https://github.com/AbuArwa001", icon: Github, label: "GitHub" },
                  { href: "https://www.linkedin.com/in/khalfaniathman", icon: Linkedin, label: "LinkedIn" },
                  { href: "mailto:khalfan@khalfanathman.dev", icon: Mail, label: "Email" },
                ].map(({ href, icon: Icon, label }) => (
                  <Link
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="p-2.5 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                    aria-label={label}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </Link>
                ))}
                <span className="ml-2 text-xs text-muted-foreground font-mono">khalfanathman.dev</span>
              </motion.div>
            </motion.div>

            {/* Right: Stats card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block"
            >
              <div className="relative">
                {/* Glow behind card */}
                <div className="absolute -inset-4 bg-primary/10 rounded-3xl blur-2xl" />

                {/* Main glass card */}
                <div className="relative rounded-3xl border border-border/60 bg-card/80 backdrop-blur-xl p-8 shadow-2xl">
                  {/* Top gradient stripe */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/60 via-emerald-400/40 to-transparent rounded-t-3xl" />

                  {/* Profile row */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-primary-foreground font-extrabold text-xl shadow-lg shadow-primary/30">
                      KA
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-base font-heading">Khalfan Athman</p>
                      <p className="text-xs text-muted-foreground">Network Engineer · Full-Stack Dev</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[11px] text-primary font-medium">Available for hire</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {STATS.map(({ value, label }) => (
                      <div
                        key={label}
                        className="p-4 rounded-2xl bg-background/60 border border-border/50 hover:border-primary/30 transition-colors"
                      >
                        <p className="text-2xl font-extrabold text-foreground font-heading">{value}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Skill tags */}
                  <div className="flex flex-wrap gap-2">
                    {["Django DRF", "Next.js 15", "Linux/Networking", "PostgreSQL", "TypeScript"].map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-primary/8 text-primary border border-primary/15 font-medium font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mobile stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="lg:hidden grid grid-cols-2 sm:grid-cols-4 gap-3 mt-12"
          >
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                className="p-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm text-center"
              >
                <p className="text-2xl font-extrabold text-foreground font-heading">{value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ TECH STACK ════════════════════════════════════════════════════ */}
      <section className="py-20 border-y border-border/50 bg-muted/30 relative overflow-hidden">
        {/* Subtle pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.62_0.16_160_/_0.04)_0%,transparent_70%)] pointer-events-none" />

        <div className="container px-4 mx-auto max-w-5xl relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold font-mono">
              Core Technology Stack
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {STACK.map(({ icon: Icon, label, sub, color, bg, border }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                whileHover={{ y: -6, scale: 1.03 }}
                className={`flex flex-col items-center justify-center p-6 bg-card border ${border} rounded-2xl hover:shadow-lg transition-all duration-300 cursor-default group`}
              >
                <div className={`w-12 h-12 rounded-xl ${bg} border ${border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <span className="font-bold text-foreground text-sm text-center">{label}</span>
                <span className={`text-xs ${color} mt-1 font-medium`}>{sub}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Skill pills ticker */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-2 mt-10"
          >
            {[
              "Python", "TypeScript", "REST APIs", "Docker", "Nginx",
              "Cisco IOS", "Neon PostgreSQL", "Framer Motion", "TailwindCSS", "Git",
            ].map((skill) => (
              <span
                key={skill}
                className="text-[11px] font-mono px-3 py-1 rounded-full border border-border/60 bg-background/60 text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors cursor-default"
              >
                {skill}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ VALUE PROPS ═══════════════════════════════════════════════════ */}
      <section className="py-24 relative">
        <div className="container px-4 mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <p className="text-[11px] font-mono uppercase tracking-widest text-primary mb-3">
              Why Work With Me
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground font-heading mb-4">
              Engineering Discipline Meets{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">
                Product Craft
              </span>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed">
              A rare combination of low-level systems knowledge and modern web product thinking.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {[
              {
                icon: Layers,
                title: "Full-Stack Ownership",
                desc: "From database schema to pixel-perfect UI — I own the full vertical slice of every product I build.",
                color: "text-primary",
                bg: "bg-primary/10",
                border: "border-primary/20",
              },
              {
                icon: Zap,
                title: "Infrastructure-Grade Reliability",
                desc: "Network engineering background means my systems are designed for uptime, not just demo conditions.",
                color: "text-teal-400",
                bg: "bg-teal-400/10",
                border: "border-teal-400/20",
              },
              {
                icon: Code2,
                title: "API-First Architecture",
                desc: "Every frontend I build is backed by a clean, versioned DRF API — ready for mobile, integrations, or scale.",
                color: "text-violet-400",
                bg: "bg-violet-400/10",
                border: "border-violet-400/20",
              },
            ].map(({ icon: Icon, title, desc, color, bg, border }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className={`p-6 rounded-2xl border ${border} bg-card/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group`}
              >
                <div className={`w-11 h-11 rounded-xl ${bg} border ${border} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <h3 className="font-bold text-foreground text-base mb-2 font-heading">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ FEATURED PROJECTS ═════════════════════════════════════════════ */}
      <section className="py-24 bg-muted/20 border-y border-border/40 relative">
        <div className="container px-4 mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14"
          >
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-primary mb-3">
                Selected Work
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground font-heading mb-3">
                Proven Engineering
              </h2>
              <p className="text-muted-foreground text-base max-w-lg leading-relaxed">
                From high-traffic portals to complex admin dashboards — production-ready systems
                designed for real-world impact.
              </p>
            </div>
            <Link
              href="/projects"
              className="shrink-0 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
            >
              View all projects <ChevronRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-7"
          >
            {PROJECTS.map((p) => (
              <motion.div
                key={p.title}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className={`group relative rounded-3xl border border-border/50 bg-card overflow-hidden ${p.accentCls} transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col`}
              >
                {/* Image */}
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />

                  {/* Status badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 ${p.statusColor} rounded-full border backdrop-blur-sm`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${p.dotColor} ${p.status === "Live" ? "animate-pulse" : ""}`} />
                      {p.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-7 pb-5 flex-1">
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {p.tags.map(({ label, color }) => (
                      <span key={label} className={`text-[11px] font-mono px-2 py-0.5 rounded-md border ${color}`}>
                        {label}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors duration-200 font-heading">
                    {p.title}
                  </h3>
                  <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                    {p.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="px-7 pb-6 flex items-center justify-between gap-4 border-t border-border/30 pt-5">
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-1 text-primary text-sm font-semibold hover:gap-2 transition-all"
                  >
                    Case Study <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <a
                    href={p.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl ${p.linkCls} transition-all`}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {p.demoLabel}
                  </a>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm hover:bg-card hover:border-primary/30 text-foreground font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
            >
              View Full Portfolio & Case Studies
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══ CTA STRIP ═════════════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[300px] bg-primary/15 rounded-full blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="container px-4 mx-auto max-w-3xl relative text-center"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/20 mb-5">
            <Star className="w-3.5 h-3.5" /> Open to Opportunities
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground font-heading mb-5 tracking-tight">
            Let&apos;s Build Something{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">
              Extraordinary
            </span>
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto">
            Whether it&apos;s a national-scale portal, an enterprise dashboard, or a greenfield
            product — reach out and let&apos;s engineer it properly.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-xl shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-primary/40"
            >
              Start a Conversation
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/references"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl border border-border/80 bg-card/60 backdrop-blur-sm hover:bg-card hover:border-primary/30 text-foreground font-semibold text-sm transition-all hover:-translate-y-0.5"
            >
              <BadgeCheck className="h-4 w-4 text-primary" />
              Read References
            </Link>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-[11px] text-muted-foreground">
            {[
              "10+ Live Projects",
              "4+ Enterprise Clients",
              "Nairobi, Kenya",
              "Remote-Ready",
            ].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <BadgeCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                {t}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════════════════ */}
      <footer className="py-12 border-t border-border/50 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/3 to-transparent pointer-events-none" />
        <div className="container px-4 mx-auto max-w-6xl relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-emerald-400 text-primary-foreground font-extrabold text-sm flex items-center justify-center shadow-md shadow-primary/20">
                KA
              </div>
              <div>
                <p className="font-bold text-foreground font-heading text-sm">Khalfan Athman</p>
                <p className="text-xs text-muted-foreground">Network Engineer · Full-Stack Developer</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {[
                { href: "https://github.com/AbuArwa001", icon: Github, label: "GitHub" },
                { href: "https://www.linkedin.com/in/khalfaniathman", icon: Linkedin, label: "LinkedIn" },
                { href: "mailto:khalfan@khalfanathman.dev", icon: Mail, label: "Email" },
              ].map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="p-2.5 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                  aria-label={label}
                >
                  <Icon className="h-4.5 w-4.5" />
                </Link>
              ))}
            </div>

            <p className="text-xs text-muted-foreground font-mono">
              © {new Date().getFullYear()} · Built with Next.js & Django
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
