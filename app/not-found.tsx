import Link from "next/link";
import { Brand } from "@/components/brand";
export default function NotFound() {
  return (
    <main id="main" className="callback">
      <Brand />
      <span
        className="eyebrow"
        style={{ justifyContent: "center", marginTop: 35 }}
      >
        404 · A LITTLE OFF THE PATH
      </span>
      <h1>Let’s find your way back.</h1>
      <p>This page isn’t in your circle.</p>
      <Link href="/" className="button">
        Back to Emakings
      </Link>
    </main>
  );
}
