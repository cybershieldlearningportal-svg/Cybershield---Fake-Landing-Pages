import { getFakeLandingContent } from "@/lib/fakeLandingPage";

export const metadata = {
  title: "HBL",
  description: "Educational purpose only. Authorized phishing simulation for security awareness training.",
};

export default function HBLFakePage() {
  const { headAssets, bodyContent } = getFakeLandingContent("HBL Template.html");

  return (
    <div className="min-h-screen w-full" suppressHydrationWarning>
      <div dangerouslySetInnerHTML={{ __html: headAssets }} />
      <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
    </div>
  );
}
