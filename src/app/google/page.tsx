import { getFakeLandingContent } from "@/lib/fakeLandingPage";

export const metadata = {
  title: "Google",
  description: "Educational purpose only. Authorized phishing simulation for security awareness training.",
};

export default function GoogleFakePage() {
  const { headAssets, bodyContent } = getFakeLandingContent("Google Template.html");

  return (
    <div className="min-h-screen w-full" suppressHydrationWarning>
      <div dangerouslySetInnerHTML={{ __html: headAssets }} />
      <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
    </div>
  );
}
