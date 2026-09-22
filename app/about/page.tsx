import { SiteHeader } from "../site-header";
import { AboutPhotoGallery } from "./about-photo-gallery";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="site-shell page-enter about-page" id="top">
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
            <h1 id="about-title">Hallooo.</h1>
            <p>
              (Did you get a welcome bike?)
            </p>
            <p>
              You found my site. I&apos;m Neel, a product designer trying to make new
              technology feel less new.
            </p>
            <p>
              I started out studying software engineering. Then I took a design class
              with Dr. Takeyama and ended up in her human–robot interaction lab,
              watching people meet unfamiliar machines with a mix of confusion and
              delight. That moment stuck with me: the instant something strange
              starts to make sense.
            </p>
            <p>
              Now I work on products that change habits. It&apos;s a puzzle I keep coming
              back to: how do you explain the unfamiliar? How do you make someone
              want to try it? How do you make them smile? And how do you respect
              their time while you&apos;re asking them to change?
            </p>
            <p>
              This space is for the work and, eventually, the photography and writing
              around it.
            </p>
            <nav className="about-page__socials" aria-label="Links">
              <a
                href="https://x.com/neelsaswade"
                target="_blank"
                rel="noreferrer"
                data-social="twitter"
              >
                <span>Twitter</span>
                <span className="about-page__social-arrow" aria-hidden="true">
                  <svg viewBox="0 0 12 12" focusable="false">
                    <path d="M2 10 10 2M4.5 2H10v5.5" />
                  </svg>
                </span>
              </a>
              <a href="mailto:neel.saswade@gmail.com" data-social="email">
                <span>Email</span>
                <span className="about-page__social-arrow" aria-hidden="true">
                  <svg viewBox="0 0 12 12" focusable="false">
                    <path d="M2 10 10 2M4.5 2H10v5.5" />
                  </svg>
                </span>
              </a>
              <a
                href="/Neel-Saswade-Resume.pdf"
                target="_blank"
                rel="noreferrer"
                data-social="resume"
              >
                <span>Resume</span>
                <span className="about-page__social-arrow" aria-hidden="true">
                  <svg viewBox="0 0 12 12" focusable="false">
                    <path d="M2 10 10 2M4.5 2H10v5.5" />
                  </svg>
                </span>
              </a>
            </nav>
          </div>
        </div>

        <AboutPhotoGallery />

      </section>
    </main>
  );
}
