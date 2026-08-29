import Link from "next/link";

type SiteHeaderProps = {
  current?: "home" | "work" | "about" | "contact";
};

const links = [
  ["work", "Work", "/work"],
  ["about", "About", "/about"],
  ["contact", "Contact", "/contact"],
] as const;

export function SiteHeader({ current }: SiteHeaderProps) {
  return (
    <header className="site-header site-header--pages">
      <Link className="wordmark" href="/" aria-label="Neel Saswade home" data-cuelume-toggle="page">
        <span className="wordmark-mark">NS</span>
        <span>Neel Saswade</span>
      </Link>
      <nav className="site-nav" aria-label="Main navigation">
        {links.map(([id, label, href]) => (
          <Link
            href={href}
            className={current === id ? "is-active" : undefined}
            aria-current={current === id ? "page" : undefined}
            data-cuelume-toggle="page"
            key={id}
          >
            {label}
          </Link>
        ))}
      </nav>
      <span className="header-status"><i /> Open to select projects</span>
    </header>
  );
}
