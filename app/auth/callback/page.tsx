"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { browserDB } from "@/lib/supabase";
import { Brand } from "@/components/brand";
export default function Callback() {
  const [error, setError] = useState("");
  useEffect(() => {
    async function exchange() {
      try {
        const url = new URL(location.href);
        const code = url.searchParams.get("code");
        if (url.searchParams.get("error"))
          throw new Error(
            "Your confirmation link is invalid or expired. Please request a new account confirmation.",
          );
        if (code) {
          const { error } = await browserDB().auth.exchangeCodeForSession(code);
          if (error) throw error;
        }
        const {
          data: { user },
        } = await browserDB().auth.getUser();
        if (!user)
          throw new Error("Please sign in after confirming your email.");
        location.replace("/dashboard");
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Could not confirm your account.",
        );
      }
    }
    void exchange();
  }, []);
  return (
    <main id="main" className="callback">
      <Brand />
      <h1>{error ? "One more step." : "Confirming your account…"}</h1>
      <p role="status">{error || "We’re opening your thoughtful space."}</p>
      {error && (
        <Link href="/login" className="button">
          Go to sign in
        </Link>
      )}
    </main>
  );
}
