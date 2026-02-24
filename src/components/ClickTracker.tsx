"use client";

import { useEffect } from "react";

/**
 * When the user lands on a campaign link with ?ct=TOKEN (invisible click-tracking param),
 * call the backend to record the click, then remove the param from the URL.
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
    if (!ct) return;

    // Allow override for local testing: landing page URL can include ?cybershield_api=http://localhost:5001
    const apiOverride = params.get("cybershield_api");
    const baseUrl =
      (apiOverride && apiOverride.startsWith("http") ? apiOverride.trim().replace(/\/$/, "") : null) ||
      process.env.NEXT_PUBLIC_CYBERSHIELD_API_URL ||
      "https://cybershield-backend.vercel.app";
    const apiUrl = baseUrl.replace(/\/$/, "");
    const clickUrl = `${apiUrl}/api/whatsapp-campaigns/click?t=${encodeURIComponent(ct)}`;
    fetch(clickUrl, { method: "GET", mode: "cors" }).catch(() => {});

    params.delete("ct");
    params.delete("cybershield_api");
    const cleanSearch = params.toString();
    const cleanPath = window.location.pathname + (cleanSearch ? `?${cleanSearch}` : "") + (window.location.hash || "");
    window.history.replaceState({}, "", cleanPath);
  }, []);

  return null;
}
