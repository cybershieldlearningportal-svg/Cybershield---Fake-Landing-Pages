"use client";

import { useEffect } from "react";

/**
 * Landing page telemetry:
 * - WhatsApp: when user lands with ?ct=TOKEN, call backend to record click, then strip param.
 * - Email: when user lands with ?from_email=1 (after backend redirect from email link), log and strip param.
 *   (Email click is already recorded on the backend when they hit /api/track/email/click.)
 * Backend: set NEXT_PUBLIC_CYBERSHIELD_API_URL in .env.local / Vercel (e.g. https://cybershield-backend.vercel.app).
 *
 * Local testing with deployed landing page: add ?cybershield_api=http://localhost:5001 to the
 * campaign landing page URL so this page sends the click to your local backend instead of the
 * deployed one (only works when the person clicking is on the same machine as the backend).
 */
export function ClickTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ct = params.get("ct");
    const fromEmail = params.get("from_email");

    // Allow override for local testing
    const apiOverride = params.get("cybershield_api");
    const baseUrl =
      (apiOverride && apiOverride.startsWith("http") ? apiOverride.trim().replace(/\/$/, "") : null) ||
      process.env.NEXT_PUBLIC_CYBERSHIELD_API_URL ||
      "https://cybershield-backend.vercel.app";
    const apiUrl = baseUrl.replace(/\/$/, "");

    // WhatsApp: record click via backend, then clean URL
    if (ct) {
      console.log("[ClickTracker] WhatsApp telemetry: recording click", { ct: ct.substring(0, 12) + "..." });
      const clickUrl = `${apiUrl}/api/whatsapp-campaigns/click?t=${encodeURIComponent(ct)}`;
      fetch(clickUrl, { method: "GET", mode: "cors" })
        .then(() => console.log("[ClickTracker] WhatsApp click recorded"))
        .catch((err) => console.warn("[ClickTracker] WhatsApp click request failed", err));
      params.delete("ct");
    }

    // Email: click was already recorded by backend redirect; just log and clean URL
    if (fromEmail) {
      console.log("[ClickTracker] Email telemetry: user landed from email campaign link");
      params.delete("from_email");
    }

    params.delete("cybershield_api");
    const cleanSearch = params.toString();
    const cleanPath = window.location.pathname + (cleanSearch ? `?${cleanSearch}` : "") + (window.location.hash || "");
    if (ct || fromEmail) {
      window.history.replaceState({}, "", cleanPath);
    }
  }, []);

  return null;
}
