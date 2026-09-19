"use client";

import React from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function PremiumSkeleton({ className = "", ...props }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-slate-200/80 dark:bg-white/[0.05] before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 dark:before:via-white/[0.08] before:to-transparent ${className}`}
      {...props}
    />
  );
}

export function SkeletonReferenceCard() {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#0c1222]/80 p-6 md:p-8 space-y-4">
      <div className="flex items-center gap-4">
        <PremiumSkeleton className="w-14 h-14 rounded-2xl shrink-0" />
        <div className="space-y-2 flex-1">
          <PremiumSkeleton className="h-5 w-40 rounded-md" />
          <PremiumSkeleton className="h-3.5 w-60 rounded-md" />
        </div>
      </div>
      <PremiumSkeleton className="h-20 w-full rounded-xl" />
      <div className="flex items-center gap-3 pt-2">
        <PremiumSkeleton className="h-7 w-28 rounded-lg" />
        <PremiumSkeleton className="h-7 w-28 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonResumeDocument() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 border-b border-slate-200 dark:border-white/10">
        <div className="space-y-3 flex-1 text-center sm:text-left">
          <PremiumSkeleton className="h-8 w-64 rounded-xl mx-auto sm:mx-0" />
          <PremiumSkeleton className="h-4 w-80 rounded-md mx-auto sm:mx-0" />
          <PremiumSkeleton className="h-3.5 w-48 rounded-md mx-auto sm:mx-0" />
        </div>
        <PremiumSkeleton className="w-24 h-24 rounded-2xl shrink-0" />
      </div>

      {/* Sections */}
      <div className="space-y-6">
        <div className="space-y-3">
          <PremiumSkeleton className="h-5 w-44 rounded-md" />
          <PremiumSkeleton className="h-24 w-full rounded-2xl" />
        </div>

        <div className="space-y-3">
          <PremiumSkeleton className="h-5 w-52 rounded-md" />
          <div className="space-y-4">
            <PremiumSkeleton className="h-36 w-full rounded-2xl" />
            <PremiumSkeleton className="h-36 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
