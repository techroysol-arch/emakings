"use client";
import { useState } from "react";
import {
  Sparkles,
  ArrowUpRight,
  Copy,
  Check,
  Gift,
  Heart,
  CalendarDays,
  LoaderCircle,
} from "lucide-react";
import { defaultInput, sampleSuggestion } from "@/lib/sample";
import { aiInput, type AIInput, type AIOutput } from "@/lib/validation";
import { browserDB } from "@/lib/supabase";
export function Assistant({
  sample = true,
  onGenerated,
}: {
  sample?: boolean;
  onGenerated?: () => void;
}) {
  const [input, setInput] = useState<AIInput>(defaultInput);
  const [result, setResult] = useState<AIOutput | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const update = (key: keyof AIInput, value: string) =>
    setInput((old) => ({ ...old, [key]: value }));
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setResult(null);
    setBusy(true);
    try {
      const valid = aiInput.parse(input);
      if (sample) {
        await new Promise((r) => setTimeout(r, 650));
        setResult(sampleSuggestion(valid));
      } else {
        const {
          data: { session },
        } = await browserDB().auth.getSession();
        const response = await fetch("/api/ai", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token || ""}`,
          },
          body: JSON.stringify(valid),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setResult(data.result);
        onGenerated?.();
      }
    } catch (e) {
      setError(
        e instanceof Error && !("issues" in e)
          ? e.message
          : "Please complete all the fields.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(result?.message || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(
        "Copy is unavailable in this browser. You can select and copy the text.",
      );
    }
  }
  return (
    <div className="demo-shell">
      <form className="assistant-form" onSubmit={submit}>
        <div className="form-heading">
          <span className="sparkle-box">
            <Sparkles size={20} />
          </span>
          <div>
            <h3>A thoughtful moment starts here.</h3>
            <p>A little context helps us make it personal.</p>
          </div>
        </div>
        <label>
          What’s the occasion?
          <input
            maxLength={150}
            required
            value={input.occasion}
            onChange={(e) => update("occasion", e.target.value)}
            placeholder="e.g. Partner’s birthday"
          />
        </label>
        <label>
          What do they love?
          <input
            maxLength={500}
            required
            value={input.interests}
            onChange={(e) => update("interests", e.target.value)}
            placeholder="Books, travelling, photography…"
          />
        </label>
        <div className="form-row">
          <label>
            Your relationship
            <input
              maxLength={80}
              required
              value={input.relationship}
              onChange={(e) => update("relationship", e.target.value)}
            />
          </label>
          <label>
            Set the tone
            <select
              value={input.tone}
              onChange={(e) => update("tone", e.target.value)}
            >
              {[
                "Warm & thoughtful",
                "Romantic",
                "Playful",
                "Simple & sincere",
              ].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          A little help with
          <select
            value={input.category}
            onChange={(e) => update("category", e.target.value)}
          >
            {["Everything", "Message", "Gift ideas", "Thoughtful gesture"].map(
              (t) => (
                <option key={t}>{t}</option>
              ),
            )}
          </select>
        </label>
        {!sample && (
          <label>
            Anything else? <span className="muted">(optional)</span>
            <textarea
              maxLength={1000}
              value={input.context}
              onChange={(e) => update("context", e.target.value)}
              placeholder="Shared memories, a comfortable budget, or details you want to include."
            />
          </label>
        )}
        <button disabled={busy} className="button full">
          {busy ? (
            <LoaderCircle size={17} className="spin" />
          ) : (
            <Sparkles size={17} />
          )}{" "}
          {busy
            ? "Preparing your suggestions…"
            : sample
              ? "Generate sample suggestions"
              : "Generate suggestions"}
          {!busy && <ArrowUpRight size={16} />}
        </button>
        <p className="tiny form-disclosure">
          {sample
            ? "Sample demonstration · Uses templates, not live AI. No input is sent to an AI provider."
            : "Your input is shared with the configured AI provider to create suggestions. Review before sending."}
        </p>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
      </form>
      <div className="assistant-results" aria-live="polite" aria-busy={busy}>
        <div className="result-top">
          <span>
            <i className="status-dot" />
            {sample ? "SAMPLE DEMONSTRATION" : "YOUR PERSONALIZED SUGGESTIONS"}
          </span>
          <span className="tiny muted">Made with intention</span>
        </div>
        {busy ? (
          <div className="result-skeleton">
            <div />
            <div />
            <div />
          </div>
        ) : result ? (
          <div className="result-content">
            {["Everything", "Message"].includes(input.category) && (
              <article className="result-message">
                <div>
                  <span className="eyebrow micro">
                    <Heart size={13} /> THE RIGHT WORDS
                  </span>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={copy}
                    aria-label="Copy message"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <p>“{result.message}”</p>
              </article>
            )}
            {["Everything", "Gift ideas"].includes(input.category) && (
              <div className="result-gifts">
                <span className="eyebrow micro">
                  <Gift size={13} /> A LITTLE SOMETHING SPECIAL
                </span>
                {result.gifts.map((gift, i) => (
                  <article key={i}>
                    <span>0{i + 1}</span>
                    <div>
                      <strong>{gift.title}</strong>
                      <p>{gift.reason}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
            {["Everything", "Thoughtful gesture"].includes(input.category) && (
              <article className="result-gesture">
                <span className="eyebrow micro">
                  <Sparkles size={13} /> A MOMENT TOGETHER
                </span>
                <p>{result.gesture}</p>
              </article>
            )}
            <p className="result-follow">
              <CalendarDays size={16} />
              {result.followUp}
            </p>
          </div>
        ) : (
          <div className="result-empty">
            <span className="empty-orbit">
              <Sparkles size={33} />
            </span>
            <h3>
              A little context.
              <br />
              Something meaningful.
            </h3>
            <p>
              Tell us about someone who matters.
              <br />
              We’ll help you take it from there.
            </p>
            <span className="pill">
              {sample ? "Try the sample experience" : "Ready when you are"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
