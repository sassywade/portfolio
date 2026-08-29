import { Soundscape } from "../soundscape";
import { SiteFooter } from "../site-footer";
import { SiteHeader } from "../site-header";

export default function AboutPage() {
  return (
    <main className="site-shell page-enter" id="top">
      <Soundscape />
      <SiteHeader current="about" />
      <section className="inner-page about-page" aria-labelledby="about-title">
        <div className="inner-page__intro">
          <p className="page-kicker">About / A little context</p>
          <h1 id="about-title">A designer who likes making things feel <em>clear.</em></h1>
        </div>

        <div className="about-layout">
          <div className="about-portrait" aria-label="Portrait placeholder">
            <span>portrait<br />placeholder</span>
          </div>
          <div className="about-copy">
            <p className="about-lede">
              I&apos;m a designer based in San Francisco, working across product,
              brand, and the space where the two start to overlap.
            </p>
            <p>
              I like finding the sharp idea hiding inside a messy problem — then
              giving it a shape that feels obvious in hindsight. My process is
              curious, collaborative, and usually involves making something early
              so the conversation has somewhere to go.
            </p>
            <p>
              Outside of work, you&apos;ll usually find me riding bikes, photographing
              San Francisco, or planning the next backpacking trip.
            </p>
            <div className="about-facts">
              <div><span>Based in</span><strong>San Francisco, CA</strong></div>
              <div><span>Available for</span><strong>Selected collaborations</strong></div>
              <div><span>Currently learning</span><strong>How to make a good sourdough</strong></div>
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
