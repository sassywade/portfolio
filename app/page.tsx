import { HeroMeadow } from "./hero-meadow";
import { BikeRide } from "./bike-ride";
import { PhotoDrop } from "./photo-drop";
import { BackpackWalk } from "./backpack-walk";
import { Soundscape } from "./soundscape";
import { ProjectGrid } from "./project-card";
import { SiteHeader } from "./site-header";
import { TopPetPull } from "./top-pet-pull";

type CompanyLinkProps = {
  brand: "glean" | "snap" | "intuitive";
  href: string;
  children: React.ReactNode;
};

function CompanyLink({ brand, href, children }: CompanyLinkProps) {
  return (
    <a
      className={`hero-inline-action hero-company hero-company--${brand}`}
      href={href}
      target="_blank"
      rel="noreferrer"
      data-cuelume-hover="tick"
      data-cuelume-release="page"
      aria-label={`${children} — open company website in a new tab`}
    >
      <span className="hero-company__mark" aria-hidden="true" />
      <span>{children}</span>
    </a>
  );
}

export default function Home() {
  return (
    <>
      <TopPetPull />
      <main className="site-shell page-enter" id="top">
        <Soundscape />
        <SiteHeader current="work" />

        <section className="pranathi-intro pranathi-intro--home" aria-labelledby="hero-title">
          <p className="pranathi-name" id="hero-title">Neel Saswade</p>
          <div className="pranathi-bio">
            <p className="hero-copy-line">
              <span className="hero-copy__rest">I&apos;m a product designer based in San Francisco. Currently, I work at </span>
              <CompanyLink brand="glean" href="https://www.glean.com/">Glean</CompanyLink>
              <span className="hero-copy__rest"> focused on proactive intelligence, growth, and artifacts. Previously, I designed at </span>
              <CompanyLink brand="snap" href="https://www.snap.com/">Snap</CompanyLink>
              <span className="hero-copy__rest">.</span>
            </p>
            <p className="hero-copy-line">
              <span className="hero-copy__rest">In my free time I ride </span>
              <BikeRide />
              <span className="hero-copy__rest">, </span>
              <PhotoDrop />
              <span className="hero-copy__rest">, and go </span>
              <BackpackWalk />
              <span className="hero-copy__rest">.</span>
            </p>
          </div>
          <HeroMeadow />
        </section>

        <section className="pranathi-work" id="work" aria-labelledby="work-title">
          <h2 className="sr-only" id="work-title">Work</h2>
          <ProjectGrid />
        </section>

      </main>
    </>
  );
}
