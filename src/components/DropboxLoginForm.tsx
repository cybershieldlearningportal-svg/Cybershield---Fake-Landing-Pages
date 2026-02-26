"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Interactive Dropbox-style login form for phishing simulation.
 * Users can type email and password; on submit we record "credentials entered" (no credentials stored).
 * Requires ?e=EMAIL_ID in the URL (from track/click redirect).
 */
export function DropboxLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const emailIdRef = useRef<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    emailIdRef.current = params.get("e");
  }, []);

  const getApiUrl = () => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    const apiOverride = params.get("cybershield_api");
    const base =
      (apiOverride && apiOverride.startsWith("http") ? apiOverride.trim().replace(/\/$/, "") : null) ||
      process.env.NEXT_PUBLIC_CYBERSHIELD_API_URL ||
      "https://cybershield-backend.vercel.app";
    return base.replace(/\/$/, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailId = emailIdRef.current;
    if (!emailId) {
      setMessage({ text: "Missing tracking parameter.", type: "error" });
      return;
    }
    if (submitted) {
      setMessage({ text: "Your response has already been recorded.", type: "success" });
      return;
    }
    try {
      const res = await fetch(`${getApiUrl()}/track/credentials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailId }),
        mode: "cors",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setSubmitted(true);
        setMessage({ text: "Thank you. Your response has been recorded.", type: "success" });
        setPassword("");
      } else {
        setMessage({ text: "Something went wrong. Please try again.", type: "error" });
      }
    } catch {
      setMessage({ text: "Something went wrong. Please try again.", type: "error" });
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <svg width="36" height="32" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M18 0L0 8v16l18 8 18-8V8L18 0zm0 4.5l12 6.5v11L18 28.5 6 22.5V11l12-6.5z"
              fill="#0061FF"
            />
          </svg>
          <span style={styles.logoText}>Dropbox</span>
        </div>
        <h1 style={styles.title}>Sign in</h1>
        <p style={styles.subtitle}>Email or username</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <p style={styles.subtitle}>Password</p>
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button}>
            Sign in
          </button>
        </form>
        {message && (
          <p
            style={{
              ...styles.message,
              color: message.type === "success" ? "#0d7d0d" : "#c00",
              marginTop: 16,
            }}
          >
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(180deg, #f0f4f8 0%, #e2e8f0 100%)",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    padding: 40,
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 600,
    color: "#0061FF",
  },
  title: {
    fontSize: 22,
    fontWeight: 600,
    color: "#1a1a1a",
    margin: "0 0 24px 0",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 500,
    color: "#374151",
    margin: "0 0 8px 0",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px 14px",
    fontSize: 16,
    border: "1px solid #d1d5db",
    borderRadius: 8,
    marginBottom: 20,
    outline: "none",
  },
  button: {
    width: "100%",
    padding: "12px 24px",
    fontSize: 16,
    fontWeight: 600,
    color: "#fff",
    background: "#0061FF",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    marginTop: 8,
  },
  message: {
    fontSize: 14,
    margin: 0,
  },
};
