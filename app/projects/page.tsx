"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  Github,
  ArrowUpRight,
  Wifi,
  Server,
  Database,
  Code2,
  Globe,
  Clock,
  CheckCircle2,
  Zap,
  Network,
  Terminal,
  Layers,
  Cloud,
  Smartphone,
  Cpu,
  FileCode,
} from "lucide-react";
import { api } from "@/lib/api";

// ─── Project Data ──────────────────────────────────────────────────────────────
type Status = "Live" | "In Progress" | "Completed";
type Category =
  | "All"
  | "Network Engineering"
  | "AWS Solutions Architect"
  | "Mobile (Flutter / Android)"
  | "Full-Stack"
  | "ALX / Systems";

interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  status: Status;
  category: Category;
  tech: string[];
  github?: string;
  live?: string;
  image?: string;
  featured?: boolean;
  year: string;
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: "SUPKEM Digital Portal",
    subtitle: "Supreme Council of Kenya Muslims National Platform",
    description:
      "End-to-end digital presence for the Supreme Council of Kenya Muslims. Features a bi-lingual (EN/AR) news publishing engine, media center, nationwide executive leadership showcase, secure admin dashboard with Excel export, and a national Quran Competition registration portal with real-time capacity enforcement.",
    status: "Live",
    category: "Full-Stack",
    tech: ["Next.js 15", "Django REST Framework", "PostgreSQL", "next-intl", "Tailwind CSS", "JWT"],
    github: "https://github.com/AbuArwa001/supkem",
    live: "https://www.supkem.org/",
    image: "/projects/supkem.png",
    featured: true,
    year: "2025–2026",
  },
  {
    id: 11,
    title: "Enterprise Multi-Branch WAN & Core Topology",
    subtitle: "Cisco Packet Tracer & EVE-NG Network Simulation",
    description:
      "Complete enterprise network architecture connecting HQ and two remote regional offices. Implements dual-homed eBGP to simulated Tier-1 ISPs, internal multi-area OSPF routing with route redistribution, 802.1Q VLAN trunking with Inter-VLAN routing, and HSRP default gateway redundancy. End-to-end packet flows, security ACLs, and failover convergence were rigorously validated with Wireshark packet capture.",
    status: "Completed",
    category: "Network Engineering",
    tech: ["Cisco Packet Tracer", "EVE-NG", "GNS3", "Wireshark", "Cisco IOS", "BGP", "OSPF", "VLANs", "HSRP"],
    github: "https://github.com/AbuArwa001",
    live: "https://github.com/AbuArwa001",
    featured: true,
    year: "2024–2025",
  },
  {
    id: 13,
    title: "AWS Multi-Tier High-Availability Cloud Infrastructure",
    subtitle: "Well-Architected Cloud Architecture via Terraform IaC",
    description:
      "Production-ready, fault-tolerant 3-tier cloud architecture provisioned across multiple AWS Availability Zones. Features custom VPC with public and isolated private subnets, Application Load Balancers with automated health checks, Auto-Scaling EC2 instances, Amazon RDS Multi-AZ PostgreSQL cluster, S3 static assets with CloudFront CDN distribution, Route 53 DNS routing, and full automated provisioning using Terraform.",
    status: "Completed",
    category: "AWS Solutions Architect",
    tech: ["AWS", "AWS VPC", "Terraform", "EC2", "S3", "RDS Multi-AZ", "Route 53", "CloudFront", "IAM"],
    github: "https://github.com/AbuArwa001",
    live: "https://github.com/AbuArwa001",
    featured: true,
    year: "2025",
  },
  {
    id: 2,
    title: "Langata Islamic Center",
    subtitle: "Community Mosque & Digital Hub",
    description:
      "Full digital hub and web presence for Langata Islamic Center & Mosque. Features real-time donation drives, community announcements, prayer schedules, event management, and programme listings with a high-performance decoupled Next.js frontend and Python DRF REST API backend.",
    status: "Live",
    category: "Full-Stack",
    tech: ["Next.js 15", "TypeScript", "Django REST Framework", "Python", "PostgreSQL", "Tailwind CSS"],
    github: "https://github.com/AbuArwa001/LangataIslamicCenter",
    live: "https://www.langataislamiccenter.org/",
    image: "/projects/langata-islamic-center.png",
    featured: true,
    year: "2025–2026",
  },
  {
    id: 14,
    title: "Mobile Portal & Real-Time Sync (Flutter & Android)",
    subtitle: "Offline-First Android App with SQLite Caching & Firebase",
    description:
      "Modern cross-platform mobile application engineered for Android using Flutter and Dart. Features reactive state management with Riverpod, offline-first SQLite database synchronization, Firebase Cloud Messaging for real-time push notifications, and native Android biometric authentication with secure storage.",
    status: "Live",
    category: "Mobile (Flutter / Android)",
    tech: ["Flutter", "Dart", "Android Studio", "Firebase", "SQLite", "Riverpod", "REST API"],
    github: "https://github.com/AbuArwa001",
    live: "https://github.com/AbuArwa001",
    featured: false,
    year: "2025",
  },
  {
    id: 12,
    title: "Datacenter Spine-Leaf & Perimeter Firewall Lab",
    subtitle: "GNS3 Multi-Vendor Virtual Network & Security Emulation",
    description:
      "Datacenter spine-and-leaf network topology emulated in GNS3 combining Cisco routers, VyOS switches, and pfSense firewalls. Features redundant pfSense firewalls configured with CARP failover, DMZ network isolation for public servers, Site-to-Site IPsec VPN tunnels, and automated configuration backups with Python Netmiko scripts.",
    status: "Completed",
    category: "Network Engineering",
    tech: ["GNS3", "pfSense", "Wireshark", "IPsec VPN", "Python", "BGP", "Linux"],
    github: "https://github.com/AbuArwa001",
    featured: false,
    year: "2024",
  },
  {
    id: 3,
    title: "jamiaGive Admin Dashboard",
    subtitle: "Jamia Mosque Donation & Charity Operations Dashboard",
    description:
      "Feature-rich administrative dashboard for Jamia Mosque Nairobi's donation operations. Includes real-time donation tracking, structured fund categories, scheduled drives, secure inter-account transfers, and financial transaction audit logging — powered by a DRF REST API backend.",
    status: "In Progress",
    category: "Full-Stack",
    tech: ["Next.js", "TypeScript", "Django REST Framework", "PostgreSQL", "Radix UI", "Tailwind CSS"],
    github: "https://github.com/AbuArwa001/JMCAdminDashboard",
    live: "https://jmc-admin-dashboard.vercel.app/",
    image: "/projects/jmc-admin-dashboard.png",
    featured: true,
    year: "2025–Ongoing",
  },
  {
    id: 4,
    title: "SeaFood Platform & Analytics Dashboard",
    subtitle: "E-Commerce & Real-Time Sales Analytics Dashboard",
    description:
      "Full-stack seafood commerce and supply platform featuring an executive analytics dashboard. Delivers inventory management, product cataloguing, order fulfilment tracking, real-time revenue analytics, and interactive data visualisations powered by a Python DRF API backend.",
    status: "Live",
    category: "Full-Stack",
    tech: ["TypeScript", "Next.js", "Python", "Django REST Framework", "Recharts", "PostgreSQL"],
    github: "https://github.com/AbuArwa001/seafood-dashboard",
    live: "https://seafooddashboard.vercel.app/",
    image: "/projects/seafood-dashboard.png",
    featured: true,
    year: "2025–2026",
  },
  {
    id: 5,
    title: "Religious Attaché KSA",
    subtitle: "Embassy Digital Services Portal",
    description:
      "Production platform for the Kenya Religious Attaché office in Saudi Arabia. Handles service requests, news publishing, and official announcements. Built with a decoupled Next.js frontend and Django REST Framework API on a secured cloud server.",
    status: "Live",
    category: "Full-Stack",
    tech: ["Next.js", "Django REST Framework", "PostgreSQL", "Python", "Nginx"],
    github: "https://github.com/AbuArwa001/DRF_RELIGIOUS_ATTACHE",
    live: "https://www.religiousattacheksa.co.ke/en",
    image: "/projects/langata-islamic-center.png",
    year: "2024–2025",
  },
  {
    id: 6,
    title: "Kuranet — Voting System API",
    subtitle: "Distributed Voting Infrastructure",
    description:
      "Secure distributed voting API featuring a three-server architecture: two web servers behind a load balancer. Implements JWT authentication, database replication, rate limiting, and DDoS protection. Forked by the community.",
    status: "Completed",
    category: "Network Engineering",
    tech: ["Python", "Flask", "HAProxy", "MySQL", "JWT", "Nginx", "AWS"],
    github: "https://github.com/AbuArwa001/kuranet",
    year: "2024",
  },
  {
    id: 7,
    title: "Portfolio Backend API",
    subtitle: "Personal Portfolio REST API",
    description:
      "Django REST Framework API powering this portfolio site. Exposes endpoints for projects, skills, blog posts, and contact messages. Deployed on a VPS with Nginx reverse proxy and PostgreSQL.",
    status: "Live",
    category: "Full-Stack",
    tech: ["Django REST Framework", "PostgreSQL", "Python", "Nginx", "Docker"],
    github: "https://github.com/AbuArwa001/portfolio-backend",
    year: "2025",
  },
  {
    id: 8,
    title: "ALX — Simple Shell",
    subtitle: "UNIX Shell Implementation in C",
    description:
      "From-scratch UNIX shell built in C as part of the ALX Software Engineering curriculum. Implements command parsing, process forking, piping, redirection, built-in commands (cd, env, exit), and PATH resolution.",
    status: "Completed",
    category: "ALX / Systems",
    tech: ["C", "POSIX", "Linux", "GCC", "Valgrind"],
    github: "https://github.com/AbuArwa001",
    year: "2022–2023",
  },
  {
    id: 9,
    title: "ALX — Printf Implementation",
    subtitle: "Custom libc printf in C",
    description:
      "A complete re-implementation of the C standard library printf function, supporting all major format specifiers (%s, %d, %f, %c, %x, %o, %b and custom), variadic arguments, and flags/width/precision handling.",
    status: "Completed",
    category: "ALX / Systems",
    tech: ["C", "Variadic Functions", "GCC", "Linux"],
    github: "https://github.com/AbuArwa001",
    year: "2022",
  },
  {
    id: 10,
    title: "JMC Donations Endpoints",
    subtitle: "Charity API Microservice",
    description:
      "Lightweight REST API microservice for processing and recording charitable donations at Jamia Mosque. Serves as the data layer for the jamiaGive dashboard — handles payment webhook integration and fund allocation logic.",
    status: "Completed",
    category: "Full-Stack",
    tech: ["Python", "Django REST Framework", "PostgreSQL", "REST API"],
    github: "https://github.com/AbuArwa001/JMCDonationsEndpoints",
    year: "2024",
  },
];

