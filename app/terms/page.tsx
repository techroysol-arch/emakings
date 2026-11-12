import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
export const metadata = { title: "Terms of service" };
export default function Terms() {
  return (
    <>
      <Nav />
      <main id="main" className="container legal">
        <span className="eyebrow">A THOUGHTFUL START</span>
        <h1>Terms of service.</h1>
        <p className="legal-note">
          Pre-launch terms · Updated November 11, 2026. Operator identity,
          and governing jurisdiction must be finalized before
          public registration.
        </p>
        <h2>The Emakings experience</h2>
        <p>
          Emakings is an early-stage relationship companion for profiles,
          reminders, and AI-assisted suggestions. Some services require
          configured external infrastructure. Prototype and planned capabilities
          are labelled. Browser-local demonstrations use illustrative data and
          template suggestions.
        </p>
        <h2>Your account and information</h2>
        <p>
          You are responsible for keeping your sign-in credentials private and
          for ensuring you have permission to submit information about other
          people. Do not use the service for harassment, deception, unlawful
          activity, surveillance, or manipulation. Do not submit secrets or
          highly sensitive information.
        </p>
        <h2>AI suggestions</h2>
        <p>
          AI may produce inaccurate, inappropriate, or repetitive suggestions.
          Review and edit outputs before acting on them or sharing them.
          Suggestions are inspiration, not professional relationship, medical,
          legal, or financial advice. Emakings does not evaluate a person’s
          character or diagnose relationships.
        </p>
        <h2>Reminders and availability</h2>
        <p>
          Reminders are saved in your workspace. Email, push, or SMS delivery is
          not implemented and must not be relied on. External providers may be
          unavailable, and beta features may change. Keep independent copies of
          important dates and information.
        </p>
        <h2>Ending your use</h2>
        <p>
          You can stop using the service at any time and delete workspace
          records or your account in Settings. See the{" "}
          <a href="/privacy">privacy policy</a> for storage and deletion
          details. Demo data can be cleared from your browser.
        </p>
        <h2>Product status</h2>
        <p>
          No payments, subscriptions, purchased goods, guaranteed outcomes, or
          third-party endorsements are represented by this prototype. Applicable
          consumer rights remain unaffected. Final service terms and legal
          operator details must be published for the public launch. For support,
          email <a href="mailto:mat@emakings.site">mat@emakings.site</a>.
        </p>
      </main>
      <Footer />
    </>
  );
}
