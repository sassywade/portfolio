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

        <div className="about-page__details">
          <section className="about-page__block" aria-labelledby="about-interests-title">
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
          </section>

          <section className="about-page__block" aria-labelledby="about-work-title">
            <p className="about-page__label">A few places I&apos;ve worked</p>
            <h2 id="about-work-title" className="sr-only">Work experience</h2>
            <ul className="about-page__work-list">
              <li>Glean</li>
              <li>Snap</li>
              <li>Intuitive Surgical</li>
              <li>Phonic</li>
              <li>Human–Robot Interaction Lab</li>
            </ul>
          </section>
        </div>
      </section>
    </main>
  );
}
