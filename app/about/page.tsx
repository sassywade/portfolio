import { SiteHeader } from "../site-header";
import { AboutPhotoGallery } from "./about-photo-gallery";
import Image from "next/image";
import "./about-journal.css";

export default function AboutPage() {
  return (
    <main className="site-shell page-enter about-page about-page--journal" id="top">
      <SiteHeader current="about" />
      <section className="simple-page" aria-labelledby="about-title">
        <div className="about-page__identity">
          <div className="about-page__portrait-card" aria-label="Portrait photo slot">
            <div className="about-page__portrait-photo">
              <Image
                src="/about/neel-profile.jpg"
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
              I’m a designer who likes to tackle ambiguous problems, enjoying all
              the bits of systems-thinking to delightfully crafted interactions.
            </p>
            <p className="about-page__about-copy">
              I found my way to design through a human-robot interaction lab in
              college. Watching people meet unfamiliar machines with a mix of
              confusion and curiosity made me interested in how we introduce new
              technologies to people.
            </p>
            <nav className="about-page__socials" aria-label="Links">
              <a href="/Neel-Saswade-Resume.pdf" target="_blank" rel="noreferrer" data-social="resume" aria-label="Resume">
                <span className="about-page__social-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false"><path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h6" /></svg>
                </span>
                Resume
              </a>
              <span className="about-page__social-divider" aria-hidden="true" />
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
                  <svg viewBox="0 0 24 24" focusable="false"><circle cx="5" cy="5" r="2" /><path d="M3.5 10h3v11h-3zM11 10h3v1.5c1-2.5 7-2.5 7 2.5v7h-3v-6c0-3-4-3-4 0v6h-3z" /></svg>
                </span>
              </a>
              <a href="mailto:neel.saswade@gmail.com" data-social="email" aria-label="Email">
                <span className="about-page__social-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
                    <path d="m4.25 7 7.75 6 7.75-6" />
                  </svg>
                </span>
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
                <Image src="/about/passport.png" alt="An open Glean work passport with project stamps" width={1080} height={675} />
              </a>
              <h3>Glean Passport</h3>
              <p>I thought it’d be fun to visualize a work passport for all the projects you&apos;ve worked on (<a href="https://x.com/neel_saswade/status/2077068857160700242?s=20" target="_blank" rel="noreferrer">posted on X</a>).</p>
            </article>
            <article className="about-page__quest">
              <div className="about-page__quest-art"><Image src="/about/underwallet.png" alt="A handmade leather wallet shaped like underwear" width={1080} height={675} /></div>
              <h3>The Underwallet</h3>
              <p>I recently got into leather-making and accidentally designed a wallet that looked like underwear.</p>
            </article>
            <article className="about-page__quest">
              <div className="about-page__quest-art"><Image src="/about/task-valley.png" alt="Task Valley, a pixel-art game with characters working on tasks" width={1080} height={675} /></div>
              <h3>Task Valley</h3>
              <p>I created a game using Glean’s API to find work I need to do and have NPCs work on it for me.</p>
            </article>
          </div>
        </section>

      </section>
    </main>
  );
}
