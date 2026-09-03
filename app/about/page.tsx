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
              I&apos;m a product designer who likes figuring out how new technology can
              feel a little more natural to use.
            </p>
            <p>
              I tend to bounce between thinking about the larger product and
              sweating the small details. I&apos;m happiest working on things that are
              still taking shape, where there&apos;s room to explore, try ideas, and
              make something people actually want to use.
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

        <section className="about-page__experience" aria-labelledby="about-experience-title">
          <h2 className="about-page__section-heading" id="about-experience-title">Experience</h2>
          <div className="about-page__experience-list">
            <article className="about-page__experience-row">
              <div className="about-page__experience-heading">
                <h3>Glean</h3><p>Senior Product Designer</p>
              </div>
              <p className="about-page__experience-period">Sep 2022 - Present</p>
              <p className="about-page__experience-description">Leading design on proactivity, homepage, artifacts, and growth</p>
            </article>
            <article className="about-page__experience-row">
              <div className="about-page__experience-heading">
                <h3>Snap</h3><p>Product Design Intern</p>
              </div>
              <p className="about-page__experience-period">Jun 2022 - Aug 2022</p>
              <p className="about-page__experience-description">Internal startup within Snap working on Web3 initiatives</p>
            </article>
            <article className="about-page__experience-row">
              <div className="about-page__experience-heading">
                <h3>Intuitive Surgical</h3><p>Interaction Design Intern</p>
              </div>
              <p className="about-page__experience-period">May 2021 - Aug 2021</p>
              <p className="about-page__experience-description">Designing tools for complex systems in a high-stakes environment</p>
            </article>
            <article className="about-page__experience-row">
              <div className="about-page__experience-heading">
                <h3>Berkeley Innovation Consultancy</h3><p>Product Design Consultant</p>
              </div>
              <p className="about-page__experience-period">Jan 2021 - May 2022</p>
              <p className="about-page__experience-description">Worked with Adobe, Microsoft, and Logitech G</p>
            </article>
            <article className="about-page__experience-row">
              <div className="about-page__experience-heading">
                <h3>Phonic</h3><p>Software Engineering and Product Design Intern</p>
              </div>
              <p className="about-page__experience-period">Jan 2020 - Dec 2020</p>
              <p className="about-page__experience-description">Sole designer and engineer for a YC-backed audio survey company</p>
            </article>
            <article className="about-page__experience-row">
              <div className="about-page__experience-heading">
                <h3>Human-Robot Interaction Lab</h3><p>Research Assistant</p>
              </div>
              <p className="about-page__experience-period">May 2019 - Aug 2020</p>
              <p className="about-page__experience-description">Conducted research between humans and computers with Dr. Takayama</p>
            </article>
          </div>
        </section>
      </section>
    </main>
  );
}
