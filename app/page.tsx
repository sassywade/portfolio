import { HeroMeadow } from "./hero-meadow";
import { BikeRide } from "./bike-ride";
import { PhotoDrop } from "./photo-drop";
import { Soundscape } from "./soundscape";
import { ProjectGrid } from "./project-card";
import { SiteHeader } from "./site-header";

export default function Home() {
  return (
    <main className="site-shell page-enter" id="top">
      <Soundscape />
      <SiteHeader current="work" />

      <section className="pranathi-intro pranathi-intro--home" aria-labelledby="hero-title">
        <p className="pranathi-name" id="hero-title">Neel Saswade</p>
        <div className="pranathi-bio">
          <p>
            I&apos;m a designer based in San Francisco. Currently, I&apos;m exploring
            thoughtful product experiences with teams working on <span className="placeholder-mark">[something good]</span>.
            Previously, I designed at <span className="placeholder-mark">[company]</span> and <span className="placeholder-mark">[company]</span>.
          </p>
          <p>In my free time I ride <BikeRide />, <PhotoDrop />, and go backpacking.</p>
        </div>
        <HeroMeadow />
      </section>

      <section className="pranathi-work" id="work" aria-labelledby="work-title">
        <h2 className="sr-only" id="work-title">Work</h2>
        <ProjectGrid />
      </section>
    </main>
  );
}
