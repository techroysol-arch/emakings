"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowUpRight, LoaderCircle } from "lucide-react";
import { authConfigured, browserDB } from "@/lib/supabase";
export function AuthForm({ signup = false }: { signup?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const configured = authConfigured();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    const values = new FormData(e.currentTarget);
    try {
      const db = browserDB();
      const email = String(values.get("email"));
      const password = String(values.get("password"));
      if (signup) {
        const { data, error } = await db.auth.signUp({
          email,
          password,
          options: {
            data: { display_name: String(values.get("name")) },
            emailRedirectTo: `${location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        if (data.session) router.push("/dashboard");
        else
          setMessage("Check your email to confirm your account, then sign in.");
      } else {
        const { error } = await db.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-page" id="main">
      <div className="auth-story">
        <span className="sparkle-box">
          <Sparkles size={27} />
        </span>
        <h1>
          A little intelligence.
          <br />
          <span>
            A lot more
            <br />
            connection.
          </span>
        </h1>
        <p>
          A space for your people, the moments that matter, and the words you’ve
          been looking for.
        </p>
      </div>
      <form className="auth-form" onSubmit={submit}>
        <span className="eyebrow">YOUR THOUGHTFUL SPACE</span>
        <h2>{signup ? "Make room for connection." : "Welcome back."}</h2>
        <p>
          {signup
            ? "Start with your people. We’ll help with the little things."
            : "Your next thoughtful moment is waiting."}
        </p>
        {signup && (
          <label>
            Your name
            <input
              name="name"
              autoComplete="name"
              required
              maxLength={100}
              placeholder="How should we call you?"
            />
          </label>
        )}
        <label>
          Email address
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="you@example.com"
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            autoComplete={signup ? "new-password" : "current-password"}
            required
            minLength={signup ? 12 : 1}
            maxLength={128}
            placeholder={signup ? "At least 12 characters" : "Your password"}
          />
        </label>
        <button className="button full" disabled={busy || !configured}>
          {busy ? (
            <LoaderCircle className="spin" size={17} />
          ) : (
            <>
              {signup ? "Create your account" : "Sign in"}
              <ArrowUpRight size={16} />
            </>
          )}
        </button>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="success">
            {message}
          </p>
        )}
        {!configured && (
          <p className="demo-notice">
            Accounts open when our backend is connected. In the meantime,
            explore a fully interactive, browser-local sample workspace.
            <br />
            <Link href="/dashboard?demo=1" className="text-link">
              Explore the demo <ArrowUpRight size={13} />
            </Link>
          </p>
        )}
        <p className="auth-switch">
          {signup ? "Already have an account?" : "New to Emakings?"}{" "}
          <Link href={signup ? "/login" : "/signup"}>
            {signup ? "Sign in" : "Get started"}
          </Link>
        </p>
        <p className="tiny muted">
          By continuing, you agree to our <Link href="/terms">Terms</Link> and{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </form>
    </div>
  );
}
