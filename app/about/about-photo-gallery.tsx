"use client";

import { createPortal } from "react-dom";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type PhotoSlot = {
  id: string;
  label: string;
  title: string;
  caption: string;
  alt: string;
  orientation: "landscape" | "portrait";
  tone: "sky" | "clay" | "moss" | "sun";
  src?: string;
};

// Replace each optional src with a file in /public/about when you are ready.
const funPhotos: PhotoSlot[] = [
  {
    id: "cycling",
    label: "01 / cycling",
    title: "Two wheels, no agenda.",
    caption: "rides around the Bay",
    alt: "A cycling photo placeholder",
    orientation: "landscape",
    tone: "sky",
  },
  {
    id: "outdoors",
    label: "02 / outdoors",
    title: "Usually somewhere green.",
    caption: "weekends outside",
    alt: "An outdoors photo placeholder",
    orientation: "portrait",
    tone: "moss",
  },
  {
    id: "food",
    label: "03 / food",
    title: "Always down to eat.",
    caption: "a very good table",
    alt: "A food photo placeholder",
    orientation: "landscape",
    tone: "clay",
  },
  {
    id: "travel",
    label: "04 / travel",
    title: "Collecting little detours.",
    caption: "somewhere new",
    alt: "A travel photo placeholder",
    orientation: "portrait",
    tone: "sun",
  },
];

function PhotoPlaceholder() {
  return (
    <div className="film-photo__placeholder" aria-hidden="true">
      <span className="film-photo__placeholder-mark">+</span>
      <span className="film-photo__placeholder-label">add photo</span>
      <span className="film-photo__placeholder-note">/public/about</span>
    </div>
  );
}

function FilmPhoto({ photo, onOpen }: { photo: PhotoSlot; onOpen: () => void }) {
  return (
    <button
      className={`film-photo film-photo--${photo.orientation} film-photo--${photo.tone}`}
      type="button"
      onClick={onOpen}
      aria-label={`Open ${photo.title}`}
      data-cuelume-toggle="pulse"
    >
      <span className="film-photo__paper">
        <span className="film-photo__image">
          {photo.src ? (
            <Image src={photo.src} alt={photo.alt} width={1200} height={1000} sizes="(max-width: 700px) 76vw, 362px" />
          ) : (
            <PhotoPlaceholder />
          )}
        </span>
        <span className="film-photo__caption">
          <span>{photo.label}</span>
          <strong>{photo.caption}</strong>
        </span>
      </span>
    </button>
  );
}

function LightboxPhoto({ photo }: { photo: PhotoSlot }) {
  return (
    <div className={`photo-lightbox__visual photo-lightbox__visual--${photo.tone}`}>
      {photo.src ? (
        <Image src={photo.src} alt={photo.alt} width={1200} height={1000} sizes="(max-width: 700px) 90vw, 900px" />
      ) : (
        <PhotoPlaceholder />
      )}
    </div>
  );
}

