"use client";

import { useEffect } from "react";

/**
 * WhatsApp click telemetry: when user lands with ?ct=TOKEN, call backend to record click, then strip param.
 * Email open/click tracking is handled by nodemailer-mail-tracking on the backend (no landing-page param).
 * Backend: set NEXT_PUBLIC_CYBERSHIELD_API_URL in .env.local / Vercel (e.g. https://cybershield-backend.vercel.app).
 *
 * Local testing: add ?cybershield_api=http://localhost:5001 to the campaign landing page URL
 * so the click is sent to your local backend (same machine only).
 */
export function ClickTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ct = params.get("ct");
    if (!ct) return;

    // Persist for CredentialTracker (landing page may strip ?ct= from URL after recording click)
    try {
      sessionStorage.setItem("cybershield_wa_ct", ct);
    } catch (_) {}

    const apiOverride = params.get("cybershield_api");
    const baseUrl =
      (apiOverride && apiOverride.startsWith("http") ? apiOverride.trim().replace(/\/$/, "") : null) ||
      process.env.NEXT_PUBLIC_CYBERSHIELD_API_URL ||
      "https://cybershield-backend.vercel.app";
    const apiUrl = baseUrl.replace(/\/$/, "");
    const clickUrl = `${apiUrl}/api/whatsapp-campaigns/click?t=${encodeURIComponent(ct)}`;
    fetch(clickUrl, { method: "GET", mode: "cors" })
      .then(() => console.log("[ClickTracker] WhatsApp click recorded"))
      .catch((err) => console.warn("[ClickTracker] WhatsApp click request failed", err));

    params.delete("ct");
    params.delete("cybershield_api");
    const cleanSearch = params.toString();
    const cleanPath = window.location.pathname + (cleanSearch ? `?${cleanSearch}` : "") + (window.location.hash || "");
    window.history.replaceState({}, "", cleanPath);
  }, []);

  return null;
}
