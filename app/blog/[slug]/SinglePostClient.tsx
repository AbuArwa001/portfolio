"use client";

import { useState } from "react";
import { Check, Copy, Share2, Twitter, Linkedin, MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  title: string;
  slug: string;
  url: string;
}

export default function SinglePostClient({ title, slug, url }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = encodeURIComponent(`${title} by Khalfan Athman`);
  const encodedUrl = encodeURIComponent(url);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6 border-y border-border/40">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to all articles</span>
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium mr-1 flex items-center gap-1.5">
          <Share2 className="h-3.5 w-3.5" />
          <span>Share:</span>
        </span>

        {/* Copy Link Button */}
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border/60 bg-card/60 hover:bg-card hover:border-primary/40 text-xs font-medium text-foreground transition-all cursor-pointer"
          title="Copy link to clipboard"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        {/* X / Twitter */}
        <a
          href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl border border-border/60 bg-card/60 hover:bg-card hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all"
          title="Share on X / Twitter"
          aria-label="Share on X"
        >
          <Twitter className="h-3.5 w-3.5" />
        </a>

        {/* LinkedIn */}
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl border border-border/60 bg-card/60 hover:bg-card hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all"
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="h-3.5 w-3.5" />
        </a>

        {/* WhatsApp */}
        <a
          href={`https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl border border-border/60 bg-card/60 hover:bg-card hover:border-primary/40 text-muted-foreground hover:text-emerald-500 transition-all"
          title="Share on WhatsApp"
          aria-label="Share on WhatsApp"
        >
          <MessageSquare className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
