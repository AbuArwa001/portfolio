"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Save, Quote, Loader2, CheckCircle2, AlertCircle, ExternalLink,
} from "lucide-react";

const API = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/references/`;

interface Reference {
  id?: number;
  name: string;
  title: string;
  company: string;
  relationship: string;
  quote: string;
  email: string;
  phone: string;
  linkedin: string;
}

const empty = (): Reference => ({
  name: "", title: "", company: "", relationship: "",
  quote: "", email: "", phone: "", linkedin: "",
});

function Field({
  label, value, onChange, type = "text", placeholder = "",
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="px-4 py-2.5 rounded-xl border border-border/60 bg-background text-foreground text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
      />
    </div>
  );
}

function Toast({ type, msg }: { type: "success" | "error"; msg: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium mb-4 ${
        type === "success"
          ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-400"
          : "bg-red-400/10 border-red-400/30 text-red-400"
      }`}
    >
      {type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
      {msg}
    </motion.div>
  );
}

export default function ReferencesTab() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken as string | undefined;

  const [refs, setRefs] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | "new" | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // Load existing references
  useEffect(() => {
    fetch(API)
      .then((r) => r.json())
      .then((data) => setRefs(Array.isArray(data) ? data : []))
      .catch(() => showToast("error", "Failed to load references."))
      .finally(() => setLoading(false));
  }, []);

  // Save (create or update) a single reference
  const handleSave = async (ref: Reference, idx: number) => {
    if (!token) return showToast("error", "Not authenticated.");
    setSaving(ref.id ?? "new");
    try {
      const method = ref.id ? "PATCH" : "POST";
      const url = ref.id ? `${API}${ref.id}/` : API;
      const res = await fetch(url, {
        method,
        headers: authHeaders,
        body: JSON.stringify(ref),
      });
      if (!res.ok) throw new Error(await res.text());
      const saved: Reference = await res.json();
      setRefs((prev) => {
        const next = [...prev];
        next[idx] = saved;
        return next;
      });
      showToast("success", ref.id ? "Reference updated." : "Reference added.");
    } catch {
      showToast("error", "Failed to save reference.");
    } finally {
      setSaving(null);
    }
  };

  // Delete a reference
  const handleDelete = async (ref: Reference, idx: number) => {
    if (!ref.id) {
      // Not yet saved — just remove from local state
      setRefs((prev) => prev.filter((_, i) => i !== idx));
      return;
    }
    if (!token) return showToast("error", "Not authenticated.");
    setDeleting(ref.id);
    try {
      const res = await fetch(`${API}${ref.id}/`, {
        method: "DELETE",
        headers: authHeaders,
      });
      if (!res.ok) throw new Error();
      setRefs((prev) => prev.filter((_, i) => i !== idx));
      showToast("success", "Reference deleted.");
    } catch {
      showToast("error", "Failed to delete reference.");
    } finally {
      setDeleting(null);
    }
  };

  const updateField = (idx: number, field: keyof Reference, value: string) => {
    setRefs((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Add referees here — they appear on the public{" "}
          <a href="/references" target="_blank" className="text-primary underline inline-flex items-center gap-0.5">
            References page <ExternalLink className="h-3 w-3" />
          </a>.
          Each card saves independently.
        </p>
      </div>

      <AnimatePresence>
        {toast && <Toast type={toast.type} msg={toast.msg} />}
      </AnimatePresence>

      {refs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground gap-3">
          <Quote className="h-8 w-8 text-primary/20" />
          <p className="text-sm">No references yet. Add your first one below.</p>
        </div>
      )}

      {refs.map((ref, idx) => (
        <motion.div
          key={ref.id ?? `new-${idx}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="rounded-2xl border border-border/60 bg-background p-5 flex flex-col gap-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-primary/70 uppercase tracking-widest">
              Referee #{idx + 1}{ref.name ? ` — ${ref.name}` : ""}
              {!ref.id && (
                <span className="ml-2 text-amber-400 normal-case font-normal">(unsaved)</span>
              )}
            </span>
            <button
              onClick={() => handleDelete(ref, idx)}
              disabled={deleting === ref.id}
              className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-40"
            >
              {deleting === ref.id
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <Trash2 className="h-4 w-4" />}
            </button>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Full Name" value={ref.name} placeholder="e.g. John Doe"
              onChange={(v) => updateField(idx, "name", v)} />
            <Field label="Job Title" value={ref.title} placeholder="e.g. Senior Manager"
              onChange={(v) => updateField(idx, "title", v)} />
            <Field label="Company / Organisation" value={ref.company} placeholder="e.g. Jamia Mosque Committee"
              onChange={(v) => updateField(idx, "company", v)} />
            <Field label="Your Relationship" value={ref.relationship} placeholder="e.g. Direct Supervisor"
              onChange={(v) => updateField(idx, "relationship", v)} />
            <Field label="Email" value={ref.email} type="email" placeholder="email@example.com"
              onChange={(v) => updateField(idx, "email", v)} />
            <Field label="Phone (optional)" value={ref.phone} placeholder="+254 ..."
              onChange={(v) => updateField(idx, "phone", v)} />
            <div className="md:col-span-2">
              <Field label="LinkedIn URL (optional)" value={ref.linkedin} type="url"
                placeholder="https://linkedin.com/in/..." onChange={(v) => updateField(idx, "linkedin", v)} />
            </div>
            <div className="md:col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Recommendation / Quote
              </label>
              <textarea
                rows={3}
                value={ref.quote}
                onChange={(e) => updateField(idx, "quote", e.target.value)}
                placeholder="A brief testimonial or endorsement from this referee..."
                className="px-4 py-2.5 rounded-xl border border-border/60 bg-background text-foreground text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-y"
              />
            </div>
          </div>

          {/* Save button */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => handleSave(ref, idx)}
              disabled={saving === (ref.id ?? "new")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving === (ref.id ?? "new")
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                : <><Save className="h-4 w-4" /> {ref.id ? "Update" : "Save"}</>}
            </button>
          </div>
        </motion.div>
      ))}

      <button
        onClick={() => setRefs((prev) => [...prev, empty()])}
        className="flex items-center gap-2 px-5 py-3 rounded-xl border border-dashed border-primary/40 text-primary hover:bg-primary/5 transition-colors text-sm font-medium"
      >
        <Plus className="h-4 w-4" /> Add Referee
      </button>
    </div>
  );
}
