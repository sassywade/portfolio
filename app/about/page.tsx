import { Soundscape } from "../soundscape";
import { SiteHeader } from "../site-header";

export default function AboutPage() {
  return (
    <main className="site-shell page-enter" id="top">
      <Soundscape />
      <SiteHeader current="about" />
      <section className="simple-page" aria-labelledby="about-title">
        <p className="page-kicker">About</p>
        <h1 id="about-title">A designer who likes making things feel <em>clear.</em></h1>
        <div className="simple-page__copy">
          <p>
            I&apos;m a designer based in San Francisco, working across product,
            brand, and the space where the two start to overlap.
          </p>
          <p>
            I like finding the sharp idea hiding inside a messy problem — then
            giving it a shape that feels obvious in hindsight. Outside of work,
            you&apos;ll usually find me riding bikes, photographing San Francisco,
            or planning the next backpacking trip.
          </p>
        </div>
      </section>
    </main>
  );
}
