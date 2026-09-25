"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./homepage-cards.module.css";

const cards = [
  [8, "Respond to Frank about Glean’s pricing plan"],
  [5, "Natasha Petrova’s three-year work anniversary"],
  [2, "Active discussion on Growth Q4 OKRs"],
  [6, "Company announcement: paid vacation holidays"],
  [1, "Design team weekly meeting"],
  [3, "Mention in Growth Achievements Q1"],
  [7, "Suggested task: update a Salesforce opportunity"],
  [0, "Meeting recap: US Design Team Critique"],
  [4, "Trending: FY2027 Company Goals"],
  [9, "Suggested task: respond to pull request comments"],
] as const;

export function HomepageCards() {
  const root = useRef<HTMLDivElement>(null);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => setRunning(visible && !document.hidden && !reduced.matches);
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .1 });
    if (root.current) observer.observe(root.current);
    document.addEventListener("visibilitychange", sync);
    reduced.addEventListener("change", sync);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", sync); reduced.removeEventListener("change", sync); };
  }, []);
  return <div ref={root} className={styles.stage} data-homepage-cards="vertical" data-running={running}
    tabIndex={0} role="region" aria-label="Glean homepage cards. Focus or hover to pause.">
    <div className={styles.track}>
      {[0, 1].map(copy => <div className={styles.group} key={copy} aria-hidden={copy === 1 ? true : undefined}>
        {cards.map(([index, label]) => <img key={index}
          src={`/work/homepage-cards/homepage_cards${index ? `-${index}` : ""}.png`}
          alt={copy === 0 ? label : ""} width={index >= 4 ? 2016 : 2000}
          height={index === 1 || index >= 7 ? 736 : 656} draggable={false} />)}
      </div>)}
    </div>
  </div>;
}
