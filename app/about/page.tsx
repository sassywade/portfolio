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
              Welcome to my website. I&apos;m hoping to use this space to share more of
              my work, photography, and, eventually, writing.
            </p>
            <p>
              I found my way to design through a human-robot interaction lab in
              college. Watching people meet unfamiliar machines with a mix of
              confusion and curiosity made me interested in how we introduce new
              technology in ways that feel intuitive.
            </p>
            <p>
              Today, my medium is product design, and the technology is AI. I&apos;m drawn
              to the puzzle of changing habits: How do you explain the unfamiliar?
              How do you get someone to try it? And how do you make the experience
              feel a little delightful?
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
