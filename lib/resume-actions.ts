"use server";

import { promises as fs } from "fs";
import path from "path";
import { revalidatePath } from "next/cache";

import { getApiUrl } from "./config";

const DATA_PATH = path.join(process.cwd(), "app/resume/resume.json");

export type Reference = {
  id?: number;
  name: string;
  title: string;
  company: string;
  relationship: string;
  quote: string;
  email: string;
  phone: string;
  linkedin: string;
};

export type BadgeData = {
  name: string;
  issuer: string;
  year: string;
  image?: string;
  credential_url?: string;
  description?: string;
};

export type ProjectData = {
  name: string;
  role: string;
  period: string;
  url: string;
  tech: string;
  description: string;
};

export type ResumeData = {
  profile: { name: string; role: string; avatar: string; bio?: string; location?: string; phone?: string };
  contact: { email: string; linkedin: string; github: string; website?: string };
  experience: Array<{ title: string; company: string; period: string; location: string; achievements: string[] }>;
  education: Array<{ school: string; degree: string; period: string }>;
  skills: string[];
  skills_categorized?: Record<string, string[]>;
  projects?: ProjectData[];
  certifications: Array<{ name: string; issuer: string; year: string; type?: string }>;
  badges?: BadgeData[];
  references: Reference[];
};

export async function getResumeData(): Promise<ResumeData> {
  // First attempt to fetch live from PostgreSQL DRF backend
  try {
    const apiUrl = getApiUrl();
    const res = await fetch(`${apiUrl}/api/v1/resume/primary/`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && (data.profile || data.experience)) {
        if (!Array.isArray(data.references)) data.references = [];
        return data as ResumeData;
      }
    }
  } catch (err) {
    // Silently proceed to local fallback
  }

  // Fallback to local file
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.references)) parsed.references = [];
    return parsed as ResumeData;
  } catch {
    return {} as ResumeData;
  }
}

export async function saveResumeData(data: ResumeData): Promise<{ ok: boolean; error?: string }> {
  try {
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
    revalidatePath("/resume");
    revalidatePath("/cv/print");
    revalidatePath("/references");
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

