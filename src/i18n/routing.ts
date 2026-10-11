import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"], defaultLocale: "en", localePrefix: "as-needed", localeDetection: false,
});
export type Locale = (typeof routing.locales)[number];
export function isLocale(value: string): value is Locale { return value === "en" || value === "ar"; }
