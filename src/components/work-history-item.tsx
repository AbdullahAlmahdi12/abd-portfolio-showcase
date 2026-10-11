import { LocalizedText } from "./localized-text";
import type { WorkHistory } from "@/content/types";

export function WorkHistoryItem({ job }: { job: WorkHistory }) {
  return (
    <article className="work-item">
      <div className="work-top" data-reveal>
        <h3 className="work-title small-heading">
          <span>{job.company}</span><span className="separator work-slash" aria-hidden="true">/</span><span className="text-secondary">{job.role}</span>
        </h3>
        <p className="work-dates"><bdi dir="ltr">{job.startDate}</bdi><span aria-hidden="true"> - </span><LocalizedText text={job.endDate} /></p>
      </div>
      <p className="project-meta mb-6" data-reveal>{job.location}</p>
      <ul className="work-impacts">
        {job.impacts.map(impact => <li key={impact} data-reveal><LocalizedText text={impact} /></li>)}
      </ul>
    </article>
  );
}
