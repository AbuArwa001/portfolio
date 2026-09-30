"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import {
  Check, Copy, Share2, Twitter, Linkedin,
  MessageSquare, ArrowLeft, BookOpen,
} from "lucide-react";
import Link from "next/link";

interface Props {
  title: string;
  slug: string;
  url: string;
  readTime: number;
}

/* ── reading progress bar ───────────────────────────────── */
function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 28, restDelta: 0.001 });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "left" }}
      className="fixed top-0 left-0 right-0 h-[3px] z-[70] bg-gradient-to-r from-primary via-emerald-400 to-teal-400 print:hidden"
    />
  );
}

/* ── share button row ───────────────────────────────────── */
export default function SinglePostClient({ title, slug, url, readTime }: Props) {
  const [copied, setCopied] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const pct = Math.min(100, Math.round((el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100));
      setScrollPct(pct);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = encodeURIComponent(`${title} by Khalfan Athman`);
  const encodedUrl = encodeURIComponent(url);

  return (
    <>
      <ReadingProgress />

      {/* ── divider row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-y border-border/40 mt-2">

        {/* back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group w-fit"
        >
          <span className="w-7 h-7 rounded-lg border border-border/60 bg-card/80 flex items-center justify-center group-hover:border-primary/40 transition-colors shrink-0">
            <ArrowLeft className="h-3.5 w-3.5" />
          </span>
          Back to all articles
        </Link>

        {/* right cluster */}
        <div className="flex flex-wrap items-center gap-2">

          {/* progress badge */}
          <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/50 border border-border/50 text-[11px] font-mono text-muted-foreground">
            <BookOpen className="h-3 w-3 text-primary" />
            {scrollPct}% read · {readTime} min
          </span>

          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
            <Share2 className="h-3.5 w-3.5" />
            Share:
          </span>

          {/* copy link */}
          <motion.button
            onClick={handleCopy}
            whileTap={{ scale: 0.94 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/60 bg-card/60 hover:bg-card hover:border-primary/40 text-xs font-medium text-foreground transition-all cursor-pointer min-w-[88px] justify-center"
            title="Copy link to clipboard"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="copied"
                  className="flex items-center gap-1.5"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  Copied!
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  className="flex items-center gap-1.5"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy Link
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          {/* X / Twitter */}
          <a
            href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`}
            target="_blank" rel="noopener noreferrer"
            className="p-2 rounded-xl border border-border/60 bg-card/60 hover:bg-card hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all"
            title="Share on X / Twitter" aria-label="Share on X"
          >
            <Twitter className="h-3.5 w-3.5" />
          </a>

          {/* LinkedIn */}
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
            target="_blank" rel="noopener noreferrer"
            className="p-2 rounded-xl border border-border/60 bg-card/60 hover:bg-[#0a66c2]/15 hover:border-[#0a66c2]/40 text-muted-foreground hover:text-[#0a66c2] transition-all"
            title="Share on LinkedIn" aria-label="Share on LinkedIn"
          >
            <Linkedin className="h-3.5 w-3.5" />
          </a>

          {/* WhatsApp */}
          <a
            href={`https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`}
            target="_blank" rel="noopener noreferrer"
            className="p-2 rounded-xl border border-border/60 bg-card/60 hover:bg-emerald-500/10 hover:border-emerald-500/40 text-muted-foreground hover:text-emerald-500 transition-all"
            title="Share on WhatsApp" aria-label="Share on WhatsApp"
          >
            <MessageSquare className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </>
  );
}
