"use client";

import { useEffect, useRef } from "react";
import styles from "./artifact-panels.module.css";

const skins = [
  { name: "Gmail", file: "gmail-skin.png", width: 1335, height: 1175 },
  { name: "Slack", file: "slack-skin.png", width: 1343, height: 991 },
  { name: "Outlook", file: "outlook-skin.png", width: 1335, height: 1775 },
];

// Each ten-second turn includes two reading holds, not continuous scrolling.
function frames(index: number) {
  const result: Keyframe[] = [];
  for (let turn = 0; turn < 3; turn++) {
    const depth = (index - turn + 3) % 3;
    const nextDepth = (index - turn + 2) % 3;
    const stack = (d: number) => `translate(-50%, ${24 - d * 9}cqw) scale(${1 - d * .06})`;
    const focused = "translate(-50%, 3cqw) scale(1)";
    // Slack's content is near the top. Emails reveal their lower body on the second hold.
    const bottom = index === 1 ? 3 : Math.min(3, 49 - 82 * skins[index].height / skins[index].width);
    const revealed = `translate(-50%, ${bottom}cqw) scale(1)`;
    const add = (time: number, transform: string, opacity: number, zIndex: number) =>
      result.push({ offset: (turn * 10 + time) / 30, transform, opacity, zIndex, easing: "cubic-bezier(.77, 0, .175, 1)" });
    add(0, stack(depth), 1, 3 - depth);
    add(1.4, stack(depth), 1, 3 - depth);
    add(2.3, depth === 0 ? focused : stack(depth), depth === 0 ? 1 : 0, 3 - depth);
    add(4.8, depth === 0 ? focused : stack(depth), depth === 0 ? 1 : 0, 3 - depth);
    add(6.3, depth === 0 ? revealed : stack(depth), depth === 0 ? 1 : 0, 3 - depth);
    add(8.3, depth === 0 ? revealed : stack(depth), depth === 0 ? 1 : 0, 3 - depth);
    add(9.2, stack(depth), 1, 3 - depth);
    add(10, stack(nextDepth), 1, 3 - nextDepth);
  }
  return result;
}

export function ArtifactSkins() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = root.current;
    if (!node) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const animations = Array.from(node.querySelectorAll("img")).map((image, index) => {
      const animation = image.animate(frames(index), { duration: 30000, iterations: Infinity, fill: "both" });
      animation.pause();
      return animation;
    });
    let visible = false;
    const sync = () => animations.forEach(animation => {
      if (reduced.matches) { animation.pause(); animation.currentTime = 0; }
      else if (visible && !document.hidden) animation.play();
      else animation.pause();
    });
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, { threshold: .15 });
    observer.observe(node);
    reduced.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      reduced.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      animations.forEach(animation => animation.cancel());
    };
  }, []);
  return (
    <div ref={root} className={`${styles.panel} ${styles.skins}`} data-artifact-panel="skins" aria-label="Artifact skins for Gmail, Slack, and Outlook">
      {skins.map((skin, index) => (
        <img key={skin.file} src={`/work/artifacts/${skin.file}`} alt={`${skin.name} artifact draft`}
          width={skin.width} height={skin.height} loading="lazy"
          style={{ transform: `translate(-50%, ${24 - index * 9}cqw) scale(${1 - index * .06})`, zIndex: 3 - index }} />
      ))}
    </div>
  );
}
