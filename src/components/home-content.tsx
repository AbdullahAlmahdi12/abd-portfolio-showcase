import { PortraitViewer } from "./portrait-viewer";
import { Link } from "@/i18n/navigation";
import type { SiteContent } from "@/content/types";
import { useTranslations } from "next-intl";
import { LocalizedText } from "./localized-text";
import { SocialLinks } from "./social-links";
import { ProjectCard } from "./project-card";
import { WorkHistoryItem } from "./work-history-item";
import { ParticleHeading } from "./particle-heading";

const categoryKeys = {"Languages": "languages", "Frameworks & 3D": "frameworks", "Tools & Workflow": "workflow"} as const;

export function HomeContent({content}: {content: SiteContent}) {
  const {profile, projects, tools, workHistory, education} = content;
  const toolCategories = [...new Set(tools.map(tool => tool.category))];
  const t = useTranslations("Sections");
  const process = useTranslations("WorkProcess");
  return (
    <main id="main-content" className="home-main">
      <section className="hero content-width" aria-labelledby="profile-name">
        <div className="hero-profile">
          <div className="hero-identity">
            <PortraitViewer src={profile.photo.src} darkSrc={profile.photo.darkSrc} alt={profile.photo.alt} />
            <ParticleHeading id="profile-name" text={profile.name} />
          </div>
          <div className="hero-description">
            <p className="tagline"><LocalizedText text={profile.tagline} /></p>
            <p className="hero-now text-secondary"><LocalizedText text={profile.now} /></p>
          </div>
        </div>
        <div className="hero-bottom">
          <p className="hero-location">{profile.location}<span className="separator" aria-hidden="true">/</span><LocalizedText text={profile.languages} /></p>
          <SocialLinks links={profile.socials} />
        </div>
      </section>

      <section className="home-section about-section content-width" aria-labelledby="about-heading" data-reveal>
        <h2 id="about-heading" className="section-heading">{t("about")}</h2>
        <div className="prose">
          {profile.about.map(paragraph => <p key={paragraph}><LocalizedText text={paragraph} /></p>)}
        </div>
      </section>

      <section className="home-section process-section content-width" aria-labelledby="process-heading">
        <h2 id="process-heading" className="section-heading" data-reveal>{process("title")}</h2>
        <ol className="process-grid" role="list">
          {(["understand", "build", "review", "deliver"] as const).map((step, index) => (
            <li className="process-step" key={step} data-reveal>
              <span className="process-number" dir="ltr" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="small-heading">{process(`${step}.title`)}</h3>
              <p className="text-secondary">{process(`${step}.description`)}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="home-section tools-section content-width" aria-labelledby="tools-heading">
        <h2 id="tools-heading" className="section-heading" data-reveal>{t("skills")}</h2>
        <div className="tools-grid">
          {toolCategories.map(category => (
            <div className="tool-group" key={category}>
              <h3 className="small-heading" data-reveal>{t(categoryKeys[category as keyof typeof categoryKeys])}</h3>
              <ul>{tools.filter(tool => tool.category === category).map(tool => <li key={tool.name} data-reveal><LocalizedText text={tool.name} /></li>)}</ul>
            </div>
          ))}
        </div>
      </section>

      <section id="portfolio" className="home-section portfolio-section content-width" aria-labelledby="portfolio-heading">
        <h2 id="portfolio-heading" className="section-heading" data-reveal>{t("portfolio")}</h2>
        <div className="portfolio-grid">{projects.map(project => <ProjectCard key={project.slug} project={project} />)}</div>
        <Link href="/portfolio" className="portfolio-all-link" data-reveal>{t("viewAll")}</Link>
      </section>

      <section className="home-section content-width" aria-labelledby="history-heading">
        <h2 id="history-heading" className="section-heading" data-reveal>{t("history")}</h2>
        <div className="history-list">{workHistory.map(job => <WorkHistoryItem key={job.company} job={job} />)}</div>
      </section>

      <section className="home-section history-section content-width" aria-labelledby="education-heading">
        <h2 id="education-heading" className="section-heading" data-reveal>{t("education")}</h2>
        <div className="history-list">
          {education.map(item => (
            <article key={item.institution} className="work-item" data-reveal>
              <h3 className="small-heading">{item.institution}</h3>
              <div className="prose mt-6">
                <p><LocalizedText text={`${item.degree} — ${item.status}`} /></p>
                <p><LocalizedText text={t("graduation", {year: item.expectedGraduation})} /></p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
