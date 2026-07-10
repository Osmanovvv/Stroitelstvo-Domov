import type { MetadataRoute } from "next";
import { getSettings } from "./lib/queries";
import { getSeoData } from "./lib/seo";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const seo = getSeoData(await getSettings());
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/admin/"] }],
    sitemap: `${seo.siteUrl}/sitemap.xml`,
    host: seo.siteUrl,
  };
}
