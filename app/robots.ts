import type { MetadataRoute } from "next";

const siteUrl = "https://www.karsila.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/api/",
        "/driver/",
        "/request/status/",
        "/*/request/status/",
        "/search",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
