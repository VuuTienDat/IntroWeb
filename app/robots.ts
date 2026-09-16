import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin", "/auth/", "/api/", "/ung-dung"] },
      { userAgent: "OAI-SearchBot", allow: "/", disallow: ["/admin", "/auth/", "/api/", "/ung-dung"] },
      { userAgent: "GPTBot", disallow: "/" },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
