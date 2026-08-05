// app/references/page.tsx  — Server Component (no "use client")
import { getResumeData } from "@/lib/resume-actions";
import ReferencesClient from "./ReferencesClient";

export const dynamic = "force-dynamic"; // always read latest data

export default async function ReferencesPage() {
  const data = await getResumeData();
  return <ReferencesClient references={data.references} />;
}
