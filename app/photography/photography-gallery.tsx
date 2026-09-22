"use client";

import { usePhotoViewer } from "../photo-viewer";
import styles from "./photography.module.css";

// Preserve each slot's proportions when replacing placeholders with photographs.
const photographs = [
  0.8, 1.5, 1, 0.67, 1.25, 0.8, 1.5, 0.75,
  1, 1.5, 0.67, 1.25, 0.8, 1, 1.5, 0.75,
  1.25, 0.67, 1, 1.5, 0.8, 1.25, 0.75, 1,
].map((ratio, index) => ({ id: index + 1, ratio }));

export function PhotographyGallery() {
  const { openPhoto, viewer, selectedId } = usePhotoViewer();
  return (
    <>
      <div className={styles.gallery}>
        {photographs.map((photo) => (
          <button
            key={photo.id}
            className={styles.photo}
            style={{ aspectRatio: photo.ratio, visibility: selectedId === photo.id ? "hidden" : undefined }}
            aria-label={`Open photograph ${photo.id} (placeholder)`}
            aria-haspopup="dialog"
            onClick={(event) => openPhoto({ ...photo, label: `Photograph ${photo.id} (placeholder)` }, event.currentTarget, event.detail !== 0)}
          />
        ))}
      </div>
      {viewer}
    </>
  );
}
