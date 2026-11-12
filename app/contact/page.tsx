import Link from "next/link";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Waitlist } from "@/components/waitlist";
export const metadata = { title: "Contact" };
export default function Contact() {
  return (
    <>
      <Nav />
      <main id="main" className="container legal">
        <span className="eyebrow">LET’S STAY CONNECTED</span>
        <h1>A little hello.</h1>
        <p>
          Emakings is a founder-operated initiative, currently preparing for
          early access. Get in touch for questions, support, or privacy
          requests.
        </p>
        <h2>Contact Emakings.</h2>
        <p>
          Email: <a href="mailto:mat@emakings.site">mat@emakings.site</a>
          <br />
          Phone: <a href="tel:+2349076234742">+2349076234742</a>
        </p>
        <h2>Hear when we’re ready.</h2>
        <p>
          Leave your details for early-access updates. This form works when the
          waitlist database is configured; it will tell you if it cannot save
          your entry.
        </p>
        <Waitlist />
        <h2>Manage your information.</h2>
        <p>
          Account holders can manage and delete their workspace records in{" "}
          <Link href="/dashboard/settings">Settings & privacy</Link>. For help
          with your account, a complete data export, or waitlist removal, email{" "}
          <a href="mailto:mat@emakings.site">mat@emakings.site</a>.
        </p>
      </main>
      <Footer />
    </>
  );
}
