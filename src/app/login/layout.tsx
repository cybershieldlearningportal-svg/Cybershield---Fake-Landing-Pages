import { ReactNode } from "react";

// Force dynamic rendering for all fake landing pages to avoid oversized
// static/ISR payloads (e.g. Leopards template exceeds Vercel's 19 MB limit).
export const dynamic = "force-dynamic";

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <p
        className="fixed bottom-0 left-0 right-0 text-center text-[9px] text-zinc-500 bg-white/80 dark:bg-black/80 py-1"
        style={{ fontFamily: "sans-serif" }}
      >
        This site is for learning purposes only.
      </p>
    </>
  );
}
