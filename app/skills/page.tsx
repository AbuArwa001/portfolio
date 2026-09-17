"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Server,
  Network,
  Cloud,
  Cpu,
  Search,
  CheckCircle2,
  Sparkles,
  Layers,
  Terminal,
} from "lucide-react";
import {
  FaReact,
  FaNodeJs,
  FaAws,
  FaPython,
  FaDocker,
  FaLinux,
  FaGitAlt,
  FaDatabase,
} from "react-icons/fa";
import {
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiPostgresql,
  SiDjango,
  SiFlask,
  SiWireshark,
  SiCisco,
  SiC,
} from "react-icons/si";

interface SkillItem {
  name: string;
  level: number;
}

interface SkillCategoryGroup {
  category: string;
  icon: React.ReactNode;
  description: string;
  skills: SkillItem[];
}

const DEFAULT_CATEGORIES: SkillCategoryGroup[] = [
  {
    category: "Backend & APIs",
    icon: <Server className="h-5 w-5 text-emerald-400" />,
    description: "Robust, decoupled API services, authentication, and database schemas",
    skills: [
      { name: "Python / Django & DRF", level: 95 },
      { name: "REST API Design & Swagger", level: 92 },
      { name: "PostgreSQL & Database Design", level: 88 },
      { name: "Flask & Celery", level: 82 },
      { name: "Node.js & Express", level: 80 },
    ],
  },
  {
    category: "Frontend & Web",
    icon: <Code2 className="h-5 w-5 text-blue-400" />,
    description: "Modern, high-performance web applications and responsive UIs",
    skills: [
      { name: "Next.js 15 & React 19", level: 90 },
      { name: "TypeScript & Modern JS", level: 88 },
      { name: "Tailwind CSS & Shadcn/UI", level: 94 },
      { name: "Framer Motion & Micro-animations", level: 85 },
      { name: "State Management & React Query", level: 84 },
    ],
  },
  {
    category: "Networking & Infrastructure",
    icon: <Network className="h-5 w-5 text-purple-400" />,
    description: "Enterprise networking, routing protocols, and packet inspection",
    skills: [
      { name: "TCP/IP & Routing Protocols", level: 94 },
      { name: "Network Security & Firewalls", level: 88 },
      { name: "Cisco Routers & Switches", level: 85 },
      { name: "Wireshark & Packet Analysis", level: 86 },
      { name: "HAProxy & Load Balancing", level: 82 },
    ],
  },
  {
    category: "Cloud & DevOps",
    icon: <Cloud className="h-5 w-5 text-amber-400" />,
    description: "Cloud architecture, containerization, reverse proxying, and CI/CD",
    skills: [
      { name: "Linux System Administration", level: 92 },
      { name: "Docker & Containerization", level: 85 },
      { name: "AWS Cloud (EC2, S3, RDS)", level: 82 },
      { name: "Oracle Cloud Infrastructure (OCI)", level: 80 },
      { name: "Nginx & Gunicorn Web Servers", level: 88 },
    ],
  },
  {
    category: "Systems & Core",
    icon: <Cpu className="h-5 w-5 text-rose-400" />,
    description: "Low-level systems programming, POSIX, and automation scripting",
    skills: [
      { name: "C Programming & Memory Management", level: 84 },
      { name: "Bash & Shell Scripting", level: 88 },
      { name: "Git & Version Control", level: 92 },
      { name: "Linux POSIX & UNIX Internals", level: 86 },
    ],
  },
];

const SKILL_ICONS: Record<string, React.ReactNode> = {
  "Python / Django & DRF": <SiDjango className="text-emerald-500" />,
  "REST API Design & Swagger": <Server className="text-emerald-400 h-4 w-4" />,
  "PostgreSQL & Database Design": <SiPostgresql className="text-blue-400" />,
  "Flask & Celery": <SiFlask className="text-foreground" />,
  "Node.js & Express": <FaNodeJs className="text-green-500" />,
  "Next.js 15 & React 19": <SiNextdotjs className="text-foreground" />,
  "TypeScript & Modern JS": <SiTypescript className="text-blue-500" />,
  "Tailwind CSS & Shadcn/UI": <SiTailwindcss className="text-cyan-400" />,
  "Framer Motion & Micro-animations": <Sparkles className="text-purple-400 h-4 w-4" />,
  "TCP/IP & Routing Protocols": <Network className="text-purple-400 h-4 w-4" />,
  "Network Security & Firewalls": <Terminal className="text-purple-300 h-4 w-4" />,
  "Cisco Routers & Switches": <SiCisco className="text-sky-400" />,
  "Wireshark & Packet Analysis": <SiWireshark className="text-blue-500" />,
  "Linux System Administration": <FaLinux className="text-yellow-400" />,
  "Docker & Containerization": <FaDocker className="text-blue-400" />,
  "AWS Cloud (EC2, S3, RDS)": <FaAws className="text-orange-400" />,
  "C Programming & Memory Management": <SiC className="text-blue-500" />,
  "Bash & Shell Scripting": <Terminal className="text-emerald-400 h-4 w-4" />,
  "Git & Version Control": <FaGitAlt className="text-orange-500" />,
};

