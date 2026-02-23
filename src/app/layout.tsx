import type { Metadata } from "next";
import "./globals.css";

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
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}