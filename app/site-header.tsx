import Link from "next/link";

type SiteHeaderProps = {
  current?: "work" | "about" | "play";
};

const links = [
  ["work", "Work", "/#work"],
  ["about", "About", "/about"],
  ["play", "Play", "/play"],
] as const;

export function SiteHeader({ current }: SiteHeaderProps) {
  return (
    <header className="site-header site-header--pages">
      <nav className="site-nav" aria-label="Main navigation">
        {links.map(([id, label, href]) => (
          <Link
            href={href}
            className={current === id ? "is-active" : undefined}
            aria-current={current === id ? "page" : undefined}
            data-cuelume-toggle="page"
            key={id}
          >
            <span className="site-nav__label">{label}</span>
            <span className="site-nav__label site-nav__label--hover" aria-hidden="true">{label}</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}
