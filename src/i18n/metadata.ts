import type { Locale } from "./routing";
export const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL || "https://abdullah-almahdi-portfolio.netlify.app";
export function localeAlternates(locale: Locale, path = "/") {
  const ar = `/ar${path === "/" ? "" : path}`;
  return {canonical: locale === "ar" ? ar : path, languages: {en: path, ar, "x-default": path}};
}
