"use client";

import { useEffect } from "react";

/**
 * WhatsApp click telemetry: when user lands with ?ct=TOKEN, call backend to record click, then strip param.
 * Backend: set NEXT_PUBLIC_CYBERSHIELD_API_URL in .env.local / Vercel (e.g. https://cybershield-backend.vercel.app).
 *
 * Local testing with DEPLOYED landing page (HTTPS): browsers block "mixed content" (HTTPS page → HTTP API).
 * So ?cybershield_api=http://localhost:5001 will NOT work from https://yoursite.vercel.app — the fetch is blocked.
 * Use an HTTPS URL for your local backend instead, e.g. ngrok: run "ngrok http 5001" and use
 *   ?cybershield_api=https://YOUR-NGROK-URL.ngrok-free.app
 * in the campaign landing URL so the click is sent to your local backend.
 */
export function ClickTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const ct = params.get("ct");
    if (!ct) return;

    // Persist for CredentialTracker (landing page may strip ?ct= and cybershield_api from URL after recording click)
    const apiOverride = params.get("cybershield_api");
    const baseUrl =
      (apiOverride && apiOverride.startsWith("http") ? apiOverride.trim().replace(/\/$/, "") : null) ||
      process.env.NEXT_PUBLIC_CYBERSHIELD_API_URL ||
      "https://cybershield-backend.vercel.app";
    const apiUrl = baseUrl.replace(/\/$/, "");
    try {
      sessionStorage.setItem("cybershield_wa_ct", ct);
      if (apiOverride && apiOverride.startsWith("http")) sessionStorage.setItem("cybershield_api_url", apiUrl);
    } catch (_) {}
    const clickUrl = `${apiUrl}/api/whatsapp-campaigns/click?t=${encodeURIComponent(ct)}`;
    const isNgrok = /ngrok-free\.(app|dev)|\.ngrok(-[a-z0-9]+)?\.(io|app|dev)/i.test(apiUrl);
    const headers: HeadersInit = {};
    if (isNgrok) headers["ngrok-skip-browser-warning"] = "1"; // required so ngrok forwards the request instead of showing interstitial
    fetch(clickUrl, { method: "GET", mode: "cors", headers })
      .then((res) => {
        if (res.ok) console.log("[ClickTracker] WhatsApp click recorded");
        else console.warn("[ClickTracker] WhatsApp click request returned", res.status, clickUrl);
      })
      .catch((err) => {
        console.warn("[ClickTracker] WhatsApp click request failed:", err.message);
      });

    params.delete("ct");
    params.delete("cybershield_api");
    const cleanSearch = params.toString();
    const cleanPath = window.location.pathname + (cleanSearch ? `?${cleanSearch}` : "") + (window.location.hash || "");
    window.history.replaceState({}, "", cleanPath);
  }, []);

  return null;
}
