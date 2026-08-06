"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, Save, Loader2, CheckCircle2, AlertCircle,
  FolderKanban, ExternalLink, ImageIcon, X, Upload,
} from "lucide-react";

const API = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects/`;

interface Project {
  id?: number;
  name: string;
  description: string;
  link: string;
  status: string;
  completion: string;
  technologies: string;
  type: string;
  image?: string | null;      // write-only upload field (file path from backend)
  image_url?: string | null;  // read-only absolute URL from backend
}

const STATUS_OPTIONS = ["Active", "Completed", "In Progress", "Archived", "On Hold"];
const TYPE_OPTIONS = ["Web App", "Mobile App", "API / Backend", "CLI Tool", "Open Source", "Research", "Other"];

const empty = (): Project => ({
  name: "",
  description: "",
  link: "",
  status: "Active",
  completion: "100%",
  technologies: "",
  type: "Web App",
  image: null,
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

function SelectField({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-4 py-2.5 rounded-xl border border-border/60 bg-background text-foreground text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
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

export default function ProjectsTab() {
  const { data: session } = useSession();
  const token = (session as any)?.accessToken as string | undefined;

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | "new" | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [imageFiles, setImageFiles] = useState<Record<number, File | null>>({});
  const [clearedImages, setClearedImages] = useState<Set<number>>(new Set());
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  // Load existing projects
  useEffect(() => {
    if (!token) return;
    fetch(API, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => showToast("error", "Failed to load projects."))
      .finally(() => setLoading(false));
  }, [token]);

  // Save (create or update) a single project
  const handleSave = async (proj: Project, idx: number) => {
    if (!token) return showToast("error", "Not authenticated.");
    setSaving(proj.id ?? "new");
    try {
      const method = proj.id ? "PATCH" : "POST";
      const url = proj.id ? `${API}${proj.id}/` : API;

      const imageFile = imageFiles[idx];
      const shouldClear = clearedImages.has(idx);

      // Always use FormData so we can handle file uploads AND image clearing
      const fd = new FormData();
      fd.append("name", proj.name);
      fd.append("description", proj.description);
      fd.append("link", proj.link);
      fd.append("status", proj.status);
      fd.append("completion", proj.completion);
      fd.append("technologies", proj.technologies);
      fd.append("type", proj.type);

      if (imageFile) {
        // New image selected
        fd.append("image", imageFile);
      } else if (shouldClear) {
        // User explicitly removed the existing image
        fd.append("image", "");
      }
      // Otherwise omit the image field → backend leaves it unchanged

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });

      if (!res.ok) throw new Error(await res.text());
      const saved: Project = await res.json();
      setProjects((prev) => {
        const next = [...prev];
        next[idx] = saved;
        return next;
      });
      // Clear staged state after successful save
      setImageFiles((prev) => {
        const next = { ...prev };
        delete next[idx];
        return next;
      });
      setClearedImages((prev) => {
        const next = new Set(prev);
        next.delete(idx);
        return next;
      });
      showToast("success", proj.id ? "Project updated!" : "Project created!");
    } catch {
      showToast("error", "Failed to save project.");
    } finally {
      setSaving(null);
    }
  };

  // Delete a project
  const handleDelete = async (proj: Project, idx: number) => {
    if (!proj.id) {
      setProjects((prev) => prev.filter((_, i) => i !== idx));
      return;
    }
    if (!token) return showToast("error", "Not authenticated.");
    setDeleting(proj.id);
    try {
      const res = await fetch(`${API}${proj.id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setProjects((prev) => prev.filter((_, i) => i !== idx));
      showToast("success", "Project deleted.");
    } catch {
      showToast("error", "Failed to delete project.");
    } finally {
      setDeleting(null);
    }
  };

  const updateField = (idx: number, field: keyof Project, value: string) => {
    setProjects((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  const handleImageChange = (idx: number, file: File | null) => {
    setImageFiles((prev) => ({ ...prev, [idx]: file }));
    // If a new file is picked, undo any pending clear
    if (file) {
      setClearedImages((prev) => {
        const next = new Set(prev);
        next.delete(idx);
        return next;
      });
    }
  };

  const handleClearImage = (idx: number) => {
    handleImageChange(idx, null);
    // Mark image as cleared so the save payload sends image=""
    setClearedImages((prev) => new Set(prev).add(idx));
    // Clear the image_url preview
    setProjects((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], image_url: null };
      return next;
    });
    if (fileInputRefs.current[idx]) fileInputRefs.current[idx]!.value = "";
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
          Manage your portfolio projects here — they appear on the public{" "}
          <a href="/projects" target="_blank" className="text-primary underline inline-flex items-center gap-0.5">
            Projects page <ExternalLink className="h-3 w-3" />
          </a>.
          Each card saves independently.
        </p>
      </div>

      <AnimatePresence>
        {toast && <Toast type={toast.type} msg={toast.msg} />}
      </AnimatePresence>

      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground gap-3">
          <FolderKanban className="h-8 w-8 text-primary/20" />
          <p className="text-sm">No projects yet. Add your first one below.</p>
        </div>
      )}

      {projects.map((proj, idx) => {
        const stagedImage = imageFiles[idx];
        const previewUrl = stagedImage
          ? URL.createObjectURL(stagedImage)
          : proj.image_url || null;

        return (
          <motion.div
            key={proj.id ?? `new-${idx}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-border/60 bg-background p-5 flex flex-col gap-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary/70 uppercase tracking-widest">
                Project #{idx + 1}{proj.name ? ` — ${proj.name}` : ""}
                {!proj.id && (
                  <span className="ml-2 text-amber-400 normal-case font-normal">(unsaved)</span>
                )}
              </span>
              <button
                onClick={() => handleDelete(proj, idx)}
                disabled={deleting === proj.id}
                className="p-1.5 rounded-lg text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-40"
              >
                {deleting === proj.id
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <Trash2 className="h-4 w-4" />}
              </button>
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Project Image
              </label>
              <div className="flex items-start gap-4">
                {/* Preview */}
                <div className="relative w-24 h-16 rounded-xl border border-border/60 bg-muted/30 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {previewUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewUrl} alt="Project preview" className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleClearImage(idx)}
                        className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-black/60 text-white hover:bg-red-500/80 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
                  )}
                </div>
                {/* Upload button */}
                <div className="flex flex-col gap-1">
                  <input
                    ref={(el) => { fileInputRefs.current[idx] = el; }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id={`project-image-${idx}`}
                    onChange={(e) => handleImageChange(idx, e.target.files?.[0] ?? null)}
                  />
                  <label
                    htmlFor={`project-image-${idx}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-border/60 text-sm text-muted-foreground hover:border-primary/40 hover:text-primary cursor-pointer transition-colors"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    {stagedImage ? stagedImage.name : "Choose image…"}
                  </label>
                  <p className="text-xs text-muted-foreground/60 pl-1">PNG, JPG, WebP • max 5 MB</p>
                </div>
              </div>
            </div>

            {/* Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Project Name"
                value={proj.name}
                placeholder="e.g. Portfolio Website"
                onChange={(v) => updateField(idx, "name", v)}
              />
              <Field
                label="Live URL (optional)"
                value={proj.link}
                type="url"
                placeholder="https://..."
                onChange={(v) => updateField(idx, "link", v)}
              />
              <SelectField
                label="Status"
                value={proj.status}
                options={STATUS_OPTIONS}
                onChange={(v) => updateField(idx, "status", v)}
              />
              <SelectField
                label="Project Type"
                value={proj.type}
                options={TYPE_OPTIONS}
                onChange={(v) => updateField(idx, "type", v)}
              />
              <Field
                label="Completion"
                value={proj.completion}
                placeholder="e.g. 100% or Dec 2024"
                onChange={(v) => updateField(idx, "completion", v)}
              />
              <Field
                label="Technologies (comma-separated)"
                value={proj.technologies}
                placeholder="Python, Django, React, ..."
                onChange={(v) => updateField(idx, "technologies", v)}
              />
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={proj.description}
                  onChange={(e) => updateField(idx, "description", e.target.value)}
                  placeholder="A concise description of the project, its goals and impact..."
                  className="px-4 py-2.5 rounded-xl border border-border/60 bg-background text-foreground text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-y"
                />
              </div>
            </div>

            {/* Technologies preview */}
            {proj.technologies && (
              <div className="flex flex-wrap gap-1.5">
                {proj.technologies.split(",").map((t) => t.trim()).filter(Boolean).map((tech, ti) => (
                  <span
                    key={ti}
                    className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* Save button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleSave(proj, idx)}
                disabled={saving === (proj.id ?? "new")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-[0_0_20px_-8px] shadow-primary/50"
              >
                {saving === (proj.id ?? "new")
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                  : <><Save className="h-4 w-4" /> {proj.id ? "Update" : "Save"}</>}
              </button>
            </div>
          </motion.div>
        );
      })}

      <button
        onClick={() => setProjects((prev) => [...prev, empty()])}
        className="flex items-center gap-2 px-5 py-3 rounded-xl border border-dashed border-primary/40 text-primary hover:bg-primary/5 transition-colors text-sm font-medium"
      >
        <Plus className="h-4 w-4" /> Add Project
      </button>
    </div>
  );
}
