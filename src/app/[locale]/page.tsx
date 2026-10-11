import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { isLocale } from "@/i18n/routing";
import { getSiteContent } from "@/content";
import { HomeContent } from "@/components/home-content";
export default async function HomePage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  return <HomeContent content={getSiteContent(locale)} />;
}
