import type { Metadata, Viewport } from "next";
import "./globals.css";
const origin = process.env.NEXT_PUBLIC_SITE_URL || "https://emakings.site";
export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: {
    default: "Emakings AI | Make Every Connection More Meaningful",
    template: "%s | Emakings AI",
  },
  description:
    "Emakings is an AI-powered relationship companion helping people stay thoughtful through personalized reminders, meaningful messages, and intelligent recommendations.",
  openGraph: {
    type: "website",
    siteName: "Emakings AI",
    title: "Make Every Connection More Meaningful.",
    description: "A little intelligence. A lot more connection.",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image" },
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg" },
};
export const viewport: Viewport = { themeColor: "#090b18" };
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
