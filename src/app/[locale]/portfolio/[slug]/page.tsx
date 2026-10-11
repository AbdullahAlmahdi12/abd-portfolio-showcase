import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getProject, projectSlugs } from "@/content";
import { CaseStudy } from "@/components/case-study";
import { isLocale } from "@/i18n/routing";
import { localeAlternates } from "@/i18n/metadata";
type Props = {params: Promise<{locale: string; slug: string}>};
export function generateStaticParams() {return projectSlugs.map(slug => ({slug}));}
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale, slug} = await params;
  if (!isLocale(locale)) notFound();
  const project = getProject(locale, slug);
  if (!project) notFound();
  const t = await getTranslations({locale, namespace: "Metadata"});
  return {title: `${project.title} — ${t("portfolio")}`, description: project.summary, alternates: localeAlternates(locale, `/portfolio/${slug}`)};
}
export default async function ProjectPage({params}: Props) {
  const {locale, slug} = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const project = getProject(locale, slug);
  if (!project) notFound();
  return <CaseStudy project={project} />;
}
