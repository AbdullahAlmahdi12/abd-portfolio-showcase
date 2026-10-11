import type { MetadataRoute } from "next";
import { projectSlugs } from "@/content";
import { siteOrigin } from "@/i18n/metadata";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/portfolio", ...projectSlugs.map(slug => `/portfolio/${slug}`)].flatMap(path => {
    const en = `${siteOrigin}${path}`;
    const ar = `${siteOrigin}/ar${path === "/" ? "" : path}`;
    const alternates = {languages: {en, ar, "x-default": en}};
    return [{url: en, alternates}, {url: ar, alternates}];
  });
}
