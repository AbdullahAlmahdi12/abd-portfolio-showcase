import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { isLocale } from "@/i18n/routing";
import { MissingPage } from "@/components/missing-page";
export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  const t = await getTranslations({locale, namespace: "NotFound"});
  return {title: t("metadata"), robots: {index: false, follow: false}, alternates: {canonical: null, languages: {}}};
}
export default async function MissingReferencePage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  return <MissingPage />;
}
