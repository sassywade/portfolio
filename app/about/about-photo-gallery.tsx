"use client";

import type { CSSProperties } from "react";
import { LoadedImage } from "../loaded-image";
import { usePhotoViewer } from "../photo-viewer";

type PhotoSlot = {
  id: string;
  title: string;
  description: string;
  alt: string;
  orientation: "landscape" | "portrait";
  src: string;
};

const lifePhotos: PhotoSlot[] = [
  { id: "stars-over-camp", title: "A night under the stars", description: "Milky way spotted in Big Sur", alt: "A glowing tent beneath a starry sky", orientation: "portrait", src: "/about/stars-over-camp.jpeg" },
  { id: "ride-closeup", title: "A good day to ride", description: "Riding out of Stinson beach", alt: "Cyclists riding on a coastal road", orientation: "portrait", src: "/about/ride-closeup.JPG" },
  { id: "pink-sky", title: "A beautiful sunset in Kyoto", description: "Sunset gradient in Kyoto", alt: "A pink sunset over a city street in Kyoto", orientation: "portrait", src: "/about/pink-sky.jpg" },
  { id: "ride-day", title: "Out with the crew", description: "First road race #bonked", alt: "Cyclists riding together", orientation: "portrait", src: "/about/ride-day.JPG" },
  { id: "bike-in-the-meadow", title: "Parked for a minute", description: "New steed. Meet Dark Envy aka Eric", alt: "A road bike resting in a flower-covered meadow", orientation: "portrait", src: "/about/bike-in-the-meadow.JPG" },
  { id: "mountain-lookout", title: "Take in the whole thing", description: "Reading on my fav chair #ultralight", alt: "Person looking at a mountain landscape", orientation: "portrait", src: "/about/mountain-lookout.JPG" },
  { id: "camp-view", title: "10/10 camping spot in Yosemite", description: "10/10 camping spot. 0/10 insect experience", alt: "A tent below a mountain peak", orientation: "portrait", src: "/about/camp-view.JPG" },
  { id: "san-francisco-park", title: "Alamo Square", description: "Alamo square during SF Summer", alt: "People relaxing in Alamo Square with San Francisco in the background", orientation: "portrait", src: "/about/san-francisco-park.JPG" },
  { id: "ride-through-the-grass", title: "Chasing the light", description: "The spirit of gravel?", alt: "Cyclist riding through a grassy field", orientation: "portrait", src: "/about/ride-through-the-grass.JPG" },
  { id: "red-wall-bike", title: "Bike against a red wall", description: "The old steed (retired now)", alt: "A road bike against a red wall", orientation: "portrait", src: "/about/red-wall-bike.JPG" },
  { id: "san-francisco-from-above", title: "The city from above", description: "Exploring Bernal Heights", alt: "San Francisco skyline from a grassy hill", orientation: "portrait", src: "/about/san-francisco-from-above.JPG" },
];

const captionLines = [
  ["Milky way spotted", "in Big Sur"],
  ["Riding out of", "Stinson beach"],
  ["Sunset gradient", "in Kyoto"],
  ["First road race", "#bonked"],
  ["New steed", "meet Dark Envy aka Eric"],
  ["Reading on my fav", "chair #ultralight"],
  ["10/10 camping spot", "0/10 insect experience"],
  ["Alamo square during", "SF Summer"],
  ["The spirit of gravel?"],
  ["The old steed", "(retired now)"],
  ["Exploring Bernal Heights"],
];

const rotations = [-5, -4, 0, 2, -4, 1, 2, -3, 1, 0, 5];

/* Prints show a 640px thumbnail; the viewer opens the original behind that preview. */
const thumbnailFor = (src: string) => src.replace(/\.[^.]+$/, "-thumb.jpg");
const viewerSequence = lifePhotos.map((item) => ({ id: item.id, src: item.src, thumbnail: thumbnailFor(item.src), label: item.alt, ratio: 2 / 3, frame: "film" as const }));

export function AboutPhotoGallery() {
  const { openPhoto, viewer, selectedId } = usePhotoViewer();
  return (
    <>
    <section className="about-page__gallery life-gallery" aria-labelledby="about-gallery-title">
      <h2 id="about-gallery-title">Recents from life</h2>
      <div className="life-gallery__viewport">
        <div className="life-gallery__track">
          {lifePhotos.map((photo, index) => {
            let character = 0;
            return (
              <figure
                key={photo.id}
                className="life-print"
                aria-label={photo.description}
                style={{ "--print-angle": `${rotations[index]}deg`, "--print-index": index } as CSSProperties}
              >
                <div className="life-print__composition">
                  <button className="life-print__paper" type="button" aria-label={`Open ${photo.title}`} aria-haspopup="dialog"
                    style={{ visibility: selectedId === photo.id ? "hidden" : undefined }}
                    onClick={(event) => {
                      const image = event.currentTarget.querySelector("img")!;
                      openPhoto({ id: photo.id, src: photo.src, thumbnail: thumbnailFor(photo.src), label: photo.alt, ratio: image.naturalWidth / image.naturalHeight || 2 / 3, frame: "film" }, event.currentTarget, event.detail !== 0, image,
                        viewerSequence);
                    }}>
                    <LoadedImage src={thumbnailFor(photo.src)} alt={photo.alt} width={900} height={1200} sizes="180px" loading="eager" unoptimized draggable={false} />
                  </button>
                  <figcaption className="life-print__caption">
                    <span className="sr-only">{photo.description}</span>
                    <span aria-hidden="true">
                      {captionLines[index].map((line, lineIndex) => (
                        <span className="life-print__line" key={lineIndex}>
                          {Array.from(line).map((letter) => {
                            const position = character++;
                            return <span className="life-print__letter" key={position} style={{ "--letter-index": position } as CSSProperties}>{letter}</span>;
                          })}
                        </span>
                      ))}
                    </span>
                  </figcaption>
                </div>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
    {viewer}
    </>
  );
}
