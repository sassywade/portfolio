"use client";

import { createPortal } from "react-dom";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type PhotoSlot = {
  id: string;
  title: string;
  description: string;
  alt: string;
  orientation: "landscape" | "portrait";
  src: string;
};

const lifePhotos: PhotoSlot[] = [
  { id: "stars-over-camp", title: "A night under the stars", description: "A glowing tent beneath a sky full of stars, somewhere out in the mountains.", alt: "A glowing tent beneath a starry sky", orientation: "portrait", src: "/about/stars-over-camp.jpeg" },
  { id: "ride-closeup", title: "A good day to ride", description: "A close-up from a long ride along the coast.", alt: "Cyclists riding on a coastal road", orientation: "portrait", src: "/about/ride-closeup.JPG" },
  { id: "pink-sky", title: "A beautiful sunset in Kyoto", description: "The sky turning pink over a quiet street in Kyoto.", alt: "A pink sunset over a city street in Kyoto", orientation: "portrait", src: "/about/pink-sky.jpg" },
  { id: "ride-day", title: "Out with the crew", description: "A morning on the road with good company and too many bikes.", alt: "Cyclists riding together", orientation: "portrait", src: "/about/ride-day.JPG" },
  { id: "bike-in-the-meadow", title: "Parked for a minute", description: "A bike resting in a meadow between rides.", alt: "A road bike resting in a flower-covered meadow", orientation: "portrait", src: "/about/bike-in-the-meadow.JPG" },
  { id: "mountain-lookout", title: "Take in the whole thing", description: "A quiet lookout with granite, trees, and a lot of sky.", alt: "Person looking at a mountain landscape", orientation: "portrait", src: "/about/mountain-lookout.JPG" },
  { id: "camp-view", title: "Waking up here", description: "The view from camp after a night beside an alpine lake.", alt: "A tent below a mountain peak", orientation: "portrait", src: "/about/camp-view.JPG" },
  { id: "san-francisco-park", title: "Alamo Square", description: "A sunny afternoon in the park with San Francisco in the background.", alt: "People relaxing in Alamo Square with San Francisco in the background", orientation: "portrait", src: "/about/san-francisco-park.JPG" },
  { id: "ride-through-the-grass", title: "Chasing the light", description: "An evening ride through dry grass and soft California light.", alt: "Cyclist riding through a grassy field", orientation: "landscape", src: "/about/ride-through-the-grass.JPG" },
  { id: "high-country-friends", title: "Made it up here", description: "A high-country hike with a friend.", alt: "Two friends hiking in the mountains", orientation: "landscape", src: "/about/high-country-friends.JPG" },
  { id: "red-wall-bike", title: "Bike against a red wall", description: "A simple bike, a bright wall, and a little afternoon sun.", alt: "A road bike against a red wall", orientation: "portrait", src: "/about/red-wall-bike.JPG" },
  { id: "san-francisco-from-above", title: "The city from above", description: "Looking out over the city from a grassy hillside.", alt: "San Francisco skyline from a grassy hill", orientation: "portrait", src: "/about/san-francisco-from-above.JPG" },
];

function FilmPhoto({ photo, onOpen }: { photo: PhotoSlot; onOpen: () => void }) {
  return (
    <button className={`film-photo film-photo--${photo.orientation} film-photo--${photo.id}`} type="button" onClick={onOpen} aria-label={`Open ${photo.title}`}>
      <span className="film-photo__paper">
        <span className="film-photo__image">
          <Image src={photo.src} alt={photo.alt} width={900} height={1200} sizes="(max-width: 700px) 22vw, 84px" unoptimized />
        </span>
      </span>
    </button>
  );
}

export function AboutPhotoGallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const selectedPhoto = selectedIndex === null ? null : lifePhotos[selectedIndex];

  useEffect(() => {
    if (selectedIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]);

  return (
    <>
      <section className="about-page__gallery" aria-labelledby="about-gallery-title">
        <h2 id="about-gallery-title">Lifemax</h2>
        <div className="about-page__gallery-viewport">
          <div className="about-page__gallery-track">
            {lifePhotos.map((photo, index) => <FilmPhoto key={photo.id} photo={photo} onOpen={() => setSelectedIndex(index)} />)}
          </div>
        </div>
      </section>

      {selectedPhoto && createPortal(
        <div className="photo-lightbox" role="dialog" aria-modal="true" aria-labelledby="photo-lightbox-title" onClick={() => setSelectedIndex(null)}>
          <button className="photo-lightbox__close" type="button" onClick={() => setSelectedIndex(null)} aria-label="Close photo viewer" ref={closeButtonRef}>
            <span>Close</span><strong aria-hidden="true">×</strong>
          </button>
          <figure className="photo-lightbox__figure" onClick={(event) => event.stopPropagation()}>
            <div className="photo-lightbox__visual">
              <Image src={selectedPhoto.src} alt={selectedPhoto.alt} width={1800} height={1400} sizes="90vw" unoptimized priority />
            </div>
            <figcaption>
              <h2 id="photo-lightbox-title">{selectedPhoto.title}</h2>
              <p>{selectedPhoto.description}</p>
            </figcaption>
          </figure>
        </div>,
        document.body,
      )}
    </>
  );
}
