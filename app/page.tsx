import { Soundscape } from "./soundscape";

const projects = [
  {
    number: "01",
    title: "Signal / noise",
    description: "A calmer way to make sense of a busy product.",
    category: "Product design",
    year: "2025",
    theme: "signal",
  },
  {
    number: "02",
    title: "Field notes",
    description: "A visual identity for people who make things slowly.",
    category: "Brand + direction",
    year: "2024",
    theme: "field",
  },
  {
    number: "03",
    title: "The archive",
    description: "Turning a collection of stories into a place to wander.",
    category: "Digital experience",
    year: "2024",
    theme: "archive",
  },
  {
    number: "04",
    title: "Common ground",
    description: "Tools for making space around the important conversations.",
    category: "Product design",
    year: "2023",
    theme: "ground",
  },
  {
    number: "05",
    title: "Soft systems",
    description: "A flexible toolkit for a distinctly human service.",
    category: "Strategy + design",
    year: "2023",
    theme: "systems",
  },
  {
    number: "06",
    title: "Afterimage",
    description: "A small study in memory, motion, and the everyday.",
    category: "Experiments",
    year: "2022",
    theme: "afterimage",
  },
] as const;

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
    <main className="site-shell">
      <Soundscape />
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Neel Saswade home" data-cuelume-toggle="pulse">
          <span className="wordmark-mark">NS</span>
          <span>Neel Saswade</span>
        </a>
        <nav className="site-nav" aria-label="Main navigation">
          <a href="#work" data-cuelume-toggle="pulse">Work</a>
          <a href="#about" data-cuelume-toggle="pulse">About</a>
          <a href="#contact" data-cuelume-toggle="pulse">Contact</a>
        </nav>
        <span className="header-status"><i /> Open to select projects</span>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-aside hero-aside--top">
          <span className="eyebrow">Portfolio / 2025</span>
        </div>
        <div className="hero-main">
          <p className="hero-kicker">Product designer + creative partner</p>
          <h1 id="hero-title">Neel <em>Saswade</em></h1>
          <div className="hero-details">
            <p className="hero-intro">
              I&apos;m a designer based in San Francisco, making thoughtful digital
              experiences for people and teams doing meaningful work.
            </p>
            <p className="hero-note">
              Currently designing at <span className="placeholder-mark">[company]</span>.<br />
              Previously at <span className="placeholder-mark">[company]</span> and <span className="placeholder-mark">[company]</span>.
            </p>
          </div>
        </div>
        <div className="hero-aside hero-aside--bottom">
          <span>Scroll to see<br />selected work</span>
          <span className="scroll-arrow">↓</span>
        </div>
      </section>

      <div className="intro-rule" aria-hidden="true" />

      <section className="work-section" id="work" aria-labelledby="work-title">
        <div className="section-heading">
          <p className="eyebrow">A selection of things</p>
          <h2 id="work-title">Selected <em>work</em></h2>
          <p className="section-count">(06)</p>
        </div>

        <div className="project-grid">
          {projects.map((project) => (
            <a className="project-card" href="#contact" key={project.number} data-cuelume-toggle="pulse">
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
          ))}
        </div>
      </section>

      <section className="note-section" id="about" aria-labelledby="note-title">
        <div className="note-mark">✳</div>
        <p className="eyebrow">A little more</p>
        <h2 id="note-title">Good work usually starts before the <em>pixels.</em></h2>
        <p>
          I like finding the sharp idea hiding inside a messy problem — then
          giving it a shape that feels obvious in hindsight. More details,
          writing, and the occasional experiment are on their way here.
        </p>
      </section>

      <footer className="site-footer" id="contact">
        <div className="footer-topline">
          <span className="eyebrow">Have a project in mind?</span>
          <span className="footer-year">© 2025</span>
        </div>
        <a className="footer-cta" href="mailto:hello@yourname.com" data-cuelume-toggle="pulse">
          Let&apos;s make<br /><em>something good.</em> <span>↗</span>
        </a>
        <div className="footer-bottomline">
          <span>San Francisco, CA</span>
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
