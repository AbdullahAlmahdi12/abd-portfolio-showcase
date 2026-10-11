import type { Profile } from "@/content/types";
import { useTranslations } from "next-intl";
import { LocalizedText } from "./localized-text";
import { EmailContact } from "./email-contact";
import { SocialLinks } from "./social-links";
import { ResumeLink } from "./resume-link";
import { ParticleHeading } from "./particle-heading";

export function Footer({profile}: {profile: Profile}) {
  const t = useTranslations("Footer");
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-lead">
          <div className="footer-invitation">
            <h2 className="section-heading">{t("invitation")}</h2>
            <p className="text-secondary">{t("description")}</p>
          </div>
          <div className="footer-contact-group">
            <div className="footer-top">
              <EmailContact email={profile.email} href={profile.emailLink} />
              <ResumeLink />
            </div>
            <div className="footer-socials">
              <SocialLinks links={profile.socials} />
            </div>
          </div>
        </div>
      </div>
      <div className="footer-wordmark" aria-hidden="true">
        <ParticleHeading as="p" className="footer-wordmark-text" text={profile.name} />
      </div>
      <div className="footer-inner">
        <div className="footer-bottom">
          <p className="copyright"><LocalizedText text={profile.copyright} /></p>
        </div>
      </div>
    </footer>
  );
}
