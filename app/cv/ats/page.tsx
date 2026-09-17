import { getResumeData } from "@/lib/resume-actions";
import { CVDocumentViewer } from "../print/CVDocumentViewer";

export const metadata = {
  title: "ATS Resume (1-Page / 2-Page) | Khalfan Athman",
  description: "ATS-friendly resume formatted for applicant tracking systems, job boards, and automated parsers.",
};

export default async function ATSResumePage() {
  const d = await getResumeData();
  return <CVDocumentViewer initialFormat="ats" data={d} />;
}
