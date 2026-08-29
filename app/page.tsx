import { Soundscape } from "./soundscape";
import { projects } from "./projects";
import { Reveal } from "./reveal";
import { SecretFooter } from "./secret-footer";

function ProjectMockup({ theme }: { theme: (typeof projects)[number]["theme"] }) {
  return (
    <div className={`project-mockup project-mockup--${theme}`} aria-hidden="true">
      {theme === "signal" && (
        <>
          <div className="signal-topline">
            <span>signal / 01</span>
            <span>06:24</span>
          </div>
          <div className="signal-orbit" />
          <div className="signal-copy">
            <span>make room</span>
            <strong>for the<br />signal.</strong>
          </div>
          <div className="signal-footer">
            <span>scroll to explore</span>
            <span>↘</span>
          </div>
        </>
      )}

      {theme === "field" && (
        <>
          <div className="field-stamp">A FIELD<br />GUIDE</div>
          <div className="field-arc" />
          <div className="field-caption">Objects<br />with a story</div>
          <div className="field-swatches">
            <span />
            <span />
            <span />
          </div>
        </>
      )}

      {theme === "archive" && (
        <>
          <div className="archive-label">COLLECT / 001</div>
          <div className="archive-panel">
            <span className="archive-ring" />
            <span className="archive-line archive-line--one" />
            <span className="archive-line archive-line--two" />
            <span className="archive-spark" />
          </div>
          <div className="archive-title">The<br /><em>archive</em></div>
          <div className="archive-index">01 — 08</div>
        </>
      )}

      {theme === "ground" && (
        <>
          <div className="ground-browser">
            <div className="ground-browser__bar">
              <i />
              <i />
              <i />
            </div>
            <div className="ground-browser__content">
              <span className="ground-kicker">A place to begin</span>
              <strong>Meet in the<br />middle.</strong>
              <span className="ground-button">Explore ↗</span>
            </div>
          </div>
          <div className="ground-orb" />
        </>
      )}

      {theme === "systems" && (
        <>
          <div className="systems-label">SOFT<br />SYSTEMS</div>
          <div className="systems-grid">
            <span>01</span><span>02</span><span>03</span>
          </div>
          <div className="systems-shape systems-shape--one" />
          <div className="systems-shape systems-shape--two" />
          <div className="systems-note">a toolkit for<br />good work</div>
        </>
      )}

      {theme === "afterimage" && (
        <>
          <div className="afterimage-meta">STUDY 06 / 12</div>
          <div className="afterimage-frame">
            <div className="afterimage-sun" />
            <div className="afterimage-ribbon" />
            <div className="afterimage-ribbon afterimage-ribbon--offset" />
          </div>
          <div className="afterimage-caption">things<br /><em>remembered</em></div>
        </>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <main className="site-shell page-enter">
      <Soundscape />
      <section className="pranathi-intro" id="top" aria-labelledby="hero-title">
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

      <section className="pranathi-work" id="work" aria-labelledby="work-title">
        <h2 className="sr-only" id="work-title">Selected work</h2>
        <div className="project-grid pranathi-project-grid">
          {projects.map((project) => (
            <Reveal className="project-reveal" key={project.number}>
              <a className="project-card" href={`/case-studies/${project.slug}`} data-cuelume-toggle="pulse">
                <ProjectMockup theme={project.theme} />
                <div className="project-info">
                  <div className="project-title-row">
                    <h3>{project.title}</h3>
                    <span className="project-number">{project.number}</span>
                  </div>
                  <p>{project.description}</p>
                  <div className="project-meta">
                    <span>{project.category}</span>
                    <span>{project.year} <b>↗</b></span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>
      <footer className="site-footer pranathi-footer" id="contact">
        <SecretFooter />
        <div className="footer-bottomline">
          <span>San Francisco, CA · © 2025</span>
          <div className="footer-links">
            <a href="mailto:hello@yourname.com" data-cuelume-toggle="pulse">Email ↗</a>
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" data-cuelume-toggle="pulse">LinkedIn ↗</a>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" data-cuelume-toggle="pulse">Instagram ↗</a>
          </div>
          <span>Back to top <a href="#top" data-cuelume-toggle="pulse">↑</a></span>
        </div>
      </footer>
    </main>
  );
}
