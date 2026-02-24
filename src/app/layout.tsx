import type { Metadata } from "next";
import "./globals.css";
import { ClickTracker } from "@/components/ClickTracker";

// Force dynamic rendering for all fake landing pages to avoid oversized
// static/ISR payloads (e.g. Leopards template exceeds Vercel's 19 MB limit).
export const dynamic = "force-dynamic";

const educationalOnly =
  "Educational purpose only. Authorized phishing simulation for security awareness training. Not a real brand or service.";

export const metadata: Metadata = {
  title: "Landing",
  description: educationalOnly,
  keywords: [
    "educational purpose only",
    "learning purpose only",
    "security awareness",
    "phishing simulation",
    "authorized training",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    title: "Landing — Educational Purpose Only",
    description: educationalOnly,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Landing — Educational Purpose Only",
    description: educationalOnly,
  },
  other: {
    "x-purpose": "educational-only",
    "security-training": "authorized-phishing-simulation",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <ClickTracker />
        {children}
        <p
          className="fixed bottom-0 left-0 right-0 text-center text-[9px] text-zinc-500 bg-white/80 dark:bg-black/80 py-1"
          style={{ fontFamily: "sans-serif" }}
        >
          This site is for learning purposes only.
        </p>
      </body>
    </html>
  );
}