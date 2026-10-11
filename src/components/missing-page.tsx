import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function MissingPage() {
  const t = useTranslations("NotFound");
  return (
    <main id="main-content" className="missing-page">
      <div className="missing-content">
        <div>
          <h1 className="section-heading" data-reveal>{t("title")}</h1>
          <p className="text-secondary" data-reveal>{t("description")}</p>
        </div>
        <Link href="/" className="missing-back" data-reveal>{t("back")}</Link>
      </div>
    </main>
  );
}
