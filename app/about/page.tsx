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
            <h2 className="about-page__greeting">Hello,</h2>
            <h1 id="about-title" className="about-page__about-copy">
              I found my way to design through a human-robot interaction lab in
              college. Watching people meet unfamiliar machines with a mix of
              confusion and curiosity made me interested in how we introduce new
              technologies to people.
            </h1>
            <nav className="about-page__socials" aria-label="Links">
              <a
                href="https://x.com/neelsaswade"
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
              <a href="mailto:neel.saswade@gmail.com" data-social="email" aria-label="Email">
                <span className="about-page__social-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false">
                    <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
                    <path d="m4.25 7 7.75 6 7.75-6" />
                  </svg>
                </span>
              </a>
              <a
                href="/Neel-Saswade-Resume.pdf"
                target="_blank"
                rel="noreferrer"
                data-social="resume"
                aria-label="CV"
              >
                CV
              </a>
            </nav>
          </div>
        </div>

        <AboutPhotoGallery />

      </section>
    </main>
  );
}
