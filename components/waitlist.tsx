"use client";
import { useState } from "react";
import { ArrowUpRight, Check, LoaderCircle } from "lucide-react";
export function Waitlist() {
  const [state, setState] = useState<"idle" | "busy" | "success">("idle");
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("busy");
    setError("");
    const values = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setState("success");
    } catch (e) {
      setState("idle");
      setError(e instanceof Error ? e.message : "Please try again.");
    }
  }
  return state === "success" ? (
    <div className="waitlist-success" role="status">
      <Check />
      You’re on the list. We’ll be in touch when early access opens.
    </div>
  ) : (
    <form className="waitlist-form" onSubmit={submit}>
      <div className="waitlist-fields">
        <label className="sr-only" htmlFor="waitlist-name">
          Your name
        </label>
        <input
          id="waitlist-name"
          name="name"
          placeholder="Your name"
          required
          maxLength={100}
          autoComplete="given-name"
        />
        <label className="sr-only" htmlFor="waitlist-email">
          Email address
        </label>
        <input
          id="waitlist-email"
          name="email"
          type="email"
          placeholder="Your email address"
          required
          maxLength={254}
          autoComplete="email"
        />
        <input
          className="honeypot"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
        <button className="button" disabled={state === "busy"}>
          {state === "busy" ? (
            <LoaderCircle size={17} className="spin" />
          ) : (
            <>
              Get early access <ArrowUpRight size={16} />
            </>
          )}
        </button>
      </div>
      <p className="tiny muted">
        Join the waitlist. Just thoughtful updates, no noise.{" "}
        <a href="/privacy">Privacy policy</a>
      </p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
