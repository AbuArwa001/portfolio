// app/references/page.tsx  — Server Component (no "use client")
// References are stored in the DRF backend API, not resume.json.
// The client component fetches from the API directly on mount.
import ReferencesClient from "./ReferencesClient";

export const dynamic = "force-dynamic";

export default function ReferencesPage() {
  return <ReferencesClient references={[]} />;
}
