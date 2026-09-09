"use client";

import { createPortal } from "react-dom";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

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
  { id: "high-country-friends", title: "Backpacking Cathedral with Jordan", description: "Backpacking Cathedral with Jordan", alt: "Two friends hiking in the mountains", orientation: "portrait", src: "/about/high-country-friends.JPG" },
  { id: "red-wall-bike", title: "Bike against a red wall", description: "My first bike :)", alt: "A road bike against a red wall", orientation: "portrait", src: "/about/red-wall-bike.JPG" },
  { id: "san-francisco-from-above", title: "The city from above", description: "Exploring bernal heights with Kelly", alt: "San Francisco skyline from a grassy hill", orientation: "portrait", src: "/about/san-francisco-from-above.JPG" },
];

function FilmPhoto({ photo, index, onOpen }: { photo: PhotoSlot; index: number; onOpen: (trigger: HTMLButtonElement) => void }) {
  return (
    <button
      className={`film-photo film-photo--${photo.orientation} film-photo--${photo.id}`}
      type="button"
      onClick={(event) => onOpen(event.currentTarget)}
      aria-label={`Open ${photo.title}`}
      style={{ "--photo-index": index } as CSSProperties}
    >
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
  const [isClosing, setIsClosing] = useState(false);
  const galleryRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const selectedPhoto = selectedIndex === null ? null : lifePhotos[selectedIndex];

  const closePhoto = useCallback(() => {
    if (selectedIndex === null || isClosing) return;

    const finishClose = () => {
      setSelectedIndex(null);
      setIsClosing(false);
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishClose();
      return;
    }

    setIsClosing(true);
    closeTimerRef.current = window.setTimeout(finishClose, 180);
  }, [isClosing, selectedIndex]);

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

  useEffect(() => () => {
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
  }, []);

  useEffect(() => {
    if (selectedIndex === null) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePhoto();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closePhoto, selectedIndex]);

  const openPhoto = (index: number, trigger: HTMLButtonElement) => {
    if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
    triggerRef.current = trigger;
    setIsClosing(false);
    setSelectedIndex(index);
  };

  return (
    <>
      <section className="about-page__gallery" aria-labelledby="about-gallery-title" ref={galleryRef}>
        <h2 id="about-gallery-title">Life</h2>
        <div className="about-page__gallery-viewport">
          <div className="about-page__gallery-track">
            {lifePhotos.map((photo, index) => <FilmPhoto key={photo.id} photo={photo} index={index} onOpen={(trigger) => openPhoto(index, trigger)} />)}
          </div>
        </div>
      </section>

      {selectedPhoto && createPortal(
        <div className="photo-lightbox" data-state={isClosing ? "closing" : "open"} role="dialog" aria-modal="true" aria-label={selectedPhoto.description}>
          <button className="photo-lightbox__backdrop" type="button" tabIndex={-1} onClick={closePhoto} aria-label="Close photo viewer" />
          <button className="photo-lightbox__close" type="button" onClick={closePhoto} aria-label="Close photo viewer" ref={closeButtonRef}>
            <span>Close</span><strong aria-hidden="true">×</strong>
          </button>
          <figure className="photo-lightbox__figure">
            <div className="photo-lightbox__visual">
              <Image src={selectedPhoto.src} alt={selectedPhoto.alt} width={1800} height={1400} sizes="90vw" unoptimized priority />
            </div>
            <figcaption>
              <p>{selectedPhoto.description}</p>
            </figcaption>
          </figure>
        </div>,
        document.body,
      )}
    </>
  );
}
