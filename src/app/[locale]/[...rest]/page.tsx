import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { isLocale } from "@/i18n/routing";
export default async function UnknownPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;
  if (isLocale(locale)) setRequestLocale(locale);
  notFound();
}
