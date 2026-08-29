import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CaseStudyNav } from "../../case-study-nav";
import { caseStudies, projects } from "../../projects";
import { Reveal } from "../../reveal";
import { Soundscape } from "../../soundscape";

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
    description: project?.description ?? "A concept case study from Neel Saswade.",
  };
}

function CaseStudyVisual({
  kind,
  theme,
}: {
  kind: "research" | "system" | "prototype" | "gallery";
  theme: string;
}) {
  return (
    <div className={`case-visual case-visual--${kind} case-visual-theme--${theme}`} aria-hidden="true">
      {kind === "research" && (
        <>
          <span className="case-visual__eyebrow">research / field notes</span>
          <div className="case-visual__research-lines">
            <i /><i /><i /><i /><i />
          </div>
          <div className="case-visual__research-orbit" />
          <span className="case-visual__research-note">what matters<br />becomes visible</span>
        </>
      )}
      {kind === "system" && (
        <>
          <span className="case-visual__eyebrow">a small system</span>
          <div className="case-visual__system-grid">
            <i /><i /><i /><i /><i /><i />
          </div>
          <div className="case-visual__system-card">
            <span>01</span>
            <strong>Start<br /><em>here.</em></strong>
            <small>one useful thing at a time</small>
          </div>
        </>
      )}
      {kind === "prototype" && (
        <>
          <span className="case-visual__eyebrow">prototype / 04</span>
          <div className="case-visual__window">
            <div className="case-visual__window-bar"><i /><i /><i /><span>working title</span></div>
            <div className="case-visual__window-body">
              <span className="case-visual__window-kicker">A clearer way forward</span>
              <strong>Make the<br />next step<br /><em>obvious.</em></strong>
              <div className="case-visual__window-button">Continue <b>↗</b></div>
            </div>
          </div>
        </>
      )}
      {kind === "gallery" && (
        <>
          <span className="case-visual__eyebrow">collection / 001—006</span>
          <div className="case-visual__poster">
            <div className="case-visual__poster-circle" />
            <div className="case-visual__poster-copy">a study<br /><em>in context</em></div>
            <div className="case-visual__poster-lines"><i /><i /><i /></div>
          </div>
          <span className="case-visual__gallery-note">keep looking</span>
        </>
      )}
    </div>
  );
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { slug } = await params;
  const projectIndex = projects.findIndex((item) => item.slug === slug);
  const project = projects[projectIndex];
  const narrative = caseStudies[slug];

  if (!project || !narrative) notFound();

  const nextProject = projects[(projectIndex + 1) % projects.length];
  const navItems = [
    ...narrative.sections.map(({ id, label }) => ({ id, label })),
    { id: "reflection", label: "Reflection" },
  ];

  return (
    <main className="case-study-shell page-enter">
      <Soundscape />
      <header className="case-study-topbar">
        <Link className="case-breadcrumb" href="/" data-cuelume-toggle="pulse">
          <span className="case-breadcrumb__mark">NS</span>
          <span>Neel Saswade</span>
          <b>→</b>
          <span>{project.title}</span>
        </Link>
        <Link className="case-topbar-link" href="/#work" data-cuelume-toggle="pulse">All work ↗</Link>
      </header>

      <section className="case-intro" aria-labelledby="case-title">
        <div className="case-intro__body">
          <div className={`case-swatch case-swatch--${project.theme}`} aria-hidden="true"><span /><span /></div>
          <p className="case-kicker">{narrative.collaborator} / {project.number}</p>
          <h1 id="case-title">{project.title}</h1>
          <p className="case-lede">{narrative.lede}</p>
        </div>
        <aside className="case-meta" aria-label="Project details">
          <div><span>Role</span><strong>{narrative.role}</strong></div>
          <div><span>Team</span><strong>{narrative.team.map((member) => <em key={member}>{member}</em>)}</strong></div>
          <div><span>Year</span><strong>{project.year}</strong></div>
        </aside>
      </section>

      <Reveal className="case-media-reveal">
        <figure className={`case-hero-media case-hero-media--${project.theme}`}>
          <div className="case-hero-media__halo" />
          <div className="case-hero-display">
            <span>{project.number} / concept preview</span>
            <strong>{project.title}</strong>
            <em>placeholder art direction</em>
          </div>
          <figcaption>Visual placeholder — replace with project hero imagery.</figcaption>
        </figure>
      </Reveal>

      <div className="case-study-content">
        {narrative.sections.map((section, index) => (
          <Reveal className={`case-section-reveal ${index % 2 ? "case-section-reveal--reverse" : ""}`} key={section.id}>
            <section className="case-section" id={section.id} aria-labelledby={`${section.id}-title`}>
              <div className="case-section__copy">
                <p className="case-kicker">{section.label}</p>
                <h2 id={`${section.id}-title`}>{section.title}</h2>
                <p>{section.body}</p>
              </div>
              <figure className="case-section__visual" aria-label={`${section.label} visual placeholder`}>
                <CaseStudyVisual kind={section.visual} theme={project.theme} />
                <figcaption>Visual placeholder / replace with project work</figcaption>
              </figure>
            </section>
          </Reveal>
        ))}

        <Reveal>
          <section className="case-reflection" id="reflection" aria-labelledby="reflection-title">
            <p className="case-kicker">Key learnings</p>
            <h2 id="reflection-title">The work got better when the answer got quieter.</h2>
            <p>{narrative.reflection}</p>
            <Link href="/#contact" className="case-contact-link" data-cuelume-toggle="pulse">Have a similar problem? Say hello ↗</Link>
          </section>
        </Reveal>
      </div>

      <Reveal className="next-project-reveal">
        <Link className={`next-project next-project--${nextProject.theme}`} href={`/case-studies/${nextProject.slug}`} data-cuelume-toggle="pulse">
          <span className="case-kicker">Next project / {nextProject.number}</span>
          <h2>{nextProject.title}</h2>
          <span className="next-project__link">Open study <b>↗</b></span>
        </Link>
      </Reveal>

      <CaseStudyNav items={navItems} />
    </main>
  );
}
