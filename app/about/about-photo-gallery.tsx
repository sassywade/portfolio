"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
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
  { id: "stars-over-camp", title: "A night under the stars", description: "Seeing the milky way for the first time in Big Sur", alt: "A glowing tent beneath a starry sky", orientation: "portrait", src: "/about/stars-over-camp.jpeg" },
  { id: "ride-closeup", title: "A good day to ride", description: "Riding out of Stinson beach in June", alt: "Cyclists riding on a coastal road", orientation: "portrait", src: "/about/ride-closeup.JPG" },
  { id: "pink-sky", title: "A beautiful sunset in Kyoto", description: "Sunset in Kyoto", alt: "A pink sunset over a city street in Kyoto", orientation: "portrait", src: "/about/pink-sky.jpg" },
  { id: "ride-day", title: "Out with the crew", description: "My first road race", alt: "Cyclists riding together", orientation: "portrait", src: "/about/ride-day.JPG" },
  { id: "bike-in-the-meadow", title: "Parked for a minute", description: "My new bike! Meet Dark Envy (aka Eric)", alt: "A road bike resting in a flower-covered meadow", orientation: "portrait", src: "/about/bike-in-the-meadow.JPG" },
  { id: "mountain-lookout", title: "Take in the whole thing", description: "Reading on my ultralight chair after making camp", alt: "Person looking at a mountain landscape", orientation: "portrait", src: "/about/mountain-lookout.JPG" },
  { id: "camp-view", title: "10/10 camping spot in Yosemite", description: "Cathedral lakes", alt: "A tent below a mountain peak", orientation: "portrait", src: "/about/camp-view.JPG" },
  { id: "san-francisco-park", title: "Alamo Square", description: "Alamo square during SF summer", alt: "People relaxing in Alamo Square with San Francisco in the background", orientation: "portrait", src: "/about/san-francisco-park.JPG" },
  { id: "ride-through-the-grass", title: "Chasing the light", description: "The spirit of gravel?", alt: "Cyclist riding through a grassy field", orientation: "portrait", src: "/about/ride-through-the-grass.JPG" },
  { id: "red-wall-bike", title: "Bike against a red wall", description: "My first bike", alt: "A road bike against a red wall", orientation: "portrait", src: "/about/red-wall-bike.JPG" },
  { id: "san-francisco-from-above", title: "The city from above", description: "Exploring Bernal Heights with the gf", alt: "San Francisco skyline from a grassy hill", orientation: "portrait", src: "/about/san-francisco-from-above.JPG" },
];

const captionLines = [
  ["Seeing the milky way for", "the first time in Big Sur"],
  ["Riding out of Stinson", "beach in June"],
  ["Sunset in Kyoto"],
  ["My first road race"],
  ["My new bike!", "Meet Dark Envy (aka Eric)"],
  ["Reading on my ultralight", "chair after making camp"],
  ["Cathedral lakes"],
  ["Alamo square during", "SF summer"],
  ["The spirit of gravel?"],
  ["My first bike"],
  ["Exploring Bernal", "Heights with the gf"],
];

const rotations = [-5, -4, 0, 2, -4, 1, 2, -3, 1, 0, 5];

export function AboutPhotoGallery() {
  const { openPhoto, viewer, selectedId } = usePhotoViewer();
  const [hovered, setHovered] = useState<number | null>(null);
  const [focused, setFocused] = useState<number | null>(null);
  const active = focused ?? hovered;
  let character = 0;
  return (
    <>
    <section className="about-page__gallery life-gallery" aria-labelledby="about-gallery-title">
      <h2 id="about-gallery-title">Recents from life</h2>
      <div className="life-gallery__viewport">
        {active !== null && (
          <p className="life-gallery__caption" key={active} aria-hidden="true">
            {captionLines[active].map((line, lineIndex) => (
              <span className="life-print__line" key={lineIndex}>
                {Array.from(line).map((letter) => {
                  const position = character++;
                  return <span className="life-print__letter" key={position} style={{ "--letter-index": position } as CSSProperties}>{letter}</span>;
                })}
              </span>
            ))}
          </p>
        )}
        <div className="life-gallery__track">
          {lifePhotos.map((photo, index) => {
            return (
              <figure
                key={photo.id}
                className="life-print"
                aria-label={photo.description}
                style={{ "--print-angle": `${rotations[index]}deg` } as CSSProperties}
                onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(index); }}
                onPointerLeave={() => setHovered((current) => (current === index ? null : current))}
                onFocus={(event) => { if (event.target.matches(":focus-visible")) setFocused(index); }}
                onBlur={() => setFocused((current) => (current === index ? null : current))}
              >
                <div className="life-print__composition">
                  <button className="life-print__paper" type="button" aria-label={`Open ${photo.title}`} aria-haspopup="dialog"
                    style={{ visibility: selectedId === photo.id ? "hidden" : undefined }}
                    onClick={(event) => {
                      const image = event.currentTarget.querySelector("img")!;
                      openPhoto({ id: photo.id, src: photo.src, label: photo.alt, ratio: image.naturalWidth / image.naturalHeight || 2 / 3, frame: "film" }, event.currentTarget, event.detail !== 0, image,
                        lifePhotos.map((item) => ({ id: item.id, src: item.src, label: item.alt, ratio: 2 / 3, frame: "film" })));
                    }}>
                    <Image src={photo.src} alt={photo.alt} width={900} height={1200} sizes="180px" unoptimized draggable={false} />
                  </button>
                  <figcaption className="sr-only">{photo.description}</figcaption>
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
