import { Soundscape } from "../soundscape";
import { SiteHeader } from "../site-header";
import { AboutPhotoGallery } from "./about-photo-gallery";
import { SiteFooter } from "../site-footer";
import { NowPlaying } from "../spotify-now-playing";

type ExperienceLogo = "glean" | "snap" | "kp" | "intuitive" | "clients" | "phonic" | "hri";

function ExperienceLogoMark({ logo, company }: { logo: ExperienceLogo; company: string }) {
  return (
    <span
      className={`about-page__experience-logo about-page__experience-logo--${logo}`}
      role="img"
      aria-label={`${company} logo`}
    >
      {logo === "kp" ? "KP" : null}
      {logo === "intuitive" ? "i" : null}
      {logo === "clients" ? <><span>A</span><span>M</span><span>G</span></> : null}
      {logo === "phonic" ? "P" : null}
      {logo === "hri" ? "HRI" : null}
    </span>
  );
}

export default function AboutPage() {
  return (
    <main className="site-shell page-enter about-page" id="top">
      <Soundscape />
      <SiteHeader current="about" />
      <section className="simple-page" aria-labelledby="about-title">
        <h1 id="about-title">Hi, I&apos;m Neel.</h1>
        <div className="about-page__identity">
          <div className="about-page__portrait-card" aria-label="Portrait photo slot">
            <div className="about-page__portrait-photo">
              <span className="about-page__portrait-initials">NS</span>
              <span className="about-page__portrait-plus" aria-hidden="true">+</span>
              <span className="about-page__portrait-placeholder">add portrait</span>
            </div>
            <div className="about-page__portrait-caption">
              <span>portrait / 00</span>
              <strong>your photo here</strong>
            </div>
          </div>
          <div className="simple-page__copy about-page__intro">
            <p>
              I&apos;m a product designer based in San Francisco. I think a lot about
              what makes new technology feel easy to live with: how people
              understand it, trust it, and find a reason to come back to it.
            </p>
          </div>
        </div>

        <AboutPhotoGallery />

        <section className="about-page__current" aria-labelledby="about-current-title">
          <div className="about-page__current-heading">
            <div>
              <p className="about-page__label">A tiny status report</p>
              <h2 id="about-current-title">A few things currently occupying my brain.</h2>
            </div>
            <span className="about-page__current-doodle" aria-hidden="true">✳</span>
          </div>

          <div className="about-page__current-grid">
            <NowPlaying />

            <article className="about-current-card about-current-card--reading" aria-labelledby="about-reading-title">
              <div className="about-current-card__topline">
                <span>currently reading</span>
                <span>02 / 02</span>
              </div>

              <div className="about-current-card__main about-reading__main">
                <div className="about-reading__cover" aria-hidden="true">
                  <span className="about-reading__cover-kicker">red rising / 02</span>
                  <strong>Golden<br />Son</strong>
                  <span className="about-reading__cover-orbit" />
                  <span className="about-reading__cover-author">Pierce Brown</span>
                </div>

                <div className="about-current-card__copy">
                  <p className="about-current-card__status">chapter by chapter</p>
                  <h2 id="about-reading-title">Golden Son</h2>
                  <p>The second book in the Red Rising saga. More Mars, more schemes, more impossible decisions.</p>
                </div>
              </div>

              <div className="about-current-card__footer about-reading__footer">
                <span>bookmarked for the commute</span>
                <span aria-hidden="true">↗</span>
              </div>
            </article>
          </div>
        </section>

        <section className="about-page__experience" aria-labelledby="about-experience-title">
          <h2 id="about-experience-title" className="about-page__section-heading">
            Experience
          </h2>
          <div className="about-page__experience-list">
            <article className="about-page__experience-row">
              <p className="about-page__experience-period">2022 to Now</p>
              <div className="about-page__experience-body">
                <div className="about-page__experience-heading">
                  <ExperienceLogoMark logo="glean" company="Glean" />
                  <h3>Glean</h3>
                  <p>Product Designer</p>
                </div>
                <p className="about-page__experience-description">
                  Building tools that help people make sense of their work.
                </p>
              </div>
            </article>

            <article className="about-page__experience-row">
              <p className="about-page__experience-period">2022</p>
              <div className="about-page__experience-body">
                <div className="about-page__experience-heading">
                  <ExperienceLogoMark logo="snap" company="Snap" />
                  <h3>Snap</h3>
                  <p>Product Design Intern</p>
                </div>
                <p className="about-page__experience-description">
                  Web3 team: making new internet ideas easier for Snapchatters
                  to understand.
                </p>
              </div>
            </article>

            <article className="about-page__experience-row">
              <p className="about-page__experience-period">2022</p>
              <div className="about-page__experience-body">
                <div className="about-page__experience-heading">
                  <ExperienceLogoMark logo="kp" company="Kleiner Perkins" />
                  <h3>Kleiner Perkins</h3>
                  <p>Design Fellow</p>
                </div>
                <p className="about-page__experience-description">
                  Learning alongside a sharp group of early-career designers and
                  builders.
                </p>
              </div>
            </article>

            <article className="about-page__experience-row">
              <p className="about-page__experience-period">2021</p>
              <div className="about-page__experience-body">
                <div className="about-page__experience-heading">
                  <ExperienceLogoMark logo="intuitive" company="Intuitive Surgical" />
                  <h3>Intuitive Surgical</h3>
                  <p>Interaction Designer</p>
                </div>
                <p className="about-page__experience-description">
                  Designing for complex systems in a high-stakes environment.
                </p>
              </div>
            </article>

            <article className="about-page__experience-row">
              <p className="about-page__experience-period">2021 to 2022</p>
              <div className="about-page__experience-body">
                <div className="about-page__experience-heading">
                  <ExperienceLogoMark logo="clients" company="Client work" />
                  <h3>Client work</h3>
                  <p>Product Design Consultant</p>
                </div>
                <p className="about-page__experience-description">
                  Selected clients: Adobe, Microsoft, Logitech G.
                </p>
              </div>
            </article>

            <article className="about-page__experience-row">
              <p className="about-page__experience-period">2020</p>
              <div className="about-page__experience-body">
                <div className="about-page__experience-heading">
                  <ExperienceLogoMark logo="phonic" company="Phonic" />
                  <h3>Phonic</h3>
                  <p>UI/UX Design + Software Engineering Intern</p>
                </div>
                <p className="about-page__experience-description">
                  Working across product design and front-end development.
                </p>
              </div>
            </article>

            <article className="about-page__experience-row">
              <p className="about-page__experience-period">Earlier</p>
              <div className="about-page__experience-body">
                <div className="about-page__experience-heading">
                  <ExperienceLogoMark logo="hri" company="Human-Robot Interaction Lab" />
                  <h3>Human-Robot Interaction Lab</h3>
                  <p>Research / Design</p>
                </div>
                <p className="about-page__experience-description">
                  Exploring how people understand and interact with robots.
                </p>
              </div>
            </article>
          </div>
        </section>
      </section>
      <SiteFooter />
    </main>
  );
}
