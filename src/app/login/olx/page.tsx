import { getFakeLandingContent } from "@/lib/fakeLandingPage";

export const metadata = {
  title: "OLX",
  description: "Educational purpose only. Authorized phishing simulation for security awareness training.",
};

export default function OLXFakePage() {
  const { headAssets, bodyContent } = getFakeLandingContent("OLX Template.html");

  return (
    <div className="min-h-screen w-full" suppressHydrationWarning>
      <div dangerouslySetInnerHTML={{ __html: headAssets }} />
      <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
    </div>
  );
}
