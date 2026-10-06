import { SiteHeader } from "../site-header";
import { AboutPhotoGallery } from "./about-photo-gallery";
import { LoadedImage } from "../loaded-image";
import { QuestImage } from "./quest-image";
import "./about-journal.css";

export default function AboutPage() {
  return (
    <main className="site-shell page-enter about-page about-page--journal" id="top">
      <SiteHeader current="about" />
      <section className="simple-page" aria-labelledby="about-title">
        <div className="about-page__identity">
          <div className="about-page__portrait-card" aria-label="Portrait photo slot">
            <div className="about-page__portrait-photo">
              <LoadedImage
                src="/about/neel-profile-thumb.jpg"
                alt="Neel Saswade"
                fill
                priority
                sizes="(max-width: 700px) 72vw, 248px"
                className="about-page__portrait-image"
              />
            </div>
          </div>
          <div className="simple-page__copy about-page__intro">
            <h1 id="about-title" className="about-page__greeting">Hello!</h1>
            <p className="about-page__lead">
              I joined Glean as its fifth designer and have been here through a
              lot of the product’s evolution. I’m drawn to ambiguous problems
              and the systems and interactions that shape them.
            </p>
            <p>
              I found my way to design through a human-robot interaction lab in
              college. Watching people figure out unfamiliar machines made me
              curious about how we introduce new technologies in ways that make
              sense.
            </p>
            <nav className="about-page__socials" aria-label="Links">
              <a
                href="https://x.com/neel_saswade"
                target="_blank"
                rel="noreferrer"
                data-social="twitter"
                aria-label="Twitter"
              >
                <span className="about-page__social-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M18.9 2.5h3.7l-8.1 9.3 9.5 9.7h-7.4l-5.8-6-5.2 6H1.9l7.8-8.9L.6 2.5h7.6l5.2 5.5 5.5-5.5Zm-1.3 17.3h2.1L7.5 4.1H5.3l12.3 15.7Z" />
                  </svg>
                </span>
              </a>
              <a href="https://www.linkedin.com/in/neel-saswade/" target="_blank" rel="noreferrer" data-social="linkedin" aria-label="LinkedIn">
                <span className="about-page__social-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
                  </svg>
                </span>
              </a>
              <span className="about-page__social-divider" aria-hidden="true" />
              <a href="/Neel-Saswade-Resume.pdf" target="_blank" rel="noreferrer" data-social="resume">
                <span className="about-page__social-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false"><path d="M14 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V8zM14 3v3.5A1.5 1.5 0 0 0 15.5 8H19M9 13h6M9 16.5h4" /></svg>
                </span>
                Resume
              </a>
            </nav>
          </div>
        </div>

        <AboutPhotoGallery />

        <section className="about-page__quests" aria-labelledby="side-quests-title">
          <h2 id="side-quests-title">Side quests</h2>
          <div className="about-page__quest-grid">
            <article className="about-page__quest">
              <a className="about-page__quest-art" href="https://x.com/neel_saswade/status/2077068857160700242?s=20" target="_blank" rel="noreferrer" aria-label="Glean Passport on X">
                <LoadedImage src="/about/passport.png" alt="An open Glean work passport with project stamps" width={1080} height={675} />
              </a>
              <h3>Glean Passport</h3>
              <p>I thought it’d be fun to visualize a work passport for all the projects you&apos;ve worked on (<a href="https://x.com/neel_saswade/status/2077068857160700242?s=20" target="_blank" rel="noreferrer">posted on X</a>).</p>
            </article>
            <article className="about-page__quest">
              <QuestImage src="/about/underwallet.png" alt="A handmade leather wallet shaped like underwear" title="The Underwallet" />
              <h3>The Underwallet</h3>
              <p>I recently got into leather-making and accidentally designed a wallet that looked like underwear.</p>
            </article>
            <article className="about-page__quest">
              <QuestImage src="/about/task-valley.png" alt="Task Valley, a pixel-art game with characters working on tasks" title="Task Valley" />
              <h3>Task Valley</h3>
              <p>I created a game using Glean’s API to find work I need to do and have NPCs work on it for me.</p>
            </article>
          </div>
        </section>

      </section>
    </main>
  );
}
