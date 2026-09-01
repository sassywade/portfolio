import Link from "next/link";

const footerYear = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="pranathi-footer" aria-labelledby="footer-note">
      <div className="pranathi-footer__bar" aria-hidden="true">
        <span>End notes</span>
        <span>01 / 01</span>
      </div>

      <div className="pranathi-footer__main">
        <div className="pranathi-footer__note">
          <p className="pranathi-footer__eyebrow">An original note to self</p>
          <p className="pranathi-footer__quote" id="footer-note">
            “Make something clear enough to use, <em>strange enough to remember.</em>”
          </p>
          <p className="pranathi-footer__attribution">— Neel Saswade</p>
        </div>

        <div className="pranathi-footer__links">
          <div className="pranathi-footer__link-group">
            <p className="pranathi-footer__label">
              Say hello <span aria-hidden="true">↘</span>
            </p>
            <a href="mailto:hello@yourname.com">Email</a>
            <a
              href="https://www.linkedin.com/in/neelsaswade/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
          </div>

          <div className="pranathi-footer__link-group">
            <p className="pranathi-footer__label">
              Keep looking <span aria-hidden="true">↘</span>
            </p>
            <Link href="/about">About</Link>
            <Link href="/play">Play</Link>
          </div>
        </div>
      </div>

      <div className="pranathi-footer__return">
        <a href="#top" className="pranathi-footer__return-link">
          <span className="pranathi-footer__return-arrow" aria-hidden="true">↗</span>
          <span>Back to the beginning</span>
        </a>
        <p>Thanks for staying a while.</p>
      </div>

      <div className="pranathi-footer__bottomline">
        <span>© {footerYear} Neel Saswade</span>
        <span>San Francisco <i aria-hidden="true">·</i> Built with care</span>
      </div>
    </footer>
  );
}
