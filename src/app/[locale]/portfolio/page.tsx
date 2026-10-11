import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getSiteContent } from "@/content";
import { isLocale } from "@/i18n/routing";
import { localeAlternates } from "@/i18n/metadata";
import { ProjectCard } from "@/components/project-card";

type Props = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  const t = await getTranslations({locale, namespace: "Portfolio"});
  return {title: `${t("title")} — ${getSiteContent(locale).profile.name}`, description: t("description"), alternates: localeAlternates(locale, "/portfolio")};
}

export default async function PortfolioPage({params}: Props) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("Portfolio");
  const {projects} = getSiteContent(locale);
  return <main id="main-content" className="portfolio-page">
    <header className="portfolio-introduction" data-reveal>
      <p className="project-meta">{t("eyebrow")}</p>
      <h1 className="case-title">{t("title")}</h1>
      <p className="text-secondary">{t("description")}</p>
    </header>
    <section className="portfolio-grid" aria-label={t("projects")}>
      {projects.map(project => <ProjectCard key={project.slug} project={project} />)}
    </section>
  </main>;
}
