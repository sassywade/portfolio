import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudyNav } from "../../case-study-nav";
import { projects, caseStudies, type CaseStudyArtifact } from "../../projects";
import { Reveal } from "../../reveal";
import { SiteFooter } from "../../site-footer";
import { SiteHeader } from "../../site-header";
import { Soundscape } from "../../soundscape";

/* eslint-disable @next/next/no-img-element */

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);

  return {
    title: project ? `${project.title} — Neel Saswade` : "Case study — Neel Saswade",
    description: project?.description ?? "A case study from Neel Saswade.",
  };
}

function ArtifactFigure({ artifact, className = "" }: { artifact: CaseStudyArtifact; className?: string }) {
  return (
    <figure className={`case-artifact ${className} case-artifact--${artifact.kind ?? "screen"}`}>
      <div className="case-artifact__frame">
        <img src={artifact.src} alt={artifact.alt} loading="lazy" />
      </div>
      <figcaption>{artifact.caption}</figcaption>
    </figure>
  );
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const projectIndex = projects.findIndex((item) => item.slug === slug);
  const project = projects[projectIndex];
  const narrative = caseStudies[slug];

  if (!project || !narrative) notFound();

  const nextProject = projects[(projectIndex + 1) % projects.length];

  return (
    <main className={`case-study-shell case-study-shell--${project.theme} page-enter`}>
      <Soundscape />
      <SiteHeader current="work" />
      <CaseStudyNav items={projects} activeSlug={project.slug} />

      <div className="case-study-frame">
        <section className="case-intro" id="top" aria-labelledby="case-title">
          <div className="case-intro__body">
            <div className={`case-swatch case-swatch--${project.theme}`} aria-hidden="true"><span /><span /></div>
            <p className="case-kicker">{narrative.collaborator} / {project.number}</p>
            <h1 id="case-title">{project.title}</h1>
            <p className="case-lede">{narrative.lede}</p>
            <a className="case-source-link" href={narrative.sourcePdf} target="_blank" rel="noreferrer">
              {narrative.sourceLabel} <span aria-hidden="true">↗</span>
            </a>
          </div>
          <aside className="case-meta" aria-label="Project details">
            <div><span>Role</span><strong>{narrative.role}</strong></div>
            <div><span>Team</span><strong>{narrative.team.map((member) => <em key={member}>{member}</em>)}</strong></div>
            <div><span>Year</span><strong>{project.year}</strong></div>
          </aside>
        </section>

        <Reveal className="case-media-reveal">
          <figure className={`case-hero-media case-hero-media--${project.theme} case-hero-media--${project.cover.kind ?? "screen"}`}>
            <div className="case-hero-media__halo" aria-hidden="true" />
            <div className="case-hero-frame">
              <img src={project.cover.src} alt={project.cover.alt} />
            </div>
            <div className="case-hero-label">
              <span>{project.number} / case study</span>
              <strong>{project.cover.caption}</strong>
            </div>
            <figcaption>{project.cover.caption}</figcaption>
          </figure>
        </Reveal>

        <div className={`case-hero-strip case-hero-strip--${project.theme}`} aria-label="Case study overview">
          <div><span>Scope</span><strong>{project.category}</strong></div>
          <div><span>Source</span><strong>{narrative.artifacts.length} brief pages</strong></div>
          <div><span>Read</span><strong>Process + outcome</strong></div>
        </div>

        <div className="case-study-content">
          {narrative.sections.map((section, index) => {
            const artifact = section.artifact ?? narrative.artifacts[section.page ?? index % narrative.artifacts.length];

            return (
              <Reveal className={`case-section-reveal ${index % 2 ? "case-section-reveal--reverse" : ""}`} key={section.id}>
                <section className={`case-section ${index === 0 ? "case-section--lead" : ""}`} id={section.id} aria-labelledby={`${section.id}-title`}>
                  <div className="case-section__copy">
                    <p className="case-kicker">{section.label}</p>
                    <h2 id={`${section.id}-title`}>{section.title}</h2>
                    <p>{section.body}</p>
                  </div>
                  <ArtifactFigure artifact={artifact} />
                </section>
              </Reveal>
            );
          })}

          <Reveal>
            <section className="case-brief-gallery" id="brief" aria-labelledby="brief-title">
              <div className="case-brief-gallery__heading">
                <div>
                  <p className="case-kicker">The full brief</p>
                  <h2 id="brief-title">The work, page by page.</h2>
                </div>
                <a className="case-source-link" href={narrative.sourcePdf} target="_blank" rel="noreferrer">
                  Open PDF <span aria-hidden="true">↗</span>
                </a>
              </div>
              <div className="case-brief-grid">
                {narrative.artifacts.map((artifact) => <ArtifactFigure artifact={artifact} key={artifact.src} />)}
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="case-reflection" id="reflection" aria-labelledby="reflection-title">
              <p className="case-kicker">Key learning</p>
              <h2 id="reflection-title">{narrative.reflection}</h2>
              <a href="mailto:hello@yourname.com" className="case-contact-link">Want to talk about it? Say hello ↗</a>
            </section>
          </Reveal>
        </div>

        <Reveal className="next-project-reveal">
          <a className={`next-project next-project--${nextProject.theme}`} href={`/case-studies/${nextProject.slug}`}>
            <span className="case-kicker">Next study / {nextProject.number}</span>
            <h2>{nextProject.title}</h2>
            <span className="next-project__link">Open study <b>↗</b></span>
          </a>
        </Reveal>
      </div>
      <SiteFooter />
    </main>
  );
}
