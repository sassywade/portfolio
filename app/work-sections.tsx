import { featuredWork } from "./projects";
import { Reveal } from "./reveal";
import { WorkNav } from "./work-nav";
import { ProjectVideo } from "./project-mockup";
import { WorkScroll } from "./work-scroll";

export function WorkSections() {
  return (
    <div className="work-editorial">
      <WorkScroll />
      <WorkNav items={featuredWork.map(({ slug, navTitle }) => ({ slug, title: navTitle }))} />
      <div className="work-editorial__content">
        <h2 className="work-editorial__label" id="work-title"><span className="sr-only">Work</span></h2>
        {featuredWork.map((project) => (
          <section tabIndex={-1} className="work-feature" id={`work-${project.slug}`} aria-labelledby={`work-${project.slug}-title`} key={project.slug}>
            <Reveal>
              <header className="work-feature__header">
                <h3 id={`work-${project.slug}-title`}>{project.title}</h3>
                <div className="work-feature__meta">
                  <span>{project.year}</span>
                  <span className={`hero-company hero-company--${project.company.toLowerCase()}`}>
                    <span className="hero-company__mark" aria-hidden="true" />
                    <span>{project.company}</span>
                  </span>
                </div>
              </header>
              <div className={`work-feature__media work-feature__media--${project.layout}`} role={"video" in project ? "group" : "img"} aria-label={"video" in project ? `${project.title} — project demo` : `${project.title} — project assets coming soon`}>
                {"video" in project ? (
                  <ProjectVideo src={project.video.src} poster={project.video.poster} className="work-feature__video" ariaLabel="Proactive Intelligence product walkthrough" />
                ) : <div className="work-feature__placeholder" />}
                <div className="work-feature__placeholder" />
                {project.layout !== "pair" && <div className="work-feature__placeholder" />}
              </div>
              <p className="work-feature__summary">{project.summary}</p>
            </Reveal>
          </section>
        ))}
      </div>
    </div>
  );
}
