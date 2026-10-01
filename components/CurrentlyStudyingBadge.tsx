"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Clock,
  Network,
  Cloud,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { api } from "../lib/api";
import type { PublicStudyBadgeData } from "../types";

interface CurrentlyStudyingBadgeProps {
  variant?: "pill" | "card";
  className?: string;
}

export default function CurrentlyStudyingBadge({
  variant = "pill",
  className = "",
}: CurrentlyStudyingBadgeProps) {
  const [data, setData] = useState<PublicStudyBadgeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    api.studyBadge
      .get()
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        // Fallback gracefully without breaking public UI
        console.warn("Could not load study badge:", err);
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/60 border border-border/40 text-xs text-muted-foreground animate-pulse ${className}`}
      >
        <div className="w-2 h-2 rounded-full bg-primary/40 animate-ping" />
        <span className="font-mono text-[11px]">Loading study status...</span>
      </div>
    );
  }

  // Fallback defaults if API has no certifications yet
  const certs = data?.certifications && data.certifications.length > 0
    ? data.certifications
    : [
        {
          code: "CCNA-200-301",
          name: "Cisco Certified Network Associate",
          vendor: "Cisco",
          exam_code: "200-301",
          progress_pct: 0,
          status: "In Progress",
        },
        {
          code: "AWS-SAA-C03",
          name: "AWS Solutions Architect - Associate",
          vendor: "AWS",
          exam_code: "SAA-C03",
          progress_pct: 0,
          status: "In Progress",
        },
      ];

  const streak = data?.streak_days || 0;
  const hours = data?.total_study_hours || 0;

  // Active highlighted cert (first one or highest progress)
  const activeCert = certs[0];

  if (variant === "pill") {
    return (
      <div className={`relative inline-block ${className}`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-card/80 hover:bg-card border border-border/80 hover:border-primary/40 backdrop-blur-md shadow-sm transition-all duration-300 text-left cursor-pointer"
          title="Click to view certification study progress"
        >
          <div className="relative flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="absolute w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
          </div>

          <span className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-primary" />
            <span>Currently Studying:</span>
            <span className="text-primary font-mono font-bold">
              {activeCert?.vendor} {activeCert?.exam_code}
            </span>
            <span className="text-xs font-mono text-muted-foreground">
              ({activeCert?.progress_pct}%)
            </span>
          </span>

          {streak > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/20">
              <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
              {streak}d
            </span>
          )}

          {isExpanded ? (
            <ChevronUp className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-transform" />
          ) : (
            <ChevronDown className="w-3 h-3 text-muted-foreground group-hover:text-foreground transition-transform" />
          )}
        </button>

        {/* Dropdown Popover */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 mt-2 z-50 w-72 sm:w-80 rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-2xl p-4 space-y-3.5"
            >
              <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground font-heading">
                      Active Certification Goals
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      Public verified study telemetry
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-[11px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 font-bold">
                    <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{streak}d streak</span>
                  </div>
                </div>
              </div>

              {/* Progress bars for each cert */}
              <div className="space-y-3">
                {certs.map((c) => {
                  const isCisco = c.vendor.toLowerCase().includes("cisco");
                  return (
                    <div
                      key={c.code}
                      className="p-2.5 rounded-xl bg-background/60 border border-border/50 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          {isCisco ? (
                            <Network className="w-3.5 h-3.5 text-blue-500" />
                          ) : (
                            <Cloud className="w-3.5 h-3.5 text-amber-500" />
                          )}
                          <span className="font-bold text-foreground text-[11px]">
                            {c.name}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] font-bold text-primary">
                          {c.progress_pct}%
                        </span>
                      </div>

                      <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            isCisco ? "bg-blue-500" : "bg-amber-500"
                          }`}
                          style={{ width: `${Math.max(4, c.progress_pct)}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-mono text-muted-foreground">
                        <span>Exam: {c.exam_code}</span>
                        <span className="text-emerald-500 font-semibold">{c.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-1 border-t border-border/40 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>{hours} hrs logged</span>
                </span>
                <span className="flex items-center gap-1 text-primary">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin Verified</span>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Card Variant
  return (
    <div
      className={`rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl p-5 shadow-lg space-y-3.5 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="absolute w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping opacity-75" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wider font-mono">
              Currently Studying
            </h4>
            <p className="text-[10px] text-muted-foreground font-mono">
              Live certification telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {streak > 0 && (
            <div className="flex items-center gap-1 text-[11px] font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 font-bold">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{streak}d</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
            <Clock className="w-3.5 h-3.5 text-emerald-500" />
            <span>{hours}h</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {certs.map((c) => {
          const isCisco = c.vendor.toLowerCase().includes("cisco");
          return (
            <div
              key={c.code}
              className="p-3 rounded-xl bg-background/60 border border-border/50 hover:border-primary/30 transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  {isCisco ? (
                    <Network className="w-3.5 h-3.5 text-blue-500" />
                  ) : (
                    <Cloud className="w-3.5 h-3.5 text-amber-500" />
                  )}
                  <span className="font-bold text-foreground text-[11px]">
                    {c.exam_code}
                  </span>
                </div>
                <span className="font-mono text-[11px] font-bold text-primary">
                  {c.progress_pct}%
                </span>
              </div>

              <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    isCisco ? "bg-blue-500" : "bg-amber-500"
                  }`}
                  style={{ width: `${Math.max(4, c.progress_pct)}%` }}
                />
              </div>

              <p className="text-[10px] text-muted-foreground truncate">{c.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
