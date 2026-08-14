import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/landing-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: Array<{ path: string; priority: number }> = [
    { path: "", priority: 1 },
    { path: "/trashtalks", priority: 0.5 },
    { path: "/predictions", priority: 0.5 },
    { path: "/fight-tree", priority: 0.5 },
  ];

  return routes.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority,
  }));
}
