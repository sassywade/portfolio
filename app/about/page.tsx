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
            <h1 id="about-title">Hello!</h1>
            <p>
              I&apos;m a product designer interested in making new technology feel
              natural to use.
            </p>
            <p>
              I work across the big product question and the small detail. I like
              projects that are still taking shape: room to explore, try ideas, and
              make something useful.
            </p>
            <nav className="about-page__socials" aria-label="Social links">
              <a
                href="https://x.com/neelsaswade"
                target="_blank"
                rel="noreferrer"
                data-social="twitter"
              >
                <span>Twitter</span>
                <span className="about-page__social-arrow" aria-hidden="true">↗</span>
              </a>
              <a
                href="https://www.linkedin.com/in/neelsaswade/"
                target="_blank"
                rel="noreferrer"
                data-social="linkedin"
              >
                <span>LinkedIn</span>
                <span className="about-page__social-arrow" aria-hidden="true">↗</span>
              </a>
              <a href="mailto:neel.saswade@gmail.com" data-social="email">
                <span>Email</span>
                <span className="about-page__social-arrow" aria-hidden="true">↗</span>
              </a>
            </nav>
          </div>
        </div>

        <AboutPhotoGallery />

      </section>
    </main>
  );
}
