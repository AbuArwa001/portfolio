import Link from "next/link";
import { Calendar, Clock, ArrowRight, Rss, WifiOff } from "lucide-react";

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  content: string;
  created_at: string;
  read_time?: number;
};

async function getPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/blog/", {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export const metadata = {
  title: "Blog — Khalfan Athman",
  description:
    "Technical articles on network engineering, Django, Next.js, Linux systems, and full-stack development by Khalfan Athman.",
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="relative min-h-screen bg-background selection:bg-primary/30">
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] opacity-10 dark:opacity-15 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-blue-500/20 to-transparent blur-[120px] rounded-full" />
      </div>

      <div className="container px-4 mx-auto pt-32 pb-24 max-w-4xl">
        {/* Header */}
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-sm font-medium text-primary bg-primary/10 rounded-full border border-primary/20">
            <Rss className="w-4 h-4" />
            <span>Technical Writing</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-5">
            The{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
              Blog
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Practical deep-dives on network engineering, Django REST Framework,
            Next.js architecture, Linux internals, and lessons from production systems.
          </p>
        </div>

        {/* Posts */}
        {posts.length > 0 ? (
          <div className="flex flex-col gap-6">
            {posts.map((post, i) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group relative flex flex-col gap-3 p-7 rounded-2xl border border-border/60 bg-card hover:border-primary/40 hover:shadow-[0_0_40px_-10px] hover:shadow-primary/15 transition-all duration-400"
              >
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(post.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  {post.read_time && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {post.read_time} min read
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                  {post.content.slice(0, 220)}…
                </p>
                <div className="flex items-center gap-1.5 text-sm font-medium text-primary mt-1">
                  Read article
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
                <span className="absolute top-7 right-7 text-xs font-mono text-muted-foreground/40">
                  #{String(i + 1).padStart(2, "0")}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          /* ── Empty / Offline State ── */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl border border-border/60 bg-card flex items-center justify-center mb-6">
              <WifiOff className="h-9 w-9 text-muted-foreground/50" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-3">
              No posts yet
            </h2>
            <p className="text-muted-foreground max-w-sm leading-relaxed mb-8">
              Articles are published via the backend API. Either the server is
              offline right now or no posts have been written yet.
            </p>
            <div className="flex gap-3">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                View Projects <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border/60 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
