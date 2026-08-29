import { projects } from "./projects";

export function ProjectMockup({ theme }: { theme: (typeof projects)[number]["theme"] }) {
  return (
    <div className={`project-mockup project-mockup--${theme}`} aria-hidden="true">
      {theme === "signal" && (
        <>
          <div className="signal-topline">
            <span>signal / 01</span>
            <span>06:24</span>
          </div>
          <div className="signal-orbit" />
          <div className="signal-copy">
            <span>make room</span>
            <strong>for the<br />signal.</strong>
          </div>
          <div className="signal-footer">
            <span>scroll to explore</span>
            <span>↘</span>
          </div>
        </>
      )}

      {theme === "field" && (
        <>
          <div className="field-stamp">A FIELD<br />GUIDE</div>
          <div className="field-arc" />
          <div className="field-caption">Objects<br />with a story</div>
          <div className="field-swatches">
            <span />
            <span />
            <span />
          </div>
        </>
      )}

      {theme === "archive" && (
        <>
          <div className="archive-label">COLLECT / 001</div>
          <div className="archive-panel">
            <span className="archive-ring" />
            <span className="archive-line archive-line--one" />
            <span className="archive-line archive-line--two" />
            <span className="archive-spark" />
          </div>
          <div className="archive-title">The<br /><em>archive</em></div>
          <div className="archive-index">01 — 08</div>
        </>
      )}

      {theme === "ground" && (
        <>
          <div className="ground-browser">
            <div className="ground-browser__bar">
              <i />
              <i />
              <i />
            </div>
            <div className="ground-browser__content">
              <span className="ground-kicker">A place to begin</span>
              <strong>Meet in the<br />middle.</strong>
              <span className="ground-button">Explore ↗</span>
            </div>
          </div>
          <div className="ground-orb" />
        </>
      )}

      {theme === "systems" && (
        <>
          <div className="systems-label">SOFT<br />SYSTEMS</div>
          <div className="systems-grid">
            <span>01</span><span>02</span><span>03</span>
          </div>
          <div className="systems-shape systems-shape--one" />
          <div className="systems-shape systems-shape--two" />
          <div className="systems-note">a toolkit for<br />good work</div>
        </>
      )}

      {theme === "afterimage" && (
        <>
          <div className="afterimage-meta">STUDY 06 / 12</div>
          <div className="afterimage-frame">
            <div className="afterimage-sun" />
            <div className="afterimage-ribbon" />
            <div className="afterimage-ribbon afterimage-ribbon--offset" />
          </div>
          <div className="afterimage-caption">things<br /><em>remembered</em></div>
        </>
      )}
    </div>
  );
}
