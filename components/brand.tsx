import Link from "next/link";
export function Mark() {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path
        d="M7 20c0-12 13-12 13 0s13 12 13 0-13-12-13 0-13 12-13 0"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Emakings home">
      <span className="brand-mark">
        <Mark />
      </span>
      emakings<span className="ai-label">AI</span>
    </Link>
  );
}
