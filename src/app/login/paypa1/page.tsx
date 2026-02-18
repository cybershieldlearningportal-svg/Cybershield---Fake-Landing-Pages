import { getFakeLandingContent } from "@/lib/fakeLandingPage";

export const metadata = {
  title: "PayPal",
  description: "Phishing simulation landing page",
};

export default function PaypalFakePage() {
  const { headAssets, bodyContent } = getFakeLandingContent("Paypal Template.html");

  return (
    <div className="min-h-screen w-full" suppressHydrationWarning>
      <div dangerouslySetInnerHTML={{ __html: headAssets }} />
      <div dangerouslySetInnerHTML={{ __html: bodyContent }} />
    </div>
  );
}
