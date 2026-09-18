import { Suspense } from "react";
import SubmitReferenceClient from "./SubmitReferenceClient";

export const metadata = {
  title: "Provide a Reference — Khalfan Athman",
  description:
    "Submit your professional testimonial and referee details for Khalfan Athman's engineering portfolio.",
};

export default function SubmitReferencePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SubmitReferenceClient />
    </Suspense>
  );
}
