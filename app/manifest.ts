import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Emakings AI",
    short_name: "Emakings",
    description: "Intelligence for more meaningful connections.",
    start_url: "/",
    display: "standalone",
    background_color: "#090b18",
    theme_color: "#090b18",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
