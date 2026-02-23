import { getFakeLandingContent } from "@/lib/fakeLandingPage";

export const metadata = {
  title: "Microsoft",
  description: "Educational purpose only. Authorized phishing simulation for security awareness training.",
};

export default function MicrosoftFakePage() {
  const { headAssets, bodyContent } = getFakeLandingContent("Microsoft Template.html");

  return (
    <div className="min-h-screen w-full" suppressHydrationWarning>
      <div dangerouslySetInnerHTML={{ __html: headAssets }} />
      <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
    </div>
  );
}
