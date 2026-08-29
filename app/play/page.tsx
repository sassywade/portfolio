import { Soundscape } from "../soundscape";
import { SiteHeader } from "../site-header";

const experiments = [
  ["01", "Tiny type studies", "A collection of small experiments with type, rhythm, and found words."],
  ["02", "Weekend camera roll", "A lightweight archive of photographs from walks around the city."],
  ["03", "Things in progress", "Loose ideas, half-finished interfaces, and questions worth keeping around."],
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
          {experiments.map(([number, title, description]) => (
            <a className="play-item" href="#play-title" data-cuelume-toggle="pulse" key={number}>
              <span>{number}</span>
              <div>
                <h2>{title}</h2>
                <p>{description}</p>
              </div>
              <b>↗</b>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
