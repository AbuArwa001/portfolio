import { getResumeData } from "@/lib/resume-actions";
import { CVDocumentViewer } from "../print/CVDocumentViewer";

export const metadata = {
  title: "Detailed Engineering CV (Curriculum Vitae) | Khalfan Athman",
  description: "Comprehensive engineering dossier covering network systems, architecture, case studies, badges, and professional references.",
};

export default async function DetailedCVPage() {
  const d = await getResumeData();
  return <CVDocumentViewer initialFormat="detailed" data={d} />;
}
