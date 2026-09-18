// app/references/page.tsx — Server Component (no "use client")
import ReferencesClient, { Reference } from "./ReferencesClient";
import resumeData from "@/app/resume/resume.json";
import { getApiUrl } from "@/lib/config";

export const dynamic = "force-dynamic";

async function getReferences(): Promise<Reference[]> {
  try {
    const apiUrl = getApiUrl();
    const res = await fetch(`${apiUrl}/api/v1/references/`, {
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Fall back silently to static resume data if API is unreachable
  }
  return ((resumeData as unknown as { references?: Reference[] }).references ?? []);
}

export default async function ReferencesPage() {
  const references = await getReferences();
  return <ReferencesClient references={references} />;
}

