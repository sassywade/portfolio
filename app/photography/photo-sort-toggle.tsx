"use client";

import { useId } from "react";
import { setPhotoGrouping, type PhotoGrouping } from "./photo-grouping";
import styles from "./photography.module.css";

export function PhotoSortToggle({ grouping }: { grouping: PhotoGrouping }) {
  const name = useId();
  return (
    <fieldset className={styles.sort}>
      <legend className="sr-only">Sort photos by</legend>
      <span className={styles.sortCaption} aria-hidden="true">Sort by</span>
      <div className={styles.sortOptions} data-selected={grouping}>
        {([['color', 'Color'], ['style', 'Style']] as const).map(([value, label]) => (
          <label key={value}>
            <input type="radio" name={name} value={value} checked={grouping === value} onChange={() => setPhotoGrouping(value)} />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
