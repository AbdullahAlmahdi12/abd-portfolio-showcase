"use client";
import { useLocale, useTranslations } from "next-intl";
import { useSyncExternalStore } from "react";
import { getPathname, usePathname } from "@/i18n/navigation";
function subscribe(listener: () => void) {
  window.addEventListener("hashchange", listener);
  window.addEventListener("popstate", listener);
  return () => {window.removeEventListener("hashchange", listener); window.removeEventListener("popstate", listener);};
}
const locationSuffix = () => window.location.search + window.location.hash;

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const suffix = useSyncExternalStore(subscribe, locationSuffix, () => "");
  const target = locale === "ar" ? "en" : "ar";
  const href = getPathname({locale: target, href: pathname});
  return <a className="language-switch" href={href + suffix} lang={target} dir={target === "ar" ? "rtl" : "ltr"} aria-label={t("switchLanguage")} onClick={event => {
    event.currentTarget.href = href + window.location.search + window.location.hash;
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    window.dispatchEvent(new Event("portfolio:language-change"));
  }}><span className="language-switch-label">{target === "ar" ? "العربية" : "English"}</span></a>;
}
