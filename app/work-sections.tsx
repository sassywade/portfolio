import { featuredWork, growthOnboardingScreens, growthChecklist, homepageCompanyCorner, psychicPopups } from "./projects";
import { Reveal } from "./reveal";
import { WorkNav } from "./work-nav";
import { ProjectVideo } from "./project-mockup";
import { WorkScroll } from "./work-scroll";
import { GrowthPrototypeVideo } from "./growth-video-prototype";
import { PsychicCards } from "./psychic-cards";
import { WorkTileSurface } from "./work-tile-prototype";
import artifactStyles from "./artifact-panels.module.css";
import { ArtifactSkins } from "./artifact-skins";
import { HomepageComparison } from "./homepage-comparison";
import { HomepageCards } from "./homepage-cards";

export function WorkSections() {
  return (
    <WorkTileSurface>
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
              <div className={`work-feature__media work-feature__media--${project.layout}${"media" in project ? " work-feature__media--assets" : ""}${"panels" in project ? " " + artifactStyles.composition : ""}`} role={"video" in project || "panels" in project ? "group" : "img"} aria-label={"video" in project ? `${project.title} — project demo` : "media" in project || "panels" in project ? `${project.title} — project assets` : `${project.title} — project assets coming soon`}>
                {"panels" in project ? project.panels.map(panel => panel.kind === "skins" ? <ArtifactSkins key={panel.kind} /> : (
                  <div key={panel.kind} className={artifactStyles.panel} data-artifact-panel={panel.kind}>
                    <img src={panel.src} alt={panel.alt} width={panel.width} height={panel.height} loading="lazy" />
                  </div>
                )) : <>
                {project.slug === "growth" && (
                  <div className="work-feature__onboarding">
                    {growthOnboardingScreens.map((screen) => (
                      <img key={screen.src} src={screen.src} alt={screen.alt} width={980} height={592} loading="lazy" />
                    ))}
                  </div>
                )}
                {project.slug === "growth" ? (
                  <GrowthPrototypeVideo src={project.video.src} poster={project.video.poster} className="work-feature__video" ariaLabel={`${project.title} product walkthrough`} />
                ) : project.slug === "homepage" ? (
                  <HomepageComparison src="/work/homepage-final.mp4" poster={project.video.poster} />
                ) : "video" in project ? (
                  <ProjectVideo src={project.video.src} poster={project.video.poster} className="work-feature__video" ariaLabel={`${project.title} product walkthrough`} />
                ) : "media" in project ? project.media.groups.map((group) => (
                  <div className="work-feature__asset-group" key={group.label}>
                    <div className="work-feature__asset-phones">
                      {group.images.map((image) => <img key={image.src} src={image.src} alt={image.alt} />)}
                    </div>
                    <span>{group.label}</span>
                  </div>
                )) : <div className="work-feature__placeholder" />}
                {project.slug === "growth" ? (
                  <div className="work-feature__checklist">
                    <img src={growthChecklist.src} alt={growthChecklist.alt} width={1012} height={1806} loading="lazy" />
                  </div>
                ) : project.slug === "psychic" ? (
                  <div className="work-feature__popups">
                    <img src={psychicPopups.src} alt={psychicPopups.alt} width={1395} height={960} loading="lazy" />
                  </div>
                ) : "media" in project ? null : project.slug === "homepage" ? (
                  <div className="work-feature__company-corner">
                    <img src={homepageCompanyCorner.src} alt={homepageCompanyCorner.alt} width={1586} height={796} loading="lazy" />
                  </div>
                ) : <div className="work-feature__placeholder" />}
                {project.layout === "split" && (project.slug === "psychic" ? <PsychicCards /> : project.slug === "homepage" ? <HomepageCards /> : <div className="work-feature__placeholder" />)}
                </>}
              </div>
              <p className="work-feature__summary">
                {project.summary}
                {"summaryLink" in project && <> (<a href={project.summaryLink.href} target="_blank" rel="noopener noreferrer">{project.summaryLink.label}</a>).</>}
              </p>
            </Reveal>
          </section>
        ))}
      </div>
    </WorkTileSurface>
  );
}
