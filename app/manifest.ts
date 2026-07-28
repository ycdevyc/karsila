import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Karsila",
    short_name: "Karsila",
    description:
      "Compare local driver offers and choose your private Antalya airport transfer.",
    start_url: "/en",
    display: "standalone",
    background_color: "#F5F2EA",
    theme_color: "#0B2944",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
