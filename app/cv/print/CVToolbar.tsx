"use client";

import { useState } from "react";
import { Printer, FileText, Check, ArrowLeft, Layers, Copy, Download } from "lucide-react";

interface CVToolbarProps {
  format: "ats" | "detailed";
  onFormatChange: (format: "ats" | "detailed") => void;
  plainText: string;
}

export function CVToolbar({ format, onFormatChange, plainText }: CVToolbarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(plainText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if clipboard API is restricted
      const textarea = document.createElement("textarea");
      textarea.value = plainText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="no-print print:hidden fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 pointer-events-none">
      <div className="pointer-events-auto bg-white/95 backdrop-blur-md dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-3 transition-all">
        {/* Left: Back + Format Selector */}
        <div className="flex items-center gap-2">
          <a
            href="/resume"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </a>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => onFormatChange("detailed")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                format === "detailed"
                  ? "bg-white dark:bg-slate-950 text-emerald-700 dark:text-emerald-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Webpage Layout (CV)
              <span className="text-[10px] font-normal px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-mono">
                Dossier
              </span>
            </button>

            <button
              onClick={() => onFormatChange("ats")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                format === "ats"
                  ? "bg-white dark:bg-slate-950 text-blue-700 dark:text-blue-400 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              ATS Single-Column
              <span className="text-[10px] font-normal px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-mono">
                1-2 Pg
              </span>
            </button>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Copy plain text formatted for applicant tracking systems"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-bold">Copied ATS Text!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy ATS Text</span>
              </>
            )}
          </button>

          {/* Direct File Download */}
          <a
            href="/Khalfan_Athman_Resume.pdf"
            download="Khalfan_Athman_Resume.pdf"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            title="Directly download PDF file"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PDF</span>
          </a>

          {/* Native Print / Save to PDF */}
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            title="Open browser print dialog to print or save as PDF"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
