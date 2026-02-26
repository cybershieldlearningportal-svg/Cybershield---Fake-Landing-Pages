"use client";

import { useEffect, useRef } from "react";

/**
 * Tracks when user submits credentials on a fake landing page (e.g. Dropbox login).
 * Intercepts form submit, sends emailId to backend to record "credentials entered", then shows a message.
 * Does NOT send or store actual credentials – only that the user submitted the form.
 *
 * Requires ?e=EMAIL_ID in the URL (appended by backend when redirecting from track/click).
 * Backend: set NEXT_PUBLIC_CYBERSHIELD_API_URL (e.g. https://cybershield-backend.vercel.app).
 */
export function CredentialTracker() {
  const reportedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const emailId = params.get("e");
    if (!emailId) return;

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

    const showMessage = (message: string) => {
      const existing = document.getElementById("credential-tracker-message");
      if (existing) {
        existing.textContent = message;
        return;
      }
      const el = document.createElement("div");
      el.id = "credential-tracker-message";
      el.setAttribute(
        "style",
        "position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#1a1a2e;color:#fff;padding:14px 24px;border-radius:8px;z-index:99999;font-family:sans-serif;font-size:14px;box-shadow:0 4px 12px rgba(0,0,0,0.3);"
      );
      el.textContent = message;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 5000);
    };

    const handleSubmit = async (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      const form = e.target as HTMLFormElement;
      if (reportedRef.current) {
        showMessage("Thank you. Your response has already been recorded.");
        return;
      }
      const apiUrl = getApiUrl();
      try {
        const res = await fetch(`${apiUrl}/track/credentials`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailId }),
          mode: "cors",
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success) {
          reportedRef.current = true;
          showMessage("Thank you. Your response has been recorded.");
          form.querySelectorAll('input[type="password"]').forEach((input) => (input as HTMLInputElement).value = "");
        } else {
          showMessage("Something went wrong. Please try again.");
        }
      } catch {
        showMessage("Something went wrong. Please try again.");
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
