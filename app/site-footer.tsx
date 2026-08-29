import { SecretFooter } from "./secret-footer";

export function SiteFooter() {
  return (
    <footer className="site-footer pranathi-footer">
      <SecretFooter />
      <div className="footer-bottomline">
        <span>San Francisco, CA · © 2025</span>
        <div className="footer-links">
          <a href="mailto:hello@yourname.com" data-cuelume-toggle="pulse">Email ↗</a>
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" data-cuelume-toggle="pulse">LinkedIn ↗</a>
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer" data-cuelume-toggle="pulse">Instagram ↗</a>
        </div>
        <span><a href="#top" data-cuelume-toggle="pulse">Back to top ↑</a></span>
      </div>
    </footer>
  );
}
