import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { caseStudies, projects, type CaseStudyArtifact } from "../../projects";
import { Reveal } from "../../reveal";

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

function ArtifactFigure({ artifact }: { artifact: CaseStudyArtifact }) {
  return (
    <figure className={`case-story-media case-story-media--${artifact.kind ?? "screen"}`}>
      <div className="case-story-media__frame">
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
    <main className={`case-study-shell case-study-shell--${project.theme} case-story page-enter`}>

      <section className="case-story-hero" id="top" aria-labelledby="case-title">
        <div className="case-story-hero__copy">
          <p>{project.category}</p>
          <h1 id="case-title">{project.title}</h1>
          <span>{narrative.lede}</span>
        </div>
        <div className={`case-story-hero__art case-story-hero__art--${project.cover.kind ?? "screen"}`}>
          <img src={project.cover.src} alt={project.cover.alt} />
        </div>
      </section>

      <div className="case-story-layout">
        <nav className="case-story-rail" aria-label="Case study chapters">
          <Link className="case-story-rail__back" href="/">← Back</Link>
          <a href="#introduction">Introduction</a>
          {narrative.sections.map((section) => (
            <a href={`#${section.id}`} key={section.id}>{section.label}</a>
          ))}
          <a href="#reflection">Reflection</a>
        </nav>

        <article className="case-story-content">
          <Reveal>
            <section className="case-story-introduction" id="introduction">
              <h2>{narrative.lede}</h2>
              <p>{project.description}</p>
            </section>
          </Reveal>

          <Reveal>
            <section className="case-story-team" aria-label="Project details">
              <p className="case-story-label">Team</p>
              <div>
                <p>{narrative.role}</p>
                {narrative.team.map((member) => <p key={member}>{member}</p>)}
                <p>{narrative.collaborator} · {project.year}</p>
              </div>
            </section>
          </Reveal>

          {narrative.sections.map((section, index) => {
            const artifact = section.artifact ?? narrative.artifacts[section.page ?? index % narrative.artifacts.length];

            return (
              <section className="case-story-chapter" id={section.id} aria-labelledby={`${section.id}-title`} key={section.id}>
                <Reveal>
                  <div className="case-story-chapter__copy">
                    <p className="case-story-label">{section.label}</p>
                    <h2 id={`${section.id}-title`}>{section.title}</h2>
                    <p>{section.body}</p>
                  </div>
                </Reveal>
                <Reveal>
                  <ArtifactFigure artifact={artifact} />
                </Reveal>
              </section>
            );
          })}

          <Reveal>
            <section className="case-story-reflection" id="reflection" aria-labelledby="reflection-title">
              <p className="case-story-label">Reflection</p>
              <h2 id="reflection-title">{narrative.reflection}</h2>
            </section>
          </Reveal>

          <Link className="case-story-next" href={`/case-studies/${nextProject.slug}`}>
            <span>Next case study</span>
            <strong>{nextProject.title}</strong>
            <i aria-hidden="true">→</i>
          </Link>
        </article>
      </div>
    </main>
  );
}
