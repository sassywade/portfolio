"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
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
  { id: "ride-closeup", title: "A good day to ride", description: "Riding back from Stinson beach", alt: "Cyclists riding on a coastal road", orientation: "portrait", src: "/about/ride-closeup.JPG" },
  { id: "pink-sky", title: "A beautiful sunset in Kyoto", description: "The sky turning pink over a quiet street in Kyoto", alt: "A pink sunset over a city street in Kyoto", orientation: "portrait", src: "/about/pink-sky.jpg" },
  { id: "ride-day", title: "Out with the crew", description: "My first road race. #bonked", alt: "Cyclists riding together", orientation: "portrait", src: "/about/ride-day.JPG" },
  { id: "bike-in-the-meadow", title: "Parked for a minute", description: "The new steed", alt: "A road bike resting in a flower-covered meadow", orientation: "portrait", src: "/about/bike-in-the-meadow.JPG" },
  { id: "mountain-lookout", title: "Take in the whole thing", description: "My ultralight chair makes me happy", alt: "Person looking at a mountain landscape", orientation: "portrait", src: "/about/mountain-lookout.JPG" },
  { id: "camp-view", title: "10/10 camping spot in Yosemite", description: "The view from camp after a night beside an alpine lake.", alt: "A tent below a mountain peak", orientation: "portrait", src: "/about/camp-view.JPG" },
  { id: "san-francisco-park", title: "Alamo Square", description: "Alamo square on a beautiful day", alt: "People relaxing in Alamo Square with San Francisco in the background", orientation: "portrait", src: "/about/san-francisco-park.JPG" },
  { id: "ride-through-the-grass", title: "Chasing the light", description: "Shenanigans in fort mason with the boy", alt: "Cyclist riding through a grassy field", orientation: "portrait", src: "/about/ride-through-the-grass.JPG" },
  { id: "red-wall-bike", title: "Bike against a red wall", description: "My first bike :)", alt: "A road bike against a red wall", orientation: "portrait", src: "/about/red-wall-bike.JPG" },
  { id: "san-francisco-from-above", title: "The city from above", description: "Exploring bernal heights with Kelly", alt: "San Francisco skyline from a grassy hill", orientation: "portrait", src: "/about/san-francisco-from-above.JPG" },
];

export function AboutPhotoGallery() {
  const { openPhoto, viewer, selectedId } = usePhotoViewer();
  const galleryRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    gallery.dataset.motionReady = "true";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gallery.dataset.motionVisible = "true";
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        gallery.dataset.motionVisible = "true";
        observer.unobserve(gallery);
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );

    observer.observe(gallery);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className="about-page__gallery" aria-labelledby="about-gallery-title" ref={galleryRef}>
        <h2 id="about-gallery-title">Recents from life</h2>
        <div className="about-page__gallery-viewport">
          <div className="about-page__gallery-track">
            {lifePhotos.map((photo, index) => (
              <button
                key={photo.id}
                className={`film-photo film-photo--${photo.orientation} film-photo--${photo.id}`}
                type="button"
                aria-label={`Open ${photo.title}`}
                aria-haspopup="dialog"
                style={{ "--photo-index": index, visibility: selectedId === photo.id ? "hidden" : undefined } as CSSProperties}
                onClick={(event) => {
                  const image = event.currentTarget.querySelector("img")!;
                  openPhoto({ id: photo.id, src: photo.src, label: photo.alt, ratio: image.naturalWidth / image.naturalHeight || 3 / 4, frame: "film" }, event.currentTarget, event.detail !== 0, image);
                }}
              >
                <span className="film-photo__paper">
                  <span className="film-photo__image">
                    <Image src={photo.src} alt={photo.alt} width={900} height={1200} sizes="(max-width: 700px) 22vw, 84px" unoptimized />
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
      {viewer}
    </>
  );
}
