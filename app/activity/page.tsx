"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  Github, Star, GitFork, GitCommit, Users, BookOpen,
  Code2, ExternalLink, Activity, Globe, Flame, Clock,
  ArrowUpRight, TrendingUp, Package,
} from "lucide-react";

const GH_USER = "AbuArwa001";
const GH_API = `https://api.github.com/users/${GH_USER}`;
const REPOS_API = `https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=updated`;
const EVENTS_API = `https://api.github.com/users/${GH_USER}/events/public?per_page=30`;
const CONTRIB_API = `https://github-contributions-api.jogruber.de/v4/${GH_USER}?y=last`;

// ─── Types ─────────────────────────────────────────────────────────────────────
interface GHUser {
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  bio: string;
  html_url: string;
}

interface GHRepo {
  id: number;
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  html_url: string;
  updated_at: string;
  topics: string[];
  fork: boolean;
}

interface GHEvent {
  id: string;
  type: string;
  created_at: string;
  repo: { name: string; url: string };
  payload: { commits?: { message: string }[]; ref?: string; action?: string };
}

interface ContribDay { date: string; count: number; level: 0 | 1 | 2 | 3 | 4; }

// ─── Helpers ──────────────────────────────────────────────────────────────────
const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const eventLabel = (e: GHEvent): string => {
  switch (e.type) {
    case "PushEvent": {
      const n = e.payload.commits?.length ?? 0;
      const msg = e.payload.commits?.[0]?.message?.split("\n")[0] ?? "";
      return `Pushed ${n} commit${n !== 1 ? "s" : ""}${msg ? ` — ${msg}` : ""}`;
    }
    case "CreateEvent": return `Created ${e.payload.ref ?? "branch/tag"}`;
    case "WatchEvent": return "Starred a repository";
    case "ForkEvent": return "Forked a repository";
    case "IssuesEvent": return `${e.payload.action} an issue`;
    case "PullRequestEvent": return `${e.payload.action} a pull request`;
    default: return e.type.replace("Event", "");
  }
};

