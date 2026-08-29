import { Soundscape } from "../soundscape";
import { SiteFooter } from "../site-footer";
import { SiteHeader } from "../site-header";

export default function ContactPage() {
  return (
    <main className="site-shell page-enter" id="top">
      <Soundscape />
      <SiteHeader current="contact" />
      <section className="inner-page contact-page" aria-labelledby="contact-title">
        <div className="inner-page__intro">
          <p className="page-kicker">Contact / Say hello</p>
          <h1 id="contact-title">Have a good idea? Let&apos;s give it a <em>shape.</em></h1>
          <p className="contact-lede">I&apos;m always happy to hear about thoughtful products, generous teams, and interesting problems.</p>
        </div>

        <div className="contact-details">
          <a className="contact-email" href="mailto:hello@yourname.com" data-cuelume-toggle="pulse">hello@yourname.com <span>↗</span></a>
          <div className="contact-links">
            <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" data-cuelume-toggle="pulse">LinkedIn ↗</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" data-cuelume-toggle="pulse">GitHub ↗</a>
            <a href="https://www.instagram.com" target="_blank" rel="noreferrer" data-cuelume-toggle="pulse">Instagram ↗</a>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
