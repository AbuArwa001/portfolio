import { notFound } from "next/navigation";
import Link from "next/link";
import { marked } from "marked";
import {
  Calendar,
  Clock,
  ChevronRight,
  ExternalLink,
  BookOpen,
  User,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { getApiUrl } from "@/lib/config";
import SinglePostClient from "./SinglePostClient";
import type { BlogPost } from "../page";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const FALLBACK_POSTS: Record<string, BlogPost> = {
  "architecting-decoupled-nextjs-and-django-apis": {
    id: 1,
    title: "Architecting Decoupled Next.js 15 & Django REST APIs for Scale",
    slug: "architecting-decoupled-nextjs-and-django-apis",
    subtitle: "Building high-performance web platforms requires a clean separation of concerns.",
    content: `
Building high-performance web platforms requires a clean separation of concerns. In this article, we explore the architectural decisions behind coupling Next.js 15 App Router with a stateless Django REST Framework (DRF) backend, covering JWT authentication, SSL termination, and PostgreSQL connection pooling.

### 1. Stateless Authentication Pipeline
Decoupling frontends from backends requires a stateless authentication approach. Using HttpOnly secure cookies alongside JSON Web Tokens (JWT) allows Next.js server components to authenticate against Django without storing credentials in browser localStorage.

### 2. Connection Pooling & Database Optimization
PostgreSQL connections are expensive in highly concurrent environments. Using PgBouncer in transaction pooling mode allows our Django workers to maintain thousands of active incoming requests without database exhaustion.

### 3. Edge Caching & Incremental Static Regeneration (ISR)
With Next.js, static routes are generated at build time and periodically revalidated in the background using ISR. This ensures sub-50ms TTFB across all static endpoints while keeping content fresh.
    `.trim(),
    created_at: "2026-03-01T00:00:00Z",
    published_at: "2026-03-01T00:00:00Z",
    read_time_minutes: 5,
    tags: ["Next.js", "Django", "Architecture"],
    source: "manual",
  },
  "network-engineering-principles-for-backend-devs": {
    id: 2,
    title: "Network Engineering Principles Every Backend Developer Should Know",
    slug: "network-engineering-principles-for-backend-devs",
    subtitle: "Software performance doesn't stop at the application layer.",
    content: `
Software performance doesn't stop at the application layer. Understanding OSI Layer 3 through Layer 7 routing, TCP three-way handshake optimization, DNS propagation, and VPC isolation fundamentally changes how you design resilient distributed systems.

### 1. The TCP Three-Way Handshake & TLS Overhead
Every HTTPS connection begins with SYN, SYN-ACK, and ACK, followed by TLS key negotiation. Understanding TCP window scaling and TLS 1.3 session resumption drastically reduces latency on remote endpoints.

### 2. DNS Caching & Time-To-Live (TTL)
Misconfigured TTLs can cause downtime during DNS failover. Setting aggressive TTLs during planned migrations ensures near-instant traffic routing.

### 3. Subnet Isolation & Defense-in-Depth
Never expose raw database sockets to public subnets. Using private VPC subnets with NAT Gateways for outbound access guarantees complete network-level isolation.
    `.trim(),
    created_at: "2026-02-15T00:00:00Z",
    published_at: "2026-02-15T00:00:00Z",
    read_time_minutes: 6,
    tags: ["Networking", "DevOps", "Performance"],
    source: "manual",
  },
};

async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const apiUrl = getApiUrl();
    const res = await fetch(`${apiUrl}/api/v1/blog/${encodeURIComponent(slug)}/`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.title) return data;
    }
  } catch {
    // Fall back to local map
  }

  return FALLBACK_POSTS[slug] || null;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: "Article Not Found — Khalfan Athman",
    };
  }

  return {
    title: `${post.title} — Khalfan Athman`,
    description:
      post.subtitle || post.content.replace(/<[^>]+>/g, " ").slice(0, 160).trim(),
    openGraph: {
      title: post.title,
      description:
        post.subtitle || post.content.replace(/<[^>]+>/g, " ").slice(0, 160).trim(),
      images: post.cover_image ? [{ url: post.cover_image }] : [],
    },
  };
}

function renderContentToHtml(content: string): string {
  if (!content) return "";
  const isHtml = /<\/?[a-z][\s\S]*>/i.test(content);
  if (isHtml) {
    return content;
  }
  return marked.parse(content, { gfm: true, breaks: true }) as string;
}

