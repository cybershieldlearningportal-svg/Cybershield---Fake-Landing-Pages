import { getFakeLandingContent } from "@/lib/fakeLandingPage";

export const metadata = {
  title: "Netflix",
  description: "Educational purpose only. Authorized phishing simulation for security awareness training.",
};

export default function NetflixFakePage() {
  const { headAssets, bodyContent } = getFakeLandingContent("Netflix Template.html");

  return (
    <div className="min-h-screen w-full" suppressHydrationWarning>
      <div dangerouslySetInnerHTML={{ __html: headAssets }} />
      <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
    </div>
  );
}