export function AboutPhotoGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  const scrollToPhoto = (index: number) => {
    const track = trackRef.current;
    const firstCard = track?.querySelector<HTMLElement>(".film-photo");
    if (!track || !firstCard) return;

    const gap = Number.parseFloat(getComputedStyle(track).columnGap || "0") || 0;
    const nextIndex = Math.max(0, Math.min(index, funPhotos.length - 1));
    track.scrollTo({
      left: nextIndex * (firstCard.offsetWidth + gap),
      behavior: "smooth",
    });
    setActiveIndex(nextIndex);
  };

  const showPrevious = () => scrollToPhoto(activeIndex - 1);
  const showNext = () => scrollToPhoto(activeIndex + 1);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleScroll = () => {
      const firstCard = track.querySelector<HTMLElement>(".film-photo");
      if (!firstCard) return;
      const gap = Number.parseFloat(getComputedStyle(track).columnGap || "0") || 0;
      const nextIndex = Math.round(track.scrollLeft / (firstCard.offsetWidth + gap));
      setActiveIndex(Math.max(0, Math.min(nextIndex, funPhotos.length - 1)));
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    return () => track.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (selectedIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) => current === null ? null : (current + funPhotos.length - 1) % funPhotos.length);
      }
      if (event.key === "ArrowRight") {
        setSelectedIndex((current) => current === null ? null : (current + 1) % funPhotos.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]);

  const selectedPhoto = selectedIndex === null ? null : funPhotos[selectedIndex];

  return (
    <>
      <section className="about-page__gallery" aria-labelledby="about-gallery-title">
        <div className="about-page__gallery-heading">
          <div>
            <p className="about-page__label">The fun stuff</p>
            <h2 id="about-gallery-title">A few things I like to do when I&apos;m not designing.</h2>
          </div>
          <div className="about-page__gallery-controls" aria-label="Photo carousel controls">
            <span className="about-page__gallery-count" aria-live="polite">
              {String(activeIndex + 1).padStart(2, "0")} / {String(funPhotos.length).padStart(2, "0")}
            </span>
            <button type="button" onClick={showPrevious} disabled={activeIndex === 0} aria-label="Previous photo">←</button>
            <button type="button" onClick={showNext} disabled={activeIndex === funPhotos.length - 1} aria-label="Next photo">→</button>
          </div>
        </div>

        <div className="about-page__gallery-viewport">
          <div className="about-page__gallery-track" ref={trackRef}>
            {funPhotos.map((photo, index) => (
              <FilmPhoto key={photo.id} photo={photo} onOpen={() => setSelectedIndex(index)} />
            ))}
          </div>
        </div>

        <p className="about-page__gallery-hint">Swipe to explore · click a photo to make it full screen</p>
      </section>

      {selectedPhoto && createPortal(
        <div
          className="photo-lightbox"
          role="dialog"
          aria-modal="true"
          aria-labelledby="photo-lightbox-title"
        >
          <button
            className="photo-lightbox__close"
            type="button"
            onClick={() => setSelectedIndex(null)}
            aria-label="Close photo viewer"
            ref={closeButtonRef}
          >
            <span>Close</span>
            <strong aria-hidden="true">×</strong>
          </button>

          <button
            className="photo-lightbox__arrow photo-lightbox__arrow--previous"
            type="button"
            onClick={() => setSelectedIndex((selectedIndex + funPhotos.length - 1) % funPhotos.length)}
            aria-label="Previous photo"
          >
            ←
          </button>

          <figure
            className="photo-lightbox__figure"
            onTouchStart={(event) => {
              touchStartX.current = event.changedTouches[0]?.clientX ?? null;
            }}
            onTouchEnd={(event) => {
              const startX = touchStartX.current;
              const endX = event.changedTouches[0]?.clientX;
              touchStartX.current = null;
              if (startX === null || endX === undefined || Math.abs(endX - startX) < 48) return;
              setSelectedIndex((current) => current === null ? null : endX < startX
                ? (current + 1) % funPhotos.length
                : (current + funPhotos.length - 1) % funPhotos.length);
            }}
          >
            <LightboxPhoto photo={selectedPhoto} />
            <figcaption>
              <span>{selectedPhoto.label}</span>
              <h2 id="photo-lightbox-title">{selectedPhoto.title}</h2>
              <p>{selectedPhoto.caption}</p>
            </figcaption>
          </figure>

          <button
            className="photo-lightbox__arrow photo-lightbox__arrow--next"
            type="button"
            onClick={() => setSelectedIndex((selectedIndex + 1) % funPhotos.length)}
            aria-label="Next photo"
          >
            →
          </button>

          <span className="photo-lightbox__counter">
            {String(selectedIndex + 1).padStart(2, "0")} / {String(funPhotos.length).padStart(2, "0")}
          </span>
        </div>,
        document.body,
      )}
    </>
  );
}
