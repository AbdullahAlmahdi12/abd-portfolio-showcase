import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { LocalizedText } from "./localized-text";
import type { Project } from "@/content/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link className="project-card" href={`/portfolio/${project.slug}`} data-reveal data-view-cursor aria-label={project.title}>
      <div className="project-cover">
        <Image src={project.cover.src} alt={project.cover.alt} fill sizes="(max-width: 809px) calc(100vw - 48px), (max-width: 1199px) calc((100vw - 96px) / 2), 416px" />
        <span className="project-arrow" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </span>
      </div>
      <div className="project-info">
        <h3 className="small-heading"><LocalizedText text={project.title} /></h3>
        <p className="project-summary"><LocalizedText text={project.summary} /></p>
        <p className="project-meta">{project.category}</p>
      </div>
    </Link>
  );
}
