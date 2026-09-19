import Link from "next/link";
import { Calendar, Clock, ArrowRight, Rss, WifiOff, ExternalLink, Sparkles, BookOpen } from "lucide-react";
import { getApiUrl } from "@/lib/config";

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  subtitle?: string;
  content: string;
  cover_image?: string;
  source?: "manual" | "medium";
  canonical_url?: string;
  tags?: string[];
  read_time_minutes?: number;
  read_time?: number;
  published_at?: string;
  created_at: string;
};

const FALLBACK_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "Architecting Decoupled Next.js 15 & Django REST APIs for Scale",
    slug: "architecting-decoupled-nextjs-and-django-apis",
    subtitle: "Building high-performance web platforms requires a clean separation of concerns.",
    content:
      "Building high-performance web platforms requires a clean separation of concerns. In this article, we explore the architectural decisions behind coupling Next.js 15 App Router with a stateless Django REST Framework (DRF) backend, covering JWT authentication, SSL termination, and PostgreSQL connection pooling.",
    created_at: "2026-03-01T00:00:00Z",
    published_at: "2026-03-01T00:00:00Z",
    read_time_minutes: 5,
    tags: ["Next.js", "Django", "Architecture"],
    source: "manual",
  },
  {
    id: 2,
    title: "Network Engineering Principles Every Backend Developer Should Know",
    slug: "network-engineering-principles-for-backend-devs",
    subtitle: "Software performance doesn't stop at the application layer.",
    content:
      "Software performance doesn't stop at the application layer. Understanding OSI Layer 3 through Layer 7 routing, TCP three-way handshake optimization, DNS propagation, and VPC isolation fundamentally changes how you design resilient distributed systems.",
    created_at: "2026-02-15T00:00:00Z",
    published_at: "2026-02-15T00:00:00Z",
    read_time_minutes: 6,
    tags: ["Networking", "DevOps", "Performance"],
    source: "manual",
  },
];

async function getPosts(): Promise<BlogPost[]> {
  try {
    const apiUrl = getApiUrl();
    const res = await fetch(`${apiUrl}/api/v1/blog/`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return FALLBACK_POSTS;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : FALLBACK_POSTS;
  } catch {
    return FALLBACK_POSTS;
  }
}

export const metadata = {
  title: "Blog — Khalfan Athman",
  description:
    "Technical articles on network engineering, Django REST Framework, Next.js architecture, Linux internals, and production systems by Khalfan Athman.",
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="relative min-h-screen bg-background selection:bg-primary/30 overflow-x-hidden">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[900px] h-[400px] opacity-10 dark:opacity-15 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-blue-500/20 to-transparent blur-[120px] rounded-full" />
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto pt-24 sm:pt-32 pb-16 sm:pb-24 max-w-5xl">
        {/* Header */}
        <div className="mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 sm:mb-6 text-xs sm:text-sm font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
            <Rss className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Technical Writing &amp; Research</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-4 sm:mb-5">
            The{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
              Blog
            </span>
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Practical deep-dives on network engineering, distributed systems,
            Django REST APIs, Next.js architecture, and real-world postmortems.
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {posts.map((post, i) => {
              const readTime = post.read_time_minutes || post.read_time || 4;
              const dateStr = post.published_at || post.created_at;
              const displayDate = new Date(dateStr).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group relative flex flex-col rounded-3xl border border-border/60 bg-card/60 backdrop-blur-sm overflow-hidden hover:border-primary/40 hover:shadow-[0_0_40px_-10px] hover:shadow-primary/20 transition-all duration-300"
                >
                  {/* Card Cover Image */}
                  {post.cover_image ? (
                    <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-muted/40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
                    </div>
                  ) : (
                    <div className="relative h-32 sm:h-36 w-full overflow-hidden bg-gradient-to-br from-primary/10 via-blue-500/5 to-transparent flex items-center justify-center border-b border-border/40">
                      <BookOpen className="h-10 w-10 text-primary/30 group-hover:scale-110 group-hover:text-primary/50 transition-all duration-300" />
                    </div>
                  )}

                  {/* Card Body */}
                  <div className="flex flex-col flex-1 p-5 sm:p-6">
                    {/* Top Metadata Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        {post.source === "medium" ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                            Medium Story
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/25">
                            Original Article
                          </span>
                        )}

                        {post.tags && post.tags.length > 0 && (
                          <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.5 rounded bg-muted/40">
                            #{post.tags[0]}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 shrink-0" />
                          {displayDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 shrink-0" />
                          {readTime} min read
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-2 font-heading">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed line-clamp-3 mb-5 flex-1">
                      {post.subtitle || post.content.replace(/<[^>]+>/g, " ").slice(0, 180).trim() + "…"}
                    </p>

                    {/* Footer / Read Link */}
                    <div className="pt-3 border-t border-border/40 flex items-center justify-between text-xs font-semibold text-primary">
                      <span className="flex items-center gap-1.5 group-hover:underline">
                        Read full article
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>

                      {post.source === "medium" && post.canonical_url && (
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1 hover:text-foreground">
                          Medium <ExternalLink className="h-2.5 w-2.5" />
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* ── Empty State ── */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl border border-border/60 bg-card flex items-center justify-center mb-4">
              <WifiOff className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h2 className="text-xl font-bold text-foreground mb-2">No articles published yet</h2>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed mb-6">
              Articles will appear here once published via the admin dashboard or synced from Medium.
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              Explore Projects <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