export default async function SingleBlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const readTime = post.read_time_minutes || post.read_time || 4;
  const dateStr = post.published_at || post.created_at;
  const displayDate = new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const portfolioUrl =
    process.env.NEXT_PUBLIC_PORTFOLIO_URL || "https://khalfanathman.dev";
  const fullPostUrl = `${portfolioUrl}/blog/${post.slug}`;
  const htmlContent = renderContentToHtml(post.content);

  return (
    <article className="relative min-h-screen bg-background selection:bg-primary/30 overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[900px] h-[400px] opacity-10 dark:opacity-15 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-violet-500/20 to-blue-500/15 blur-[120px] rounded-full" />
      </div>

      <div className="container px-4 sm:px-6 lg:px-8 mx-auto pt-24 sm:pt-32 pb-20 max-w-4xl">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono mb-6 sm:mb-8 overflow-x-auto scrollbar-none whitespace-nowrap">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 opacity-60 shrink-0" />
          <Link href="/blog" className="hover:text-foreground transition-colors">
            Blog
          </Link>
          <ChevronRight className="h-3 w-3 opacity-60 shrink-0" />
          <span className="text-foreground font-semibold truncate max-w-[240px] sm:max-w-none">
            {post.title}
          </span>
        </nav>

        {/* Article Header */}
        <header className="mb-8 sm:mb-10">
          {/* Tags & Source Badge */}
          <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-5">
            {post.source === "medium" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                Medium Publication
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-primary/10 text-primary border border-primary/25">
                Technical Article
              </span>
            )}

            {post.tags &&
              post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-mono text-muted-foreground px-2 py-0.5 rounded-md bg-muted/40 border border-border/40"
                >
                  #{tag}
                </span>
              ))}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15] mb-4 sm:mb-6 font-heading">
            {post.title}
          </h1>

          {/* Subtitle / Excerpt */}
          {post.subtitle && (
            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed mb-6">
              {post.subtitle}
            </p>
          )}

          {/* Author & Publishing Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-border/60 bg-card/40 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                KA
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-foreground font-heading">
                  Khalfan Athman
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  Network Engineer &amp; Full-Stack Dev
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                {displayDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                {readTime} min read
              </span>
            </div>
          </div>
        </header>

        {/* Hero Cover Image */}
        {post.cover_image && (
          <div className="relative w-full rounded-3xl overflow-hidden border border-border/60 shadow-2xl bg-muted/30 mb-10 aspect-[16/9] sm:aspect-[21/9]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Medium Canonical Card (if applicable) */}
        {post.source === "medium" && post.canonical_url && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.04] dark:bg-emerald-500/[0.03] mb-10">
            <div className="flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-emerald-500 shrink-0" />
              <p className="text-xs sm:text-sm text-foreground">
                Originally published on{" "}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Medium
                </span>{" "}
                by Khalfan Athman.
              </p>
            </div>
            <a
              href={post.canonical_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all shrink-0 w-fit"
            >
              <span>Read original on Medium</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        )}

        {/* Article Body Content */}
        <div
          className="prose prose-slate dark:prose-invert max-w-none text-foreground leading-relaxed text-base sm:text-lg mb-12
            prose-headings:font-heading prose-headings:font-extrabold prose-headings:tracking-tight
            prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:mb-6 prose-p:leading-relaxed
            prose-a:text-primary prose-a:font-semibold prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-4 prose-blockquote:border-primary/60 prose-blockquote:bg-card/40 prose-blockquote:p-4 prose-blockquote:rounded-r-2xl prose-blockquote:italic
            prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:bg-muted prose-code:font-mono prose-code:text-xs sm:prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
            prose-pre:rounded-2xl prose-pre:border prose-pre:border-border/60 prose-pre:bg-slate-950 prose-pre:p-4 sm:prose-pre:p-6
            prose-img:rounded-2xl prose-img:border prose-img:border-border/60 prose-img:shadow-lg prose-img:mx-auto
            prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-6
            prose-li:mb-2"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Share Bar & Bottom Navigation */}
        <SinglePostClient title={post.title} slug={post.slug} url={fullPostUrl} />

        {/* Author Bio Box */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl border border-border/60 bg-card/60 backdrop-blur-sm flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary via-indigo-500 to-violet-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shrink-0">
            KA
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground font-heading">
              Written by Khalfan Athman
            </h3>
            <p className="text-xs text-primary font-mono font-medium mt-0.5 mb-2">
              Network Engineer &amp; Full-Stack Developer
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
              Specialized in Linux systems, high-concurrency Django REST APIs,
              and enterprise network infrastructure (Cisco, AWS, OCI). Documenting real-world
              engineering designs and operational postmortems.
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-semibold">
              <Link
                href="/projects"
                className="text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>View Engineering Projects</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
              <span className="text-muted-foreground/40">•</span>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                <span>Get in Touch</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
