"use client";

import { useEffect, useRef } from "react";

/**
 * Tracks when user submits credentials on a fake landing page (e.g. Dropbox login).
 * Intercepts form submit, sends emailId (email phishing) or clickToken (WhatsApp phishing) to backend
 * to record "credentials entered", then shows a message.
 * Does NOT send or store actual credentials – only that the user submitted the form.
 *
 * Email: requires ?e=EMAIL_ID in the URL (appended by backend when redirecting from track/click).
 * WhatsApp: requires ?ct=CLICK_TOKEN in the URL (appended to landing link when sending WhatsApp message).
 * Backend: set NEXT_PUBLIC_CYBERSHIELD_API_URL (e.g. https://cybershield-backend.vercel.app).
 */
export function CredentialTracker() {
  const reportedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const emailId = params.get("e");
    // WhatsApp: ct may have been stripped from URL by ClickTracker; fallback to sessionStorage
    const clickToken = params.get("ct") || (typeof sessionStorage !== "undefined" ? sessionStorage.getItem("cybershield_wa_ct") : null);
    if (!emailId && !clickToken) return;

    // Make all inputs in the page functional (template may have disabled/readonly)
    const enableInputs = () => {
      document.querySelectorAll("input, textarea").forEach((el) => {
        const input = el as HTMLInputElement | HTMLTextAreaElement;
        input.removeAttribute("disabled");
        input.removeAttribute("readonly");
        (input as HTMLElement).style.pointerEvents = "auto";
        (input as HTMLElement).style.userSelect = "text";
      });
    };
    enableInputs();
    // Run again after a short delay in case template renders inputs lazily
    const t = setTimeout(enableInputs, 500);

    const getApiUrl = () => {
      const apiOverride = params.get("cybershield_api");
      const base =
        (apiOverride && apiOverride.startsWith("http") ? apiOverride.trim().replace(/\/$/, "") : null) ||
        process.env.NEXT_PUBLIC_CYBERSHIELD_API_URL ||
        "https://cybershield-backend.vercel.app";
      return base.replace(/\/$/, "");
    };

    const showMessage = (content: string | { title: string; body: string }) => {
      const existing = document.getElementById("credential-tracker-message");
      if (existing) {
        existing.innerHTML = typeof content === "string" ? content : `<strong>${content.title}</strong><br><br>${content.body}`;
        return;
      }
      const el = document.createElement("div");
      el.id = "credential-tracker-message";
      el.setAttribute(
        "style",
        "position:fixed;top:20px;left:50%;transform:translateX(-50%);max-width:420px;background:#1a1a2e;color:#fff;padding:20px 24px;border-radius:8px;z-index:99999;font-family:sans-serif;font-size:14px;line-height:1.5;box-shadow:0 4px 20px rgba(0,0,0,0.4);border:1px solid #e53e3e;"
      );
      el.innerHTML = typeof content === "string" ? content : `<strong>${content.title}</strong><br><br>${content.body}`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 12000);
    };

    const handleSubmit = async (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      const form = e.target as HTMLFormElement;
      if (reportedRef.current) {
        showMessage("This phishing attempt was already recorded. Please follow your organization's security guidelines.");
        return;
      }
      const apiUrl = getApiUrl();
      // Prefer clickToken (WhatsApp) when present so we don't use a stale e= param from email flow
      const body = clickToken ? { clickToken } : emailId ? { emailId } : null;
      if (!body) {
        showMessage("Missing tracking info. Please use the link from your email or WhatsApp message.");
        return;
      }
      try {
        const res = await fetch(`${apiUrl}/track/credentials`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          mode: "cors",
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success) {
          reportedRef.current = true;
          if (clickToken && typeof sessionStorage !== "undefined") {
            try {
              sessionStorage.removeItem("cybershield_wa_ct");
            } catch (_) {}
          }
          showMessage({
            title: "Phishing attempt detected",
            body:
              "You entered your credentials on a simulated phishing page. This was a security awareness training exercise. " +
              "In a real attack, this could have led to account takeover. Tips: verify the URL before signing in, never enter passwords on links from emails, and report suspicious messages to your IT or security team.",
          });
          form.querySelectorAll('input[type="password"]').forEach((input) => (input as HTMLInputElement).value = "");
        } else {
          const serverMsg = data?.message || (res.status === 404 ? "Campaign not found. If testing locally, ensure the landing page uses the same backend as the campaign (see README)." : null);
          showMessage(serverMsg || "Something went wrong. Please try again.");
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "";
        showMessage(msg && msg.toLowerCase().includes("fetch") ? "Could not reach the server. If testing locally, ensure the backend is running and the landing page API URL points to it." : "Something went wrong. Please try again.");
      }
    };

    const forms = document.querySelectorAll("form");
    const cleanup: (() => void)[] = [() => clearTimeout(t)];
    forms.forEach((form) => {
      form.addEventListener("submit", handleSubmit, true);
      cleanup.push(() => form.removeEventListener("submit", handleSubmit, true));
    });

    return () => cleanup.forEach((fn) => fn());
  }, []);

  return null;
}
