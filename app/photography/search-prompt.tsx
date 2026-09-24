"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./photography.module.css";

export function SearchPrompt() {
  const prompt = useRef<HTMLSpanElement>(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let visible = false;
    const update = () => setRunning(visible && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(prompt.current!);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  return (
    <span ref={prompt} className={styles.searchPrompt} data-running={running} aria-hidden="true">
      type <span className={styles.searchPromptWords}>
        <span>“bikes”</span><span>“nature”</span><span>“city”</span><span>“sunsets”</span>
      </span>
    </span>
  );
}
