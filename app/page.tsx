import { Soundscape } from "./soundscape";
import { ProjectGrid } from "./project-card";
import { projects } from "./projects";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export default function Home() {
  return (
    <main className="site-shell page-enter" id="top">
      <Soundscape />
      <SiteHeader current="home" />

      <section className="pranathi-intro pranathi-intro--home" aria-labelledby="hero-title">
        <p className="pranathi-name" id="hero-title">Neel Saswade</p>
        <div className="pranathi-bio">
          <p>
            I&apos;m a designer based in San Francisco. Currently, I&apos;m exploring
            thoughtful product experiences with teams working on <span className="placeholder-mark">[something good]</span>.
            Previously, I designed at <span className="placeholder-mark">[company]</span> and <span className="placeholder-mark">[company]</span>.
          </p>
          <p>In my free time I ride bikes, photograph SF, and go backpacking.</p>
        </div>
        <nav className="pranathi-links" aria-label="Social links">
          <a href="mailto:hello@yourname.com" data-cuelume-toggle="pulse">Email ↗</a>
          <a href="https://x.com" target="_blank" rel="noreferrer" data-cuelume-toggle="pulse">X ↗</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" data-cuelume-toggle="pulse">GitHub ↗</a>
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" data-cuelume-toggle="pulse">LinkedIn ↗</a>
        </nav>
      </section>

      <section className="home-work-preview" aria-labelledby="home-work-title">
        <div className="page-section-heading">
          <h2 id="home-work-title">Selected work</h2>
          <a href="/work" data-cuelume-toggle="page">View all work ↗</a>
        </div>
        <ProjectGrid items={projects.slice(0, 3)} />
      </section>

      <SiteFooter />
    </main>
  );
}
