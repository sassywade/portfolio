import { Soundscape } from "../soundscape";
import { SiteHeader } from "../site-header";
import { SiteFooter } from "../site-footer";

const experiments = [
  ["01", "Passport"],
  ["02", "Mental health app"],
  ["03", "Logitech"],
  ["04", "Adobe"],
  ["05", "Microsoft"],
] as const;

export default function PlayPage() {
  return (
    <main className="site-shell page-enter" id="top">
      <Soundscape />
      <SiteHeader current="play" />
      <section className="simple-page play-page" aria-labelledby="play-title">
        <p className="page-kicker">Play</p>
        <h1 id="play-title">Small things, just for <em>fun.</em></h1>
        <p className="simple-page__lede">A place for lightweight experiments, side projects, and things I&apos;m still figuring out.</p>
        <div className="play-list">
          {experiments.map(([number, title]) => (
            <a className="play-item" href="#play-title" data-cuelume-toggle="pulse" key={number}>
              <span>{number}</span>
              <div>
                <h2>{title}</h2>
              </div>
              <b>↗</b>
            </a>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
