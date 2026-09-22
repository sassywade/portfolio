"use client";

import { useSyncExternalStore, type ComponentProps } from "react";
import { ProjectVideo } from "./project-mockup";
import { growthVideoAlternative } from "./projects";

// Visit-local experiment shared by the picker and the inline Growth media.
let alternateEnabled = false;
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
const getSnapshot = () => alternateEnabled;
const getServerSnapshot = () => false;
function useAlternateGrowth() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function GrowthVideoToggle() {
  const enabled = useAlternateGrowth();
  return (
    <section className="meadow-settings__section" aria-label="Alternate Growth video">
      <div className="meadow-settings__section-head">
        <h2>Alternate Growth video</h2>
        <button type="button" aria-label="Alternate Growth video" aria-pressed={enabled}
          onClick={() => {
            alternateEnabled = !alternateEnabled;
            listeners.forEach((listener) => listener());
          }}>
          {enabled ? "On" : "Off"}
        </button>
      </div>
    </section>
  );
}

export function GrowthPrototypeVideo(props: ComponentProps<typeof ProjectVideo>) {
  const enabled = useAlternateGrowth();
  const media = enabled ? growthVideoAlternative : props;
  return <ProjectVideo {...props} key={media.src} src={media.src} poster={media.poster} />;
}
