"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="callback">
      <h1>A little pause.</h1>
      <p>We couldn’t open this page. Please try again.</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
      <Link href="/" className="text-link" style={{ marginLeft: 20 }}>
        Back home
      </Link>
    </main>
  );
}
