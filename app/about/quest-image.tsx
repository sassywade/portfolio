"use client";

import { LoadedImage } from "../loaded-image";
import { usePhotoViewer } from "../photo-viewer";

export function QuestImage({ src, alt, title }: { src: string; alt: string; title: string }) {
  const { openPhoto, viewer, selectedId } = usePhotoViewer();
  return (
    <>
      <button className="about-page__quest-art" type="button" aria-label={`Expand ${title}`} aria-haspopup="dialog"
        style={{ visibility: selectedId === src ? "hidden" : undefined }}
        onClick={(event) => {
          const image = event.currentTarget.querySelector("img")!;
          openPhoto({ id: src, src, label: alt, ratio: image.naturalWidth / image.naturalHeight || 1.6 }, event.currentTarget, event.detail !== 0, image);
        }}>
        <LoadedImage src={src} alt={alt} width={1080} height={675} />
      </button>
      {viewer}
    </>
  );
}
