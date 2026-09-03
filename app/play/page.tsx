import { SiteHeader } from "../site-header";

const projects = [
  "Passport",
  "Mental health app",
  "Logitech",
  "Adobe",
  "Microsoft",
] as const;

export default function PlayPage() {
  return (
    <main className="site-shell page-enter play-page" id="top">
      <SiteHeader current="play" />
      <section className="play-page__content" aria-labelledby="play-title">
        <header className="play-page__intro">
          <h1 id="play-title">Play</h1>
          <p>Small experiments, side projects, and things I&apos;m still figuring out.</p>
        </header>

        <div className="play-grid">
          {projects.map((project) => (
            <article className="play-tile" key={project}>
              <h2>{project}</h2>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
