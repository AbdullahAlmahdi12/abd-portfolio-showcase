import data from "./site.json";
import type { SiteContent, ArabicContent, SiteImage } from "./types";
import type { Locale } from "@/i18n/routing";
import arabic from "./locales/ar.json";

const english: SiteContent = data;
const translations: ArabicContent = arabic;
export const projectSlugs = english.projects.map(project => project.slug);

function localizeImage(image: SiteImage): SiteImage {
  const alt = translations.imageAlts[image.alt];
  if (!alt) throw new Error(`Missing Arabic image translation: ${image.alt}`);
  return { ...image, alt };
}

export function getSiteContent(locale: Locale): SiteContent {
  if (locale === "en") return english;
  return {
    ...english,
    profile: { ...english.profile, ...translations.profile, photo: { ...english.profile.photo, alt: translations.profile.photoAlt } },
    projects: english.projects.map(project => {
      const translated = translations.projects[project.slug];
      if (!translated) throw new Error(`Missing Arabic project: ${project.slug}`);
      return { ...project, ...translated, cover: localizeImage(project.cover), gallery: project.gallery.map(localizeImage) };
    }),
    tools: english.tools.map(tool => ({ ...tool, name: translations.tools[tool.name] ?? tool.name })),
    workHistory: english.workHistory.map((job, index) => {
      if (!translations.workHistory[index]) throw new Error("Missing Arabic work history");
      return { ...job, ...translations.workHistory[index] };
    }),
    education: english.education.map((item, index) => {
      if (!translations.education[index]) throw new Error("Missing Arabic education");
      return { ...item, ...translations.education[index] };
    }),
  };
}
export function getProject(locale: Locale, slug: string) {
  return getSiteContent(locale).projects.find(project => project.slug === slug);
}