function getLevelLabel(level: number): { text: string; color: string } {
  if (level >= 90) return { text: "Expert", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" };
  if (level >= 80) return { text: "Advanced", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" };
  return { text: "Proficient", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" };
}

export default function SkillsPage() {
  const [categories, setCategories] = useState<SkillCategoryGroup[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${apiUrl}/api/v1/auth/profile/skill-categories/`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped: SkillCategoryGroup[] = data.map((cat: any) => ({
              category: cat.name,
              icon: <Layers className="h-5 w-5 text-primary" />,
              description: `Proficiencies in ${cat.name}`,
              skills: Array.isArray(cat.skills)
                ? cat.skills.map((s: any) => ({ name: s.name, level: s.level }))
                : [],
            }));
            setCategories(mapped);
          }
        }
      } catch {
        // Graceful fallback to rich defaults
      }
    };

    fetchSkills();
  }, []);

  const allCategoryNames = ["All", ...categories.map((c) => c.category)];

  const filteredCategories = categories
    .filter((c) => selectedCategory === "All" || c.category === selectedCategory)
    .map((c) => ({
      ...c,
      skills: c.skills.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((c) => c.skills.length > 0);

  const totalSkills = categories.reduce((acc, c) => acc + c.skills.length, 0);

  return (
    <div className="relative min-h-screen bg-background selection:bg-primary/30">
      {/* Background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] opacity-15 dark:opacity-20 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-blue-500/30 to-purple-500/20 blur-[120px] rounded-full" />
      </div>

      <div className="container px-4 mx-auto pt-32 pb-24 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
            <Sparkles className="w-4 h-4" />
            <span>Technical Mastery & Tooling</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-4 font-heading">
            Skills & <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">Technologies</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A comprehensive overview of full-stack development technologies, networking protocols, cloud architectures, and systems programming capabilities.
          </p>
        </motion.div>

        {/* Controls: Search and Categories */}
        <div className="space-y-4 mb-12">
          {/* Search bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search skill (e.g. Next.js, TCP/IP, Django, Docker)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-md text-foreground text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
            {allCategoryNames.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-[0_0_20px_-5px] shadow-primary/60 scale-105"
                    : "border border-border/60 bg-card/60 text-muted-foreground hover:text-foreground hover:border-primary/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Cards by Category */}
        {filteredCategories.length === 0 ? (
          <div className="p-16 rounded-3xl border border-border/60 bg-card/50 text-center space-y-3">
            <Code2 className="h-10 w-10 text-muted-foreground mx-auto opacity-50" />
            <p className="text-sm font-bold text-foreground">No matching skills found</p>
            <p className="text-xs text-muted-foreground">Try searching for a different keyword or technology.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCategories.map((group, gIdx) => (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: gIdx * 0.08 }}
                className="rounded-3xl border border-border/60 bg-card/80 backdrop-blur-xl p-6 lg:p-8 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                      {group.icon}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-foreground font-heading">
                        {group.category}
                      </h3>
                      <p className="text-xs text-muted-foreground">{group.description}</p>
                    </div>
                  </div>

                  <div className="space-y-4 mt-6">
                    {group.skills.map((skill) => {
                      const badge = getLevelLabel(skill.level);
                      const icon = SKILL_ICONS[skill.name] || <Code2 className="h-4 w-4 text-primary" />;

                      return (
                        <div key={skill.name} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2 font-medium text-foreground">
                              <span className="text-base shrink-0">{icon}</span>
                              <span>{skill.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.color}`}>
                                {badge.text}
                              </span>
                              <span className="font-mono font-bold text-primary">{skill.level}%</span>
                            </div>
                          </div>

                          {/* Animated Progress Bar */}
                          <div className="h-2 w-full rounded-full bg-muted/60 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${skill.level}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="h-full rounded-full bg-gradient-to-r from-primary via-blue-500 to-indigo-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{group.skills.length} core competencies</span>
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Production Tested
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
