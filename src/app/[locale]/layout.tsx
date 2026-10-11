import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MotionController } from "@/components/motion-controller";
import { ProjectViewCursor } from "@/components/project-view-cursor";
import { Intro } from "@/components/intro";
import { themeInitScript } from "@/lib/theme";
import { getSiteContent } from "@/content";
import { isLocale, routing } from "@/i18n/routing";
import { localeAlternates, siteOrigin } from "@/i18n/metadata";
import { geist, arabic } from "../fonts";
import "../globals.css";

export function generateStaticParams() {return routing.locales.map(locale => ({locale}));}
export async function generateMetadata({params}: {params: Promise<{locale: string}>}): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  const {profile} = getSiteContent(locale);
  return {title: profile.name, description: profile.tagline, metadataBase: new URL(siteOrigin), alternates: localeAlternates(locale)};
}
export default async function LocaleLayout({children, params}: {children: React.ReactNode; params: Promise<{locale: string}>}) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const {profile} = getSiteContent(locale);
  const messages = await getMessages();
  const t = await getTranslations("Navigation");
  const clientMessages = Object.fromEntries(["Navigation", "Email", "Theme", "Portrait", "Intro", "Resume"].map(key => [key, messages[key]]));
  return <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={`${geist.variable} ${arabic.variable}`} suppressHydrationWarning>
    <head><script dangerouslySetInnerHTML={{__html: themeInitScript}} /></head>
    <body><NextIntlClientProvider messages={clientMessages}>
      <a className="skip-link" href="#main-content">{t("skipContent")}</a>
      <Intro name={profile.name} locale={locale}>
        <Header name={profile.name} email={profile.email} emailLink={profile.emailLink} whatsappHref={profile.socials.find(link => link.label === "WhatsApp")?.href} />
        {children}<Footer profile={profile} /><MotionController /><ProjectViewCursor />
      </Intro>
    </NextIntlClientProvider></body>
  </html>;
}
