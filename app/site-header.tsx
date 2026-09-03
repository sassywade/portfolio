/* Vinext's client-side Link shim currently swallows these route clicks. */
/* eslint-disable @next/next/no-html-link-for-pages */

type SiteHeaderProps = {
  current?: "work" | "about" | "play";
};

const links = [
  ["work", "Work", "/#work"],
  ["about", "About", "/about"],
  ["play", "Play", "/play"],
  ["resume", "Resume", "/Neel-Saswade-Resume.pdf"],
] as const;

export function SiteHeader({ current }: SiteHeaderProps) {
  return (
    <header className="site-header site-header--pages">
      <a
        className="site-header__wordmark"
        href="/"
        aria-label="Neel Saswade, home"
      >
        Neel Saswade
      </a>
      <nav className="site-nav" aria-label="Main navigation">
        {links.map(([id, label, href]) => (
          <a
            href={id === "work" && current === "work" ? "#work" : href}
            className={current === id ? "is-active" : undefined}
            aria-current={current === id ? "page" : undefined}
            target={id === "resume" ? "_blank" : undefined}
            rel={id === "resume" ? "noopener noreferrer" : undefined}
            key={id}
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}
