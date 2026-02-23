import { getFakeLandingContent } from "@/lib/fakeLandingPage";

export const metadata = {
  title: "PayPal",
  description: "Educational purpose only. Authorized phishing simulation for security awareness training.",
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
