"use client";

import { useEffect } from "react";

/**
 * When the user lands on a campaign link with ?ct=TOKEN (invisible click-tracking param),
 * call the backend to record the click, then remove the param from the URL.
 * Backend: set NEXT_PUBLIC_CYBERSHIELD_API_URL in .env.local / Vercel (e.g. https://cybershield-backend.vercel.app).
 */
export function ClickTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ct = params.get("ct");
    if (!ct) return;

    const apiUrl =
      process.env.NEXT_PUBLIC_CYBERSHIELD_API_URL ||
      "https://cybershield-backend.vercel.app";
    const clickUrl = `${apiUrl.replace(/\/$/, "")}/api/whatsapp-campaigns/click?t=${encodeURIComponent(ct)}`;
    fetch(clickUrl, { method: "GET", mode: "cors" }).catch(() => {});

    params.delete("ct");
    const cleanSearch = params.toString();
    const cleanPath = window.location.pathname + (cleanSearch ? `?${cleanSearch}` : "") + (window.location.hash || "");
    window.history.replaceState({}, "", cleanPath);
  }, []);

  return null;
}
