import { ReactNode } from "react";

// Force dynamic rendering for all fake landing pages to avoid oversized
// static/ISR payloads (e.g. Leopards template exceeds Vercel's 19 MB limit).
export const dynamic = "force-dynamic";

export default function PageLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
