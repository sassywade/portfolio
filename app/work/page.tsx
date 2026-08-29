import { Soundscape } from "../soundscape";
import { ProjectGrid } from "../project-card";
import { SiteFooter } from "../site-footer";
import { SiteHeader } from "../site-header";

export default function WorkPage() {
  return (
    <main className="site-shell page-enter" id="top">
      <Soundscape />
      <SiteHeader current="work" />
      <section className="inner-page work-page" aria-labelledby="work-title">
        <div className="inner-page__intro">
          <p className="page-kicker">Archive / 2022—2025</p>
          <h1 id="work-title">Selected <em>work</em></h1>
          <p>Product design, identity, and small experiments for people and teams doing meaningful work.</p>
        </div>
        <ProjectGrid />
      </section>
      <SiteFooter />
    </main>
  );
}
