import { getRequestConfig } from "next-intl/server";
import { isLocale } from "./routing";
import en from "@/messages/en.json";
import ar from "@/messages/ar.json";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = requested && isLocale(requested) ? requested : "en";
  return { locale, messages: locale === "ar" ? ar : en };
});
