"use client";

import { useRef } from "react";

type ProjectVideoTileProps = {
  ariaLabel: string;
  className: string;
  label: string;
  poster: string;
  source: string;
  videoClassName: string;
  wideWindows: Array<[number, number]>;
};

export function ProjectVideoTile({
  ariaLabel,
  className,
  label,
  poster,
  source,
  videoClassName,
  wideWindows,
}: ProjectVideoTileProps) {
  const tileRef = useRef<HTMLDivElement>(null);

  function syncLabel(video: HTMLVideoElement) {
    const isWide = wideWindows.some(([start, end]) => video.currentTime >= start && video.currentTime < end);
    tileRef.current?.toggleAttribute("data-label-visible", isWide);
  }

  return (
    <div ref={tileRef} className={className} data-label-visible>
      <video
        className={videoClassName}
        aria-label={ariaLabel}
        autoPlay
        disablePictureInPicture
        loop
        muted
        playsInline
        poster={poster}
        preload="metadata"
        onLoadedMetadata={(event) => syncLabel(event.currentTarget)}
        onSeeked={(event) => syncLabel(event.currentTarget)}
        onTimeUpdate={(event) => syncLabel(event.currentTarget)}
      >
        <source src={source} type="video/mp4" />
      </video>
      <span className="project-video-label" aria-hidden="true">{label}</span>
    </div>
  );
}
