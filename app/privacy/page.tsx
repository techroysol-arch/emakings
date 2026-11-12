import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
export const metadata = { title: "Privacy policy" };
export default function Privacy() {
  return (
    <>
      <Nav />
      <main id="main" className="container legal">
        <span className="eyebrow">YOUR MOMENTS DESERVE PRIVACY</span>
        <h1>
          Your information.
          <br />
          Your choice.
        </h1>
        <p className="legal-note">
          Pre-launch policy · Updated November 11, 2026. The legal operator’s
          identity must be supplied before accepting public registrations.
          Privacy contact:{" "}
          <a href="mailto:mat@emakings.site">mat@emakings.site</a>.
        </p>
        <h2>What you choose to share</h2>
        <p>
          Account mode stores your email, display name, people profiles,
          interests, optional notes, important dates, reminders, and preferences
          in Supabase. We do not connect to or read your private conversations.
          Add information about others only when you have permission to do so.
          Avoid entering sensitive or confidential information.
        </p>
        <h2>Sample demonstrations</h2>
        <p>
          The public assistant uses labelled templates in your browser. Sample
          inputs are not sent to an AI provider. The demo workspace stores
          sample records and your edits in local browser storage. It is not a
          secure account and should not be used for real private information.
          You can clear its data in Settings or your browser’s site storage.
        </p>
        <h2>Live AI processing</h2>
        <p>
          When live generation is configured, the occasion, interests,
          relationship type, tone, category, and additional context you submit
          are sent to the configured AI provider through our server. Review each
          result before sharing. Provider processing locations and retention
          depend on the selected service; the operator must disclose that
          provider and its terms before launch. No training on your information
          by Emakings is implemented.
        </p>
        <h2>Storage and access</h2>
        <p>
          Authenticated records use account-scoped database policies. Production
          connections must use HTTPS. Supabase manages account authentication.
          No security certifications or regulatory compliance claims are made.
          We do not place advertising trackers on this site. Authentication uses
          browser storage to maintain your session.
        </p>
        <h2>Retention and control</h2>
        <p>
          Workspace records remain until you delete them or your account. New AI
          results are saved only when suggestion history is enabled; turning it
          off does not remove previous results. You can delete each stored
          suggestion. Account deletion cascades to private workspace records.
          Infrastructure backups may retain deleted records under the backend
          operator’s backup policy; the final retention schedule must be set
          before launch.
        </p>
        <p>
          Rate-limit buckets contain hashed identifiers and request counts.
          Expired buckets are removed as new requests are processed. Waitlist
          entries are stored separately from accounts and used only for
          early-access updates. To request waitlist removal, contact{" "}
          <a href="mailto:mat@emakings.site">mat@emakings.site</a>.
        </p>
        <h2>Export and deletion</h2>
        <p>
          Settings provides an export of loaded workspace records, up to 500 per
          category, and account deletion. For complete exports beyond that limit
          or waitlist removal, email{" "}
          <a href="mailto:mat@emakings.site">mat@emakings.site</a> or call{" "}
          <a href="tel:+2349076234742">+2349076234742</a>.
        </p>
        <h2>Before public launch</h2>
        <p>
          The operator must finalize its legal identity, processing providers,
          locations, retention periods, age eligibility, and applicable user
          rights for its actual jurisdiction. This pre-launch page describes the
          implementation and does not claim a legal review.
        </p>
      </main>
      <Footer />
    </>
  );
}
