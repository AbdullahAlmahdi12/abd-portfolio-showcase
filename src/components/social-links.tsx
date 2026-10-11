import type { SocialLink } from "@/content/types";
import { useTranslations } from "next-intl";

export function SocialLinks({links}: {links: SocialLink[]}) {
  const t = useTranslations("Navigation");
  return (
    <ul className="social-links flex flex-wrap items-center gap-2" aria-label={t("social")}>
      {links.map(link => (
        <li key={link.label} className="flex items-center gap-2">
          <a href={link.href} target="_blank" rel="noopener noreferrer"><bdi dir="ltr">{link.label}</bdi></a>
        </li>
      ))}
    </ul>
  );
}
