"use client";

import { useEffect, useState } from "react";

type NowPlayingTrack = {
  title: string;
  artist: string;
  album: string;
  imageUrl: string | null;
  spotifyUrl: string | null;
  progressMs: number;
  durationMs: number;
};

type NowPlayingPayload = {
  configured: boolean;
  isPlaying: boolean;
  track: NowPlayingTrack | null;
  profileUrl: string | null;
};

const EMPTY_PAYLOAD: NowPlayingPayload = {
  configured: false,
  isPlaying: false,
  track: null,
  profileUrl: null,
};

function getStatus(data: NowPlayingPayload, isLoading: boolean) {
  if (isLoading) return "tuning in...";
  if (data.track && data.isPlaying) return "spinning now";
  if (data.track) return "paused in the pocket";
  if (data.configured) return "a tiny intermission";
  return "waiting for the main character";
}

export function NowPlaying() {
  const [data, setData] = useState<NowPlayingPayload>(EMPTY_PAYLOAD);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch("/api/spotify/now-playing", {
          cache: "no-store",
        });

        if (!response.ok) throw new Error("Spotify request failed");

        const nextData = (await response.json()) as NowPlayingPayload;
        if (!cancelled) setData(nextData);
      } catch {
        if (!cancelled) setData(EMPTY_PAYLOAD);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    load();
    const interval = window.setInterval(load, 30_000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const track = data.track;
  const progress = track?.durationMs
    ? Math.min(100, Math.round((track.progressMs / track.durationMs) * 100))
    : 0;
  const status = getStatus(data, isLoading);

  return (
    <article className="about-current-card about-current-card--spotify" aria-labelledby="about-now-playing-title">
      <div className="about-current-card__topline">
        <span>now playing</span>
        <span>01 / 02</span>
      </div>

      <div className="about-current-card__main about-now-playing__main">
        <div className="about-now-playing__art" aria-hidden={track?.imageUrl ? undefined : true}>
          {track?.imageUrl ? (
            <img src={track.imageUrl} alt={`Album artwork for ${track.album}`} />
          ) : (
            <div className="about-now-playing__fallback-disc">
              <span>♪</span>
            </div>
          )}
          <span className="about-now-playing__art-label">live-ish</span>
        </div>

        <div className="about-current-card__copy">
          <p className="about-current-card__status" aria-live="polite">
            {status}
          </p>
          <h2 id="about-now-playing-title">
            {track?.title ?? "No song? Tragic."}
          </h2>
          <p>
            {track
              ? `${track.artist} · ${track.album}`
              : "Spotify is taking a tiny intermission. Check back when the soundtrack returns."}
          </p>
        </div>
      </div>

      <div className="about-current-card__footer">
        <div className="about-now-playing__progress" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="about-current-card__footer-row">
          <span className="about-now-playing__bars" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
          <span>refreshes every 30 sec</span>
          {(track?.spotifyUrl ?? data.profileUrl) ? (
            <a
              href={track?.spotifyUrl ?? data.profileUrl ?? undefined}
              target="_blank"
              rel="noreferrer"
            >
              open Spotify ↗
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
