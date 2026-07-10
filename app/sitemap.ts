import type { MetadataRoute } from "next";
import { getSettings } from "./lib/queries";
import { getSeoData } from "./lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const seo = getSeoData(await getSettings());
  const now = new Date();
  const entries: { path: string; changeFrequency: "weekly" | "yearly"; priority: number }[] = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/consent", changeFrequency: "yearly", priority: 0.3 },
  ];
  return entries.map((e) => ({
    url: `${seo.siteUrl}${e.path}`,
    lastModified: now,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));
}
