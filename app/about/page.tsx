import { Soundscape } from "../soundscape";
import { SiteHeader } from "../site-header";

export default function AboutPage() {
  return (
    <main className="site-shell page-enter about-page" id="top">
      <Soundscape />
      <SiteHeader current="about" />
      <section className="simple-page" aria-labelledby="about-title">
        <p className="page-kicker">About</p>
        <h1 id="about-title">Hi, I&apos;m Neel.</h1>
        <div className="simple-page__copy about-page__intro">
          <p>
            I&apos;m a product designer based in San Francisco. I think a lot about
            what makes new technology feel easy to live with — how people
            understand it, trust it, and find a reason to come back to it.
          </p>
          <p>
            That&apos;s what pulled me into design. I like working across the whole
            experience, from the idea and the mental model behind a product to
            the small details that make it feel good once you know your way
            around.
          </p>
          <p>
            I also spent time at the Human–Robot Interaction Lab, where I got
            interested in how people make sense of unfamiliar systems. I still
            bring that lens to product work: start with the person, make the
            system easier to understand, and keep the details thoughtful.
          </p>
        </div>

        <section className="about-page__experience" aria-labelledby="about-experience-title">
          <h2 id="about-experience-title" className="about-page__section-heading">
            Experience
          </h2>
          <div className="about-page__experience-list">
            <article className="about-page__experience-row">
              <p className="about-page__experience-period">2022 – Now</p>
              <div className="about-page__experience-body">
                <div className="about-page__experience-heading">
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
                  <h3>Snap</h3>
                  <p>Product Design Intern</p>
                </div>
                <p className="about-page__experience-description">
                  Web3 team — making new internet ideas easier for Snapchatters
                  to understand.
                </p>
              </div>
            </article>

            <article className="about-page__experience-row">
              <p className="about-page__experience-period">2022</p>
              <div className="about-page__experience-body">
                <div className="about-page__experience-heading">
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
                  <h3>Intuitive Surgical</h3>
                  <p>Interaction Designer</p>
                </div>
                <p className="about-page__experience-description">
                  Designing for complex systems in a high-stakes environment.
                </p>
              </div>
            </article>

            <article className="about-page__experience-row">
              <p className="about-page__experience-period">2021 – 2022</p>
              <div className="about-page__experience-body">
                <div className="about-page__experience-heading">
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
                  <h3>Human–Robot Interaction Lab</h3>
                  <p>Research / Design</p>
                </div>
                <p className="about-page__experience-description">
                  Exploring how people understand and interact with robots.
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="about-page__interests" aria-labelledby="about-interests-title">
          <div className="about-page__block">
            <p className="about-page__label">Away from work</p>
            <h2 id="about-interests-title">
              Usually outside, with Daisy, or looking for something good to eat.
            </h2>
            <div className="about-page__tags" aria-label="Things Neel enjoys">
              <span>cycling</span>
              <span>backpacking</span>
              <span>Daisy</span>
              <span>food</span>
              <span>travel</span>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
