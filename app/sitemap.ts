import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/privacy", "/terms", "/contact"].map((path) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://emakings.site"}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: path ? 0.4 : 1,
  }));
}
