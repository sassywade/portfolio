/* The work grid intentionally uses native local images as visual placeholders. */
/* eslint-disable @next/next/no-img-element */

import { projects } from "./projects";

const workImages: Record<(typeof projects)[number]["theme"], string> = {
  signal: "/work/work-01.png",
  field: "/work/work-02.png",
  archive: "/work/work-03.png",
  ground: "/work/work-04.png",
  systems: "/work/work-01.png",
  afterimage: "/work/work-03.png",
};

export function ProjectMockup({ theme }: { theme: (typeof projects)[number]["theme"] }) {
  return (
    <div className="project-mockup" aria-hidden="true">
      <img className="project-work-image" src={workImages[theme]} alt="" loading="lazy" />
    </div>
  );
}
