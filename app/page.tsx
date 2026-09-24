import { HeroMeadow } from "./hero-meadow";
import { BikeRide } from "./bike-ride";
import { PhotoDrop } from "./photo-drop";
import { BackpackWalk } from "./backpack-walk";
import { WorkSections } from "./work-sections";
import { SiteHeader } from "./site-header";
import { TopPetPull } from "./top-pet-pull";
import "./meadow-activities.css";

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
        <SiteHeader current="work" />
        <section className="pranathi-intro pranathi-intro--home" aria-labelledby="hero-title">
          <p className="pranathi-name" id="hero-title">Neel Saswade</p>
          <div className="pranathi-bio">
            <p className="hero-copy-line">
              <span className="hero-copy__rest">I’m a product designer based in San Francisco. Currently, I’m a designer at </span>
              <CompanyLink brand="glean" href="https://www.glean.com/">Glean</CompanyLink>
              <span className="hero-copy__rest"> working on proactivity, artifacts, and growth. Previously, I designed at </span>
              <CompanyLink brand="snap" href="https://www.snap.com/">Snap</CompanyLink>
              <span className="hero-copy__rest">.</span>
            </p>
            <p className="hero-copy-line hero-activities">
              <span className="hero-copy__rest hero-copy__free-time">In my free time,</span>
              <span className="hero-activities__icons">
                <PhotoDrop />
                <BikeRide />
                <BackpackWalk />
              </span>
            </p>
          </div>
          <HeroMeadow />
        </section>

        <section className="pranathi-work pranathi-work--editorial" id="work" aria-labelledby="work-title">
          <WorkSections />
        </section>

      </main>
    </>
  );
}