// ─── Config ────────────────────────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  "All",
  "Network Engineering",
  "AWS Solutions Architect",
  "Mobile (Flutter / Android)",
  "Full-Stack",
  "ALX / Systems",
];

const STATUS_CONFIG: Record<Status, { label: string; color: string; dot: string }> = {
  Live: {
    label: "Live",
    color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    dot: "bg-emerald-400",
  },
  "In Progress": {
    label: "In Progress",
    color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    dot: "bg-amber-400",
  },
  Completed: {
    label: "Completed",
    color: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    dot: "bg-sky-400",
  },
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "Network Engineering": <Network className="h-4 w-4" />,
  "Networking": <Network className="h-4 w-4" />,
  "AWS Solutions Architect": <Cloud className="h-4 w-4" />,
  "Mobile (Flutter / Android)": <Smartphone className="h-4 w-4" />,
  "Full-Stack": <Layers className="h-4 w-4" />,
  "ALX / Systems": <Terminal className="h-4 w-4" />,
};

// ─── Animation Variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

// ─── Sub-components ────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
      {cfg.label}
    </span>
  );
}

function TechTag({ tech }: { tech: string }) {
  return (
    <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
      {tech}
    </span>
  );
}

function FeaturedCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="group relative grid grid-cols-1 lg:grid-cols-2 rounded-3xl border border-border/60 bg-card overflow-hidden hover:border-primary/40 transition-all duration-500 hover:shadow-[0_0_60px_-15px] hover:shadow-primary/20"
    >
      {/* Image Panel */}
      {project.image && (
        <div
          className={`relative aspect-video lg:aspect-auto overflow-hidden ${
            index % 2 === 1 ? "lg:order-2" : ""
          }`}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-card/60 via-card/20 to-transparent lg:block hidden" />
          <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent lg:hidden" />
          {/* Status overlay */}
          <div className="absolute top-4 left-4">
            <StatusBadge status={project.status} />
          </div>
        </div>
      )}

      {/* Content Panel */}
      <div className={`flex flex-col justify-center p-8 lg:p-12 ${index % 2 === 1 ? "lg:order-1" : ""}`}>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-primary/70">
            {project.category}
          </span>
          <span className="text-border/60">·</span>
          <span className="text-xs text-muted-foreground">{project.year}</span>
        </div>

        <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
          {project.title}
        </h2>
        <p className="text-sm text-muted-foreground mb-4 font-medium">{project.subtitle}</p>
        <p className="text-muted-foreground leading-relaxed mb-6 text-sm lg:text-base">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-8">
          {project.tech.map((t) => (
            <TechTag key={t} tech={t} />
          ))}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors border border-border/60 hover:border-border px-4 py-2 rounded-xl"
            >
              <Github className="h-4 w-4" />
              <span>
                {project.category.includes("Network")
                  ? "Lab Topology / Configs"
                  : project.category.includes("AWS")
                  ? "Terraform IaC"
                  : project.category.includes("Mobile")
                  ? "Flutter Codebase"
                  : "Source Code"}
              </span>
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors px-4 py-2 rounded-xl"
            >
              <Globe className="h-4 w-4" />
              <span>
                {project.category.includes("Network")
                  ? "View Topology Diagram"
                  : project.category.includes("AWS")
                  ? "Cloud Architecture Blueprint"
                  : project.category.includes("Mobile")
                  ? "APK / App Demo"
                  : "View Live Portal"}
              </span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      initial="hidden"
      animate="show"
      layout
      className="group relative flex flex-col rounded-2xl border border-border/60 bg-card overflow-hidden hover:border-primary/40 transition-all duration-400 hover:shadow-[0_0_40px_-10px] hover:shadow-primary/15"
    >
      {/* Image */}
      {project.image ? (
        <div className="relative h-44 overflow-hidden">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
          <div className="absolute top-3 right-3">
            <StatusBadge status={project.status} />
          </div>
        </div>
      ) : (
        <div className="relative h-44 bg-gradient-to-br from-primary/10 via-card to-blue-500/10 flex flex-col items-center justify-center border-b border-border/40 p-4">
          <div className="text-primary/70 group-hover:scale-110 transition-transform duration-300 mb-2">
            {CATEGORY_ICONS[project.category] || <Code2 className="h-10 w-10" />}
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary uppercase tracking-wider text-center">
            {project.category}
          </span>
          <div className="absolute top-3 right-3">
            <StatusBadge status={project.status} />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs uppercase tracking-widest font-semibold text-primary/70">
            {project.category}
          </span>
          <span className="text-border/50">·</span>
          <span className="text-xs text-muted-foreground">{project.year}</span>
        </div>

        <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-xs text-muted-foreground mb-3 font-medium">{project.subtitle}</p>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-1">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tech.slice(0, 4).map((t) => (
            <TechTag key={t} tech={t} />
          ))}
          {project.tech.length > 4 && (
            <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-muted-foreground">
              +{project.tech.length - 4}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-border/40">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors border border-border/40 hover:border-border"
              aria-label="Code or Lab Repository"
            >
              <Github className="h-3.5 w-3.5" />
              <span>
                {project.category.includes("Network")
                  ? "Lab Files"
                  : project.category.includes("AWS")
                  ? "Terraform"
                  : project.category.includes("Mobile")
                  ? "Mobile Repo"
                  : "Code"}
              </span>
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-primary/10 transition-colors border border-primary/20 hover:border-primary/40"
              aria-label="Live Demo or Architecture Topology"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>
                {project.category.includes("Network")
                  ? "Topology"
                  : project.category.includes("AWS")
                  ? "Architecture"
                  : project.category.includes("Mobile")
                  ? "APK / Demo"
                  : "Live Demo"}
              </span>
            </a>
          )}
          <div className="flex-1" />
          <span className="text-xs text-muted-foreground/60 font-mono">#{String(project.id).padStart(2, "0")}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Stats Bar ─────────────────────────────────────────────────────────────────
function StatsBar({ projects }: { projects: Project[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const total = projects.length;
  const live = projects.filter((p) => p.status === "Live").length;
  const inProgress = projects.filter((p) => p.status === "In Progress").length;
  const completed = projects.filter((p) => p.status === "Completed").length;

  const stats = [
    { label: "Total Projects", value: total, icon: <Layers className="h-5 w-5" />, color: "text-primary" },
    { label: "Live in Production", value: live, icon: <CheckCircle2 className="h-5 w-5" />, color: "text-emerald-400" },
    { label: "In Progress", value: inProgress, icon: <Clock className="h-5 w-5" />, color: "text-amber-400" },
    { label: "Completed", value: completed, icon: <Zap className="h-5 w-5" />, color: "text-sky-400" },
  ];

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      variants={stagger}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
    >
      {stats.map((s) => (
        <motion.div
          key={s.label}
          variants={fadeUp}
          custom={0}
          className="flex flex-col items-center justify-center p-6 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm text-center hover:border-primary/30 transition-colors"
        >
          <div className={`mb-2 ${s.color}`}>{s.icon}</div>
          <span className={`text-3xl font-extrabold ${s.color} font-heading`}>{s.value}</span>
          <span className="text-xs text-muted-foreground mt-1 font-medium">{s.label}</span>
        </motion.div>
      ))}
    </motion.div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [projectList, setProjectList] = useState<Project[]>(PROJECTS);

  useEffect(() => {
    let isMounted = true;
    api.projects
      .get()
      .then((backendProjects) => {
        if (!isMounted || !Array.isArray(backendProjects) || backendProjects.length === 0) return;
        const mapped: Project[] = backendProjects.map((p) => {
          let category: Category = "Full-Stack";
          const lower = (p.type || "").toLowerCase();
          if (
            lower.includes("network") ||
            lower.includes("packet tracer") ||
            lower.includes("eve-ng") ||
            lower.includes("gns3") ||
            lower.includes("cisco")
          ) {
            category = "Network Engineering";
          } else if (
            lower.includes("aws") ||
            lower.includes("cloud") ||
            lower.includes("solution architect")
          ) {
            category = "AWS Solutions Architect";
          } else if (
            lower.includes("mobile") ||
            lower.includes("android") ||
            lower.includes("flutter")
          ) {
            category = "Mobile (Flutter / Android)";
          } else if (
            lower.includes("systems") ||
            lower.includes("alx")
          ) {
            category = "ALX / Systems";
          }

          let status: Status = "Live";
          if (p.status === "In Progress") status = "In Progress";
          else if (p.status === "Completed") status = "Completed";

          const prevMatch = PROJECTS.find((pr) => {
            const prLower = pr.title.toLowerCase();
            const pLower = (p.name || "").toLowerCase();
            return prLower === pLower || pLower.includes(prLower) || prLower.includes(pLower);
          });

          return {
            id: p.id,
            title: p.name,
            subtitle: p.type || prevMatch?.subtitle || "Engineering Project",
            description: p.description || prevMatch?.description || "",
            status,
            category,
            tech: p.technologies
              ? p.technologies.split(",").map((t) => t.trim()).filter(Boolean)
              : (prevMatch?.tech || []),
            live: p.link || prevMatch?.live || undefined,
            github: p.github_link || prevMatch?.github || undefined,
            image: p.image || prevMatch?.image || undefined,
            year: p.created_at ? new Date(p.created_at).getFullYear().toString() : (prevMatch?.year || "2025"),
            featured: prevMatch ? Boolean(prevMatch.featured) : false,
          };
        });

        setProjectList((prev) => {
          const mappedNames = mapped.map((m) => m.title.toLowerCase());
          const unrepresented = prev.filter((p) => {
            const pTitle = p.title.toLowerCase();
            return !mappedNames.some((m) => m === pTitle || m.includes(pTitle) || pTitle.includes(m));
          });
          return [...mapped, ...unrepresented];
        });
      })
      .catch((err) => {
        console.warn("Could not fetch projects from backend, using curated showcase:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const featured = projectList.filter((p) => p.featured);
  const rest = projectList.filter((p) => !p.featured);

  const filtered =
    activeCategory === "All"
      ? rest
      : rest.filter((p) => p.category === activeCategory);

  return (
    <div className="relative min-h-screen bg-background selection:bg-primary/30">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] opacity-15 dark:opacity-20 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-blue-500/30 to-purple-500/20 blur-[120px] rounded-full" />
      </div>

      <div className="container px-4 mx-auto pt-32 pb-24">

        {/* ── Hero Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
            <Network className="w-4 h-4" />
            <span>6+ Years · 15+ Projects · Production & Multi-Vendor Labs</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-5">
            Engineering{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
              Portfolio
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Enterprise network simulations (Cisco Packet Tracer, EVE-NG, GNS3), AWS Well-Architected cloud solutions, Flutter mobile apps, and production full-stack systems.
          </p>
        </motion.div>

        {/* ── Stats ── */}
        <StatsBar projects={projectList} />

        {/* ── Featured Projects ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary/70 mb-2">
            Featured Case Studies
          </h2>
          <div className="h-px bg-gradient-to-r from-primary/40 via-border/40 to-transparent mb-10" />
        </motion.div>

        <div className="flex flex-col gap-8 mb-24">
          {featured.map((p, i) => (
            <FeaturedCard key={p.id} project={p} index={i} />
          ))}
        </div>

        {/* ── All Other Projects ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-6"
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary/70 mb-2">
            All Projects
          </h2>
          <div className="h-px bg-gradient-to-r from-primary/40 via-border/40 to-transparent mb-8" />
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_-5px] shadow-primary/40"
                  : "bg-card text-muted-foreground border-border/60 hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {cat !== "All" && CATEGORY_ICONS[cat]}
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeCategory}
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Code2 className="h-8 w-8 text-primary/50" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No projects in this category yet</h3>
            <p className="text-muted-foreground">Check back soon — more work is always in progress.</p>
          </motion.div>
        )}

        {/* ── GitHub Activity Teaser ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-20 mb-12"
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary/70 mb-2">
            Coding Activity
          </h2>
          <div className="h-px bg-gradient-to-r from-primary/40 via-border/40 to-transparent mb-8" />

          {/* Static CTA — live stats are on /activity page */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 shrink-0">
              <Github className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-foreground mb-1">
                Live GitHub Stats Dashboard
              </h3>
              <p className="text-sm text-muted-foreground max-w-lg">
                View my full coding activity — contribution calendar, language breakdown,
                recent commits, top repositories, and live event feed — all pulled
                directly from the GitHub API in real time.
              </p>
            </div>
            <Link
              href="/activity"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors shrink-0"
            >
              <Github className="h-4 w-4" />
              View Activity
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="inline-block rounded-3xl border border-border/60 bg-card p-10">
            <Server className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3">Want to collaborate?</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              I'm open to freelance, contract, and full-time opportunities in network engineering and full-stack development.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
            >
              Get in Touch <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
