import { getResumeData } from "@/lib/resume-actions";
import { CVDocumentViewer } from "./CVDocumentViewer";

interface PrintCVPageProps {
  searchParams?: Promise<{
    format?: string;
    type?: string;
  }>;
}

export const metadata = {
  title: "Resume & Curriculum Vitae | Khalfan Athman",
  description: "ATS-friendly resume and comprehensive engineering CV dossier for Khalfan Athman.",
};

export default async function PrintCVPage({ searchParams }: PrintCVPageProps) {
  const d = await getResumeData();
  const resolvedParams = searchParams ? await searchParams : undefined;
  const paramVal = (resolvedParams?.format || resolvedParams?.type || "").toLowerCase();
  const initialFormat = paramVal === "ats" ? "ats" : "detailed";

  return <CVDocumentViewer initialFormat={initialFormat} data={d} />;
}
