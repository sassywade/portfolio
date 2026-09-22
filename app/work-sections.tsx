import { featuredWork } from "./projects";
import { Reveal } from "./reveal";
import { WorkNav } from "./work-nav";

export function WorkSections() {
  return (
    <div className="work-editorial">
      <WorkNav items={featuredWork.map(({ slug, navTitle }) => ({ slug, title: navTitle }))} />
      <div className="work-editorial__content">
        <h2 className="work-editorial__label" id="work-title">Selected work</h2>
        {featuredWork.map((project) => (
          <section className="work-feature" id={`work-${project.slug}`} aria-labelledby={`work-${project.slug}-title`} key={project.slug}>
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
              <div className={`work-feature__media work-feature__media--${project.layout}`} role="img" aria-label={`${project.title} — project assets coming soon`}>
                <div className="work-feature__placeholder" />
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
