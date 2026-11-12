import Link from "next/link";
import { Brand } from "./brand";
export function Footer() {
  return (
    <footer className="container footer">
      <div className="footer-top">
        <div>
          <Brand />
          <p>Intelligence for more meaningful connections.</p>
          <span className="tiny muted">
            Thoughtfully built. Human at heart.
          </span>
        </div>
        <div className="footer-links">
          <div>
            <span>Explore</span>
            <Link href="/">Home</Link>
            <Link href="/#features">Features</Link>
            <Link href="/#how-it-works">How it works</Link>
            <Link href="/#technology">Technology</Link>
          </div>
          <div>
            <span>Emakings</span>
            <Link href="/#about">About us</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy policy</Link>
            <Link href="/terms">Terms of service</Link>
          </div>
          <div>
            <span>Get in touch</span>
            <a href="mailto:mat@emakings.site">mat@emakings.site</a>
            <a href="tel:+2349076234742">+2349076234742</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Emakings AI. All rights reserved.</span>
        <span>Made for the people who matter.</span>
      </div>
    </footer>
  );
}
