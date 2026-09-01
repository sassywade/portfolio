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
  src: string;
};

const funPhotos: PhotoSlot[] = [
  {
    id: "alpine-forest", label: "01 / outdoors", title: "Into the trees.", caption: "a ride through the redwoods", alt: "Cyclist riding through a foggy forest", orientation: "landscape", src: "/about/alpine-forest.jpeg",
  },
  {
    id: "alpine-flowers", label: "02 / cycling", title: "The scenic route.", caption: "somewhere in bloom", alt: "Cyclist riding through a field of flowers", orientation: "landscape", src: "/about/alpine-flowers.jpeg",
  },
  {
    id: "tuolumne-lake", label: "03 / hiking", title: "Worth the walk.", caption: "Tuolumne Meadows", alt: "Hikers beside a mountain lake", orientation: "landscape", src: "/about/tuolumne-lake.jpg",
  },
  {
    id: "roadside-ride", label: "04 / cycling", title: "Pulling over for the view.", caption: "a rainy roadside stop", alt: "Cyclist standing with a bike beside a mountain road", orientation: "portrait", src: "/about/roadside-ride.JPG",
  },
  {
    id: "coastal-coffee", label: "05 / weekends", title: "Coffee tastes better outside.", caption: "somewhere by the Pacific", alt: "Person drinking coffee beside a coastal overlook", orientation: "portrait", src: "/about/coastal-coffee.JPG",
  },
  {
    id: "picnic-stop", label: "06 / weekends", title: "A good place to stop.", caption: "lunch between rides", alt: "Friends taking a break at a picnic table", orientation: "portrait", src: "/about/picnic-stop.JPG",
  },
  {
    id: "autumn-ridge", label: "07 / outdoors", title: "Fall found us.", caption: "a ridge in October", alt: "An autumn-covered mountain ridge", orientation: "portrait", src: "/about/autumn-ridge.JPG",
  },
  {
    id: "red-building", label: "08 / wandering", title: "Good color, good day.", caption: "a walk through the city", alt: "Bright red and yellow city buildings", orientation: "portrait", src: "/about/red-building.jpg",
  },
  {
    id: "ride-through-the-grass", label: "09 / cycling", title: "Chasing the light.", caption: "an evening ride", alt: "Cyclist riding through a grassy field", orientation: "landscape", src: "/about/ride-through-the-grass.JPG",
  },
  {
    id: "high-country-friends", label: "10 / hiking", title: "Made it up here.", caption: "high country with friends", alt: "Two friends hiking in the mountains", orientation: "landscape", src: "/about/high-country-friends.JPG",
  },
  {
    id: "high-country-hike", label: "11 / hiking", title: "Keep going up.", caption: "granite and blue skies", alt: "Two hikers in front of a mountain", orientation: "landscape", src: "/about/high-country-hike.JPG",
  },
  {
    id: "san-francisco-park", label: "12 / home", title: "The neighborhood view.", caption: "San Francisco", alt: "People relaxing in a San Francisco park", orientation: "landscape", src: "/about/san-francisco-park.JPG",
  },
  {
    id: "san-francisco-sunday", label: "13 / home", title: "A Sunday in the city.", caption: "looking out from Alamo Square", alt: "San Francisco skyline above colorful homes", orientation: "portrait", src: "/about/san-francisco-sunday.JPG",
  },
  {
    id: "race-day", label: "14 / cycling", title: "Race day energy.", caption: "bikes, friends, and a little mud", alt: "Two cyclists at a cycling event", orientation: "landscape", src: "/about/race-day.JPG",
  },
  {
    id: "ride-day", label: "15 / cycling", title: "Out with the crew.", caption: "a very good morning", alt: "Cyclists riding together", orientation: "portrait", src: "/about/ride-day.JPG",
  },
  {
    id: "tokyo-neon", label: "16 / travel", title: "Finding a new corner.", caption: "Tokyo after rain", alt: "Person standing on a Tokyo street", orientation: "portrait", src: "/about/tokyo-neon.JPG",
  },
  {
    id: "tokyo-street", label: "17 / travel", title: "A little lost in Tokyo.", caption: "rainy streets and good signs", alt: "Person standing on a Tokyo street with an umbrella", orientation: "landscape", src: "/about/tokyo-street.JPG",
  },
  {
    id: "a-little-note", label: "18 / people", title: "A little note.", caption: "the best kind of welcome", alt: "Two friends holding a handmade sign", orientation: "portrait", src: "/about/a-little-note.jpeg",
  },
  {
    id: "bike-in-the-meadow", label: "19 / cycling", title: "Parked for a minute.", caption: "bike in the meadow", alt: "A road bike resting in a flower-covered meadow", orientation: "portrait", src: "/about/bike-in-the-meadow.JPG",
  },
  {
    id: "san-francisco-from-above", label: "20 / home", title: "The city from above.", caption: "San Francisco at golden hour", alt: "San Francisco skyline from a grassy hill", orientation: "portrait", src: "/about/san-francisco-from-above.JPG",
  },
  {
    id: "reading-outside", label: "21 / outdoors", title: "Taking five.", caption: "a book in the mountains", alt: "Person reading in a chair outdoors", orientation: "portrait", src: "/about/reading-outside.JPG",
  },
  {
    id: "red-wall-bike", label: "22 / cycling", title: "Bike against a red wall.", caption: "simple things", alt: "A road bike against a red wall", orientation: "portrait", src: "/about/red-wall-bike.JPG",
  },
  {
    id: "trail-friends", label: "23 / hiking", title: "Bring a friend.", caption: "on the trail", alt: "Two friends hiking in the mountains", orientation: "portrait", src: "/about/trail-friends.JPG",
  },
  {
    id: "pink-sky", label: "24 / travel", title: "Pink skies over there.", caption: "a quiet lookout", alt: "Mountain landscape at sunset", orientation: "portrait", src: "/about/pink-sky.jpg",
  },
  {
    id: "camp-at-the-lake", label: "25 / camping", title: "Basecamp.", caption: "camp beside the lake", alt: "A tent beside an alpine lake and mountain", orientation: "landscape", src: "/about/camp-at-the-lake.JPG",
  },
  {
    id: "camp-view", label: "26 / camping", title: "Waking up here.", caption: "the view from camp", alt: "A tent below a mountain peak", orientation: "portrait", src: "/about/camp-view.JPG",
  },
  {
    id: "mountain-lookout", label: "27 / hiking", title: "Take in the whole thing.", caption: "a mountain lookout", alt: "Person looking at a mountain landscape", orientation: "portrait", src: "/about/mountain-lookout.JPG",
  },
  {
    id: "ride-closeup", label: "28 / cycling", title: "The close-up.", caption: "somewhere on the coast", alt: "Cyclists riding on a coastal road", orientation: "portrait", src: "/about/ride-closeup.JPG",
  },
  {
    id: "iceland-jump", label: "29 / travel", title: "Why not.", caption: "a jump in Iceland", alt: "Two people jumping in front of a mountain landscape", orientation: "landscape", src: "/about/iceland-jump.JPG",
  },
  {
    id: "stars-over-camp", label: "30 / camping", title: "Stay out late.", caption: "stars over camp", alt: "A glowing tent beneath a starry sky", orientation: "portrait", src: "/about/stars-over-camp.jpeg",
  },
];