const LEVEL_COLORS = [
  "bg-white/5 border-white/10",
  "bg-emerald-900/60 border-emerald-800/40",
  "bg-emerald-700/60 border-emerald-600/40",
  "bg-emerald-500/60 border-emerald-400/40",
  "bg-emerald-400/80 border-emerald-300/60",
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

// ─── Contribution Calendar ────────────────────────────────────────────────────
function CalendarGrid({ days }: { days: ContribDay[] }) {
  // Group into weeks
  const weeks: ContribDay[][] = [];
  let week: ContribDay[] = [];
  days.forEach((d, i) => {
    week.push(d);
    if (week.length === 7 || i === days.length - 1) {
      weeks.push(week);
      week = [];
    }
  });

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-[3px] min-w-max">
        {weeks.map((wk, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {wk.map((d) => (
              <div
                key={d.date}
                title={`${d.date}: ${d.count} contribution${d.count !== 1 ? "s" : ""}`}
                className={`w-3 h-3 rounded-[2px] border ${LEVEL_COLORS[d.level]} cursor-default transition-all hover:scale-125`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Language Bar ─────────────────────────────────────────────────────────────
const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f7df1e", Python: "#3572a5",
  "C": "#555555", "C++": "#f34b7d", HTML: "#e34c26", CSS: "#563d7c",
  Shell: "#89e051", Dockerfile: "#384d54", Vue: "#41b883", Other: "#8b8b8b",
};

function LanguageBar({ langs }: { langs: Record<string, number> }) {
  const total = Object.values(langs).reduce((s, v) => s + v, 0);
  const sorted = Object.entries(langs).sort(([, a], [, b]) => b - a).slice(0, 8);
  return (
    <div>
      <div className="flex rounded-full overflow-hidden h-2.5 mb-4">
        {sorted.map(([lang, count]) => (
          <div
            key={lang}
            style={{ width: `${(count / total) * 100}%`, backgroundColor: LANG_COLORS[lang] ?? LANG_COLORS.Other }}
            title={`${lang}: ${((count / total) * 100).toFixed(1)}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {sorted.map(([lang, count]) => (
          <div key={lang} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: LANG_COLORS[lang] ?? LANG_COLORS.Other }}
            />
            <span className="text-xs text-muted-foreground">{lang}</span>
            <span className="text-xs text-muted-foreground/60">
              {((count / total) * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function ActivityPage() {
  const [user, setUser] = useState<GHUser | null>(null);
  const [repos, setRepos] = useState<GHRepo[]>([]);
  const [events, setEvents] = useState<GHEvent[]>([]);
  const [contribDays, setContribDays] = useState<ContribDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [uRes, rRes, eRes, cRes] = await Promise.allSettled([
          fetch(GH_API).then((r) => r.json()),
          fetch(REPOS_API).then((r) => r.json()),
          fetch(EVENTS_API).then((r) => r.json()),
          fetch(CONTRIB_API).then((r) => r.json()),
        ]);
        if (uRes.status === "fulfilled") setUser(uRes.value);
        if (rRes.status === "fulfilled" && Array.isArray(rRes.value)) setRepos(rRes.value);
        if (eRes.status === "fulfilled" && Array.isArray(eRes.value)) setEvents(eRes.value);
        if (cRes.status === "fulfilled" && cRes.value?.contributions) {
          setContribDays(cRes.value.contributions);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Derived stats
  const ownRepos = repos.filter((r) => !r.fork);
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks_count, 0);
  const topRepos = [...ownRepos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6);
  const totalContribs = contribDays.reduce((s, d) => s + d.count, 0);

  // Language map
  const langMap: Record<string, number> = {};
  repos.forEach((r) => {
    if (r.language) langMap[r.language] = (langMap[r.language] ?? 0) + 1;
  });

  const HIGHLIGHTS = [
    { label: "Public Repos", value: (user?.public_repos ?? ownRepos.length) || "—", icon: <BookOpen className="h-5 w-5" />, color: "text-indigo-400" },
    { label: "Total Stars", value: totalStars || "—", icon: <Star className="h-5 w-5" />, color: "text-amber-400" },
    { label: "Total Forks", value: totalForks || "—", icon: <GitFork className="h-5 w-5" />, color: "text-sky-400" },
    { label: "Contributions (yr)", value: totalContribs > 0 ? totalContribs.toLocaleString() : "—", icon: <GitCommit className="h-5 w-5" />, color: "text-emerald-400" },
    { label: "Followers", value: user?.followers ?? "—", icon: <Users className="h-5 w-5" />, color: "text-purple-400" },
    { label: "Following", value: user?.following ?? "—", icon: <Activity className="h-5 w-5" />, color: "text-pink-400" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground">Loading GitHub data…</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background selection:bg-primary/30">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] opacity-15 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/50 via-primary/30 to-purple-500/20 blur-[120px] rounded-full" />
      </div>

      <div className="container px-4 mx-auto pt-32 pb-24">

        {/* ── Header ── */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
            <Github className="w-4 h-4" />
            <span>@{GH_USER} · Live GitHub Data</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-5">
            Coding{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">Activity</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Live statistics, contribution history, and repository insights pulled directly from the GitHub API.
          </p>
          <div className="mt-6">
            <a
              href={`https://github.com/${GH_USER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Github className="h-4 w-4" /> Visit GitHub Profile <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </motion.div>

        {error && (
          <div className="mb-10 p-4 rounded-xl border border-destructive/20 bg-destructive/5 text-sm text-destructive">
            ⚠️ Could not reach GitHub API. Some data may be unavailable.
          </div>
        )}

        {/* ── Highlight Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-14">
          {HIGHLIGHTS.map((s, i) => (
            <motion.div
              key={s.label}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm hover:border-primary/40 transition-all duration-300 text-center"
            >
              <div className={s.color}>{s.icon}</div>
              <span className={`text-2xl font-extrabold ${s.color}`}>{s.value}</span>
              <span className="text-xs text-muted-foreground font-medium leading-tight">{s.label}</span>
            </motion.div>
          ))}
        </div>

        {/* ── Section: Contribution Calendar ── */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary/70 mb-2">Contribution Calendar</h2>
          <div className="h-px bg-gradient-to-r from-primary/40 via-border/40 to-transparent mb-8" />
        </motion.div>

        <motion.div
          custom={1} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 mb-14 hover:border-primary/30 transition-all"
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2 text-primary">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-semibold">Past Year Contributions</span>
            </div>
            {totalContribs > 0 && (
              <span className="text-xs text-muted-foreground font-mono">
                {totalContribs.toLocaleString()} total this year
              </span>
            )}
          </div>
          {contribDays.length > 0 ? (
            <>
              <CalendarGrid days={contribDays} />
              <div className="flex items-center gap-1.5 mt-3 justify-end">
                <span className="text-xs text-muted-foreground">Less</span>
                {LEVEL_COLORS.map((cls, i) => (
                  <div key={i} className={`w-3 h-3 rounded-[2px] border ${cls}`} />
                ))}
                <span className="text-xs text-muted-foreground">More</span>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Contribution data unavailable — visit{" "}
              <a href={`https://github.com/${GH_USER}`} className="text-primary underline" target="_blank" rel="noopener noreferrer">
                github.com/{GH_USER}
              </a>
            </p>
          )}
        </motion.div>

        {/* ── Section: Languages ── */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary/70 mb-2">Languages & Activity</h2>
          <div className="h-px bg-gradient-to-r from-primary/40 via-border/40 to-transparent mb-8" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          {/* Language breakdown */}
          <motion.div
            custom={1} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 hover:border-primary/30 transition-all"
          >
            <div className="flex items-center gap-2 text-primary mb-5">
              <Code2 className="h-4 w-4" />
              <span className="text-sm font-semibold">Language Distribution</span>
            </div>
            {Object.keys(langMap).length > 0 ? (
              <LanguageBar langs={langMap} />
            ) : (
              <p className="text-sm text-muted-foreground">Loading…</p>
            )}
          </motion.div>

          {/* Recent events feed */}
          <motion.div
            custom={2} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-6 hover:border-primary/30 transition-all"
          >
            <div className="flex items-center gap-2 text-primary mb-5">
              <Flame className="h-4 w-4" />
              <span className="text-sm font-semibold">Recent Activity</span>
              <span className="ml-auto flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400 font-medium">Live</span>
              </span>
            </div>
            {events.length > 0 ? (
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 scrollbar-thin">
                {events.slice(0, 12).map((ev) => (
                  <div key={ev.id} className="flex items-start gap-3 text-xs">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground/60 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground/90 truncate">{eventLabel(ev)}</p>
                      <p className="text-muted-foreground/60 truncate">
                        {ev.repo.name} · {timeAgo(ev.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No recent events found.</p>
            )}
          </motion.div>
        </div>

        {/* ── Section: Top Repos ── */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-primary/70 mb-2">Top Repositories</h2>
          <div className="h-px bg-gradient-to-r from-primary/40 via-border/40 to-transparent mb-8" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-20">
          {topRepos.map((repo, i) => (
            <motion.a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="group flex flex-col rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-5 hover:border-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_-10px] hover:shadow-primary/15"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 text-primary">
                  <Package className="h-4 w-4" />
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                    {repo.name}
                  </span>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-2">
                {repo.description ?? "No description provided."}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {repo.language && (
                  <span className="flex items-center gap-1">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: LANG_COLORS[repo.language] ?? LANG_COLORS.Other }}
                    />
                    {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5" /> {repo.stargazers_count}
                </span>
                <span className="flex items-center gap-1">
                  <GitFork className="h-3.5 w-3.5" /> {repo.forks_count}
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-block rounded-3xl border border-border/60 bg-card p-10">
            <Globe className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3">Want to see the code?</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Browse all my open-source repositories and contribution history directly on GitHub.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a
                href={`https://github.com/${GH_USER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
              >
                <Github className="h-4 w-4" /> GitHub Profile
              </a>
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 border border-border/60 text-muted-foreground font-medium px-6 py-3 rounded-xl hover:border-primary/40 hover:text-foreground transition-colors"
              >
                View Projects
              </Link>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
