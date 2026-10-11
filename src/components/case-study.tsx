import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { LocalizedText } from "./localized-text";
import type { Project } from "@/content/types";

export function CaseStudy({ project }: { project: Project }) {
  const t = useTranslations("CaseStudy");
  return (
    <main id="main-content" className="case-study">
      <Link className="back-link" href="/portfolio">{t("back")}</Link>
      <div className="case-introduction">
        <p className="project-meta" data-reveal>{project.category}</p>
        <h1 className="case-title" data-reveal><LocalizedText text={project.title} /></h1>
        <p className="text-secondary" data-reveal><LocalizedText text={project.summary} /></p>
      </div>
      <div className="case-cover" data-reveal>
        <Image src={project.cover.src} alt={project.cover.alt} fill sizes="(max-width: 927px) calc(100vw - 48px), 880px" style={{ objectFit: project.cover.contain ? "contain" : undefined }} preload />
      </div>
      <div className="case-body">
        <div className="case-description prose case-narrow">{project.description.map(paragraph => <p key={paragraph} data-reveal><LocalizedText text={paragraph} /></p>)}</div>
        <div className="project-goal case-narrow" data-reveal>
          <h2 className="small-heading text-secondary">{t("goal")}</h2>
          <p className="small-heading"><LocalizedText text={project.goal} /></p>
        </div>
        <dl className="case-metadata case-narrow">
          {[[t("type"), project.category], [t("stack"), project.stack]].map(([label, value]) => (
            <div key={label} data-reveal><dt className="small-heading">{label}</dt><dd className="text-secondary"><LocalizedText text={value} /></dd></div>
          ))}
        </dl>
        <div className="case-links case-narrow" data-reveal>
          <a className="live-link" href={project.liveLink} target="_blank" rel="noopener noreferrer">{t("live")}</a>
          {project.repositoryLink && <a className="live-link" href={project.repositoryLink} target="_blank" rel="noopener noreferrer">{t("code")}</a>}
          {project.originalLink && <a className="live-link" href={project.originalLink} target="_blank" rel="noopener noreferrer">{t("original")}</a>}
        </div>
        {!project.repositoryLink && <p className="text-secondary case-narrow" data-reveal>{t("privateCode")}</p>}
      </div>
      <Link className="back-link lower-back" href="/portfolio">{t("back")}</Link>
    </main>
  );
}
