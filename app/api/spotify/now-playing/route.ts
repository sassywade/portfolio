import { env } from "cloudflare:workers";

type SpotifyImage = {
  url?: unknown;
};

type SpotifyItem = {
  type?: unknown;
  name?: unknown;
  artists?: Array<{ name?: unknown }>;
  album?: { name?: unknown; images?: SpotifyImage[] };
  show?: { name?: unknown; images?: SpotifyImage[] };
  external_urls?: { spotify?: unknown };
  duration_ms?: unknown;
};

type SpotifyPlayback = {
  is_playing?: unknown;
  progress_ms?: unknown;
  item?: SpotifyItem | null;
};

type SpotifyTokenResponse = {
  access_token?: unknown;
};

const JSON_HEADERS = {
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
};

function json(data: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: JSON_HEADERS,
  });
}

function getRuntimeEnv() {
  return env as unknown as Record<string, string | undefined>;
}

function emptyResponse(configured: boolean, profileUrl: string | null) {
  return json({ configured, isPlaying: false, track: null, profileUrl });
}

export async function GET() {
  const runtimeEnv = getRuntimeEnv();
  const clientId = runtimeEnv.SPOTIFY_CLIENT_ID;
  const clientSecret = runtimeEnv.SPOTIFY_CLIENT_SECRET;
  const refreshToken = runtimeEnv.SPOTIFY_REFRESH_TOKEN;
  const profileUrl = runtimeEnv.SPOTIFY_PROFILE_URL ?? null;
  const configured = Boolean(clientId && clientSecret && refreshToken);

  if (!configured) return emptyResponse(false, profileUrl);

  try {
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    });

    if (!tokenResponse.ok) return emptyResponse(true, profileUrl);

    const token = (await tokenResponse.json()) as SpotifyTokenResponse;
    if (typeof token.access_token !== "string") return emptyResponse(true, profileUrl);

    const playbackResponse = await fetch(
      "https://api.spotify.com/v1/me/player?additional_types=track,episode",
      {
        headers: { Authorization: `Bearer ${token.access_token}` },
      },
    );

    if (playbackResponse.status === 204 || !playbackResponse.ok) {
      return emptyResponse(true, profileUrl);
    }

    const playback = (await playbackResponse.json()) as SpotifyPlayback;
    const item = playback.item;
    if (!item || typeof item.name !== "string") return emptyResponse(true, profileUrl);

    const imageSource = item.album?.images?.[0]?.url ?? item.show?.images?.[0]?.url;
    const artist = Array.isArray(item.artists)
      ? item.artists
          .map((entry) => (typeof entry.name === "string" ? entry.name : null))
          .filter((name): name is string => Boolean(name))
          .join(", ")
      : "Spotify";
    const album =
      (typeof item.album?.name === "string" && item.album.name) ||
      (typeof item.show?.name === "string" && item.show.name) ||
      (item.type === "episode" ? "Podcast episode" : "Single");

    return json({
      configured: true,
      isPlaying: playback.is_playing === true,
      profileUrl,
      track: {
        title: item.name,
        artist: artist || "Spotify",
        album,
        imageUrl: typeof imageSource === "string" ? imageSource : null,
        spotifyUrl:
          typeof item.external_urls?.spotify === "string"
            ? item.external_urls.spotify
            : null,
        progressMs: typeof playback.progress_ms === "number" ? playback.progress_ms : 0,
        durationMs: typeof item.duration_ms === "number" ? item.duration_ms : 0,
      },
    });
  } catch {
    return emptyResponse(true, profileUrl);
  }
}
