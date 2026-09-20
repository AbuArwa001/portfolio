"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Loader2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HeartHandshake,
  Sparkles,
  Lock,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export type ProgressStage =
  | "validating"
  | "transmitting"
  | "finalizing"
  | "success"
  | "error";

interface SubmissionProgressModalProps {
  isOpen: boolean;
  stage: ProgressStage;
  progress: number;
  errorMessage?: string | null;
  refereeName?: string;
  onDismissError?: () => void;
  onRetry?: () => void;
}

interface StepItem {
  id: ProgressStage;
  title: string;
  description: string;
}

const STEPS: StepItem[] = [
  {
    id: "validating",
    title: "1. Validating Testimonial",
    description: "Sanitizing quote, links & verifying referee credentials",
  },
  {
    id: "transmitting",
    title: "2. Syncing with Database",
    description: "Encrypting and transmitting payload to Neon PostgreSQL",
  },
  {
    id: "finalizing",
    title: "3. Registering Endorsement",
    description: "Generating audit record & queueing for public display",
  },
];

export default function SubmissionProgressModal({
  isOpen,
  stage,
  progress,
  errorMessage,
  refereeName,
  onDismissError,
  onRetry,
}: SubmissionProgressModalProps) {
  if (!isOpen) return null;

  const getStepStatus = (stepId: ProgressStage) => {
    if (stage === "error") return "error";
    if (stage === "success") return "completed";

    const stageOrder: ProgressStage[] = ["validating", "transmitting", "finalizing", "success"];
    const currentIdx = stageOrder.indexOf(stage);
    const stepIdx = stageOrder.indexOf(stepId);

    if (currentIdx > stepIdx) return "completed";
    if (currentIdx === stepIdx) return "active";
    return "pending";
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 16 }}
          transition={{ type: "spring", damping: 26, stiffness: 340 }}
          className="relative w-full max-w-lg rounded-3xl border border-primary/25 bg-card/95 text-card-foreground shadow-2xl shadow-primary/10 p-6 sm:p-8 backdrop-blur-2xl overflow-hidden z-10"
        >
          {/* Ambient gradient glow */}
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-primary/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-violet-600/20 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* ── Top Icon & Status Badge ── */}
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Multi-ring Cybernetic Animated Icon */}
            <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24">
              {stage === "error" ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-500/15 border-2 border-red-500/40 flex items-center justify-center text-red-500 shadow-lg shadow-red-500/20">
                  <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce" />
                </div>
              ) : stage === "success" ? (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20 animate-in zoom-in-75 duration-300">
                  <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin [animation-duration:1.2s]" />
                  <div className="absolute inset-2.5 rounded-full border-2 border-violet-500/25 border-b-violet-400 animate-spin [animation-duration:1.8s] [animation-direction:reverse]" />
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/30">
                    {stage === "validating" && (
                      <ShieldCheck className="w-6 h-6 text-white animate-pulse" />
                    )}
                    {stage === "transmitting" && (
                      <Database className="w-6 h-6 text-white animate-pulse" />
                    )}
                    {stage === "finalizing" && (
                      <HeartHandshake className="w-6 h-6 text-white animate-pulse" />
                    )}
                  </>
              )}
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase border shadow-sm">
              {stage === "error" ? (
                <span className="text-red-400 bg-red-500/10 border-red-500/20 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Submission Interrupted
                </span>
              ) : stage === "success" ? (
                <span className="text-emerald-400 bg-emerald-500/10 border-emerald-500/20 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Endorsement Confirmed
                </span>
              ) : (
                <span className="text-primary bg-primary/10 border-primary/25 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                  Processing Endorsement
                </span>
              )}
            </div>

            {/* Main Header */}
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-heading">
                {stage === "error"
                  ? "Submission Failed"
                  : stage === "success"
                  ? `Thank You, ${refereeName || "Referee"}!`
                  : "Recording Your Endorsement"}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                {stage === "error"
                  ? "We encountered an issue while saving your recommendation. Please review the error details below."
                  : stage === "success"
                  ? "Your testimonial has been securely stored and sent to Khalfan Athman for administrative publication."
                  : "Please wait a moment while your professional recommendation is processed and secured."}
              </p>
            </div>
          </div>

          {/* ── Progress Bar & Percentage ── */}
          {stage !== "error" && (
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Loader2 className={`w-3.5 h-3.5 ${stage === "success" ? "hidden" : "animate-spin text-primary"}`} />
                  {stage === "validating" && "Step 1 of 3: Verifying details..."}
                  {stage === "transmitting" && "Step 2 of 3: Persisting to database..."}
                  {stage === "finalizing" && "Step 3 of 3: Finalizing record..."}
                  {stage === "success" && "Completed 100%"}
                </span>
                <span className="font-bold text-primary">{Math.round(progress)}%</span>
              </div>

              {/* Progress track */}
              <div className="w-full bg-muted/70 dark:bg-white/[0.08] rounded-full h-2.5 overflow-hidden relative shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary via-violet-500 to-emerald-400 rounded-full relative"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeInOut", duration: 0.35 }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </motion.div>
              </div>
            </div>
          )}

          {/* ── Progress Stepper Timeline ── */}
          {stage !== "error" ? (
            <div className="mt-6 rounded-2xl border border-border/60 bg-muted/30 dark:bg-white/[0.02] p-4 space-y-3.5">
              {STEPS.map((step) => {
                const status = getStepStatus(step.id);
                return (
                  <div
                    key={step.id}
                    className={`flex items-start gap-3 transition-opacity ${
                      status === "pending" ? "opacity-40" : "opacity-100"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {status === "completed" ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      ) : status === "active" ? (
                        <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center border border-primary/40 animate-pulse">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-border/80 bg-background/50 flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-semibold leading-tight ${
                        status === "active"
                          ? "text-primary"
                          : status === "completed"
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}>
                        {step.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground/80 mt-0.5 leading-snug">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── Error Box ── */}
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-400 space-y-2">
                <div className="flex items-center gap-2 font-bold text-red-300">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Submission Error Details</span>
                </div>
                <p className="leading-relaxed font-mono text-[11px] bg-red-950/30 p-2.5 rounded-xl border border-red-500/20 break-words">
                  {errorMessage || "An unexpected error occurred while transmitting data."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5">
                {onRetry && (
                  <button
                    type="button"
                    onClick={onRetry}
                    className="flex-1 py-3 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-md shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={onDismissError}
                  className="flex-1 py-3 px-4 rounded-xl border border-border/80 bg-card hover:bg-muted text-foreground text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Edit &amp; Correct Form</span>
                </button>
              </div>
            </div>
          )}

          {/* ── Footer Security Badge ── */}
          <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground font-mono">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              TLS Encrypted • Neon PostgreSQL
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-primary shrink-0" />
              Verified Transaction
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
