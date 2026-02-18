import { getFakeLandingContent } from "@/lib/fakeLandingPage";

export const metadata = {
  title: "Facebook",
  description: "Phishing simulation landing page",
};

export default function FacebookFakePage() {
  const { headAssets, bodyContent } = getFakeLandingContent("Facebook Template.html");

  return (
    <div className="min-h-screen w-full" suppressHydrationWarning>
      <div dangerouslySetInnerHTML={{ __html: headAssets }} />
      <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
    </div>
  );
}
