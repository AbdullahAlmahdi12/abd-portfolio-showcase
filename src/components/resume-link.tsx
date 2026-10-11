import { useTranslations } from "next-intl";

export function ResumeLink() {
  const t = useTranslations("Resume");
  return (
    <a className="resume-link" href="/downloads/Abdullah-Al-Mahdi-CV.pdf" download="Abdullah-Al-Mahdi-CV.pdf" aria-label={t("description")} title={t("description")}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3v12m-5-5 5 5 5-5M5 17v4h14v-4" />
      </svg>
      <span>{t("download")}</span>
      <span className="resume-format" dir="ltr">PDF</span>
    </a>
  );
}