function FilmPhoto({ photo, onOpen }: { photo: PhotoSlot; onOpen: () => void }) {
  return (
    <button
      className={`film-photo film-photo--${photo.orientation}`}
      type="button"
      onClick={onOpen}
      aria-label={`Open ${photo.title}`}
      data-cuelume-toggle="pulse"
    >
      <span className="film-photo__paper">
        <span className="film-photo__image">
          <Image src={photo.src} alt={photo.alt} width={1200} height={1000} sizes="(max-width: 700px) 76vw, 362px" />
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
    <div className="photo-lightbox__visual">
      <Image src={photo.src} alt={photo.alt} width={1200} height={1000} sizes="(max-width: 700px) 90vw, 900px" />
    </div>
  );
}

export function AboutPhotoGallery() {
  const [filter, setFilter] = useState<"all" | PhotoSlot["orientation"]>("all");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number | null>(null);

  const visiblePhotos = filter === "all"
    ? funPhotos
    : funPhotos.filter((photo) => photo.orientation === filter);

  useEffect(() => {
    if (selectedIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowLeft") {
        setSelectedIndex((current) => current === null ? null : (current + visiblePhotos.length - 1) % visiblePhotos.length);
      }
      if (event.key === "ArrowRight") {
        setSelectedIndex((current) => current === null ? null : (current + 1) % visiblePhotos.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, visiblePhotos.length]);

  const selectedPhoto = selectedIndex === null ? null : visiblePhotos[selectedIndex];

  return (
    <>
      <section className="about-page__gallery" aria-labelledby="about-gallery-title">
        <div className="about-page__gallery-heading">
          <div>
            <p className="about-page__label">The fun stuff</p>
            <h2 id="about-gallery-title">A few things I like to do when I&apos;m not designing.</h2>
          </div>
          <div className="about-page__gallery-filters" aria-label="Filter photos by orientation">
            {(["all", "portrait", "landscape"] as const).map((option) => (
              <button
                key={option}
                type="button"
                className={filter === option ? "is-active" : undefined}
                onClick={() => {
                  setFilter(option);
                  setSelectedIndex(null);
                }}
                aria-pressed={filter === option}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="about-page__gallery-viewport">
          <div className="about-page__gallery-track">
            {visiblePhotos.map((photo, index) => (
              <FilmPhoto key={photo.id} photo={photo} onOpen={() => setSelectedIndex(index)} />
            ))}
          </div>
        </div>

        <p className="about-page__gallery-hint">Scroll to explore · click a photo to make it full screen</p>
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
            onClick={() => setSelectedIndex((selectedIndex + visiblePhotos.length - 1) % visiblePhotos.length)}
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
                ? (current + 1) % visiblePhotos.length
                : (current + visiblePhotos.length - 1) % visiblePhotos.length);
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
            onClick={() => setSelectedIndex((selectedIndex + 1) % visiblePhotos.length)}
            aria-label="Next photo"
          >
            →
          </button>

          <span className="photo-lightbox__counter">
            {String(selectedIndex + 1).padStart(2, "0")} / {String(visiblePhotos.length).padStart(2, "0")}
          </span>
        </div>,
        document.body,
      )}
    </>
  );
}
