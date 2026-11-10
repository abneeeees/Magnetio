import { MediaItem, SeriesDetails, SeriesSeason, TorrentStream } from "@/types";

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

const CINEMETA_TOP_MOVIES = "https://cinemeta-catalogs.strem.io/top/catalog/movie/top.json";
const CINEMETA_TOP_SERIES = "https://cinemeta-catalogs.strem.io/top/catalog/series/top.json";
const CINEMETA_META_SERIES = "https://v3-cinemeta.strem.io/meta/series";

interface CinemetaVideo {
  name?: string;
  season?: number | string;
  number?: number | string;
  episode?: number | string;
}

export async function fetchPopularMedia(type: "movie" | "series" = "movie"): Promise<MediaItem[]> {
  const url = type === "movie" ? CINEMETA_TOP_MOVIES : CINEMETA_TOP_SERIES;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Failed to fetch catalog");
    const data = await res.json();
    return (data.metas || []).map((m: any) => ({
      id: m.imdb_id || m.id,
      imdb_id: m.imdb_id || m.id,
      type: m.type || type,
      name: m.name,
      poster: m.poster,
      background: m.background,
      releaseInfo: m.releaseInfo || m.year,
      description: m.description,
      genre: m.genre || [],
      cast: m.cast || [],
    }));
  } catch (error) {
    console.error("Error fetching popular media:", error);
    return [];
  }
}

export async function searchMedia(
  query: string,
  type: "movie" | "series" = "movie",
): Promise<MediaItem[]> {
  if (!query.trim()) return [];

  // Check if direct IMDb ID was provided
  const cleanQuery = query.trim();

  // Check if direct IMDb ID was provided
  if (/^tt\d{7,8}$/.test(cleanQuery)) {
    try {
      const res = await fetch(`https://v3-cinemeta.strem.io/meta/${type}/${cleanQuery}.json`);
      if (res.ok) {
        const data = await res.json();
        if (data.meta) {
          const m = data.meta;
          return [
            {
              id: m.imdb_id || m.id,
              imdb_id: m.imdb_id || m.id,
              type: m.type || type,
              name: m.name,
              poster: m.poster,
              background: m.background,
              releaseInfo: m.releaseInfo || m.year,
              description: m.description,
              genre: m.genre || [],
              cast: m.cast || [],
            },
          ];
        }
      }
    } catch {
      // Fallback
    }
  }

  const url = `https://v3-cinemeta.strem.io/catalog/${type}/top/search=${encodeURIComponent(cleanQuery)}.json`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Search failed");
    const data = await res.json();
    return (data.metas || []).map((m: any) => ({
      id: m.imdb_id || m.id,
      imdb_id: m.imdb_id || m.id,
      type: m.type || type,
      name: m.name,
      poster: m.poster,
      background: m.background,
      releaseInfo: m.releaseInfo || m.year,
      description: m.description,
      genre: m.genre || [],
      cast: m.cast || [],
    }));
  } catch (error) {
    console.error("Error searching media:", error);
    return [];
  }
}

export async function fetchStreams(
  type: string,
  id: string,
  season?: number,
  episode?: number,
): Promise<TorrentStream[]> {
  const mediaId =
    type === "series" && season != null && episode != null ? `${id}:${season}:${episode}` : id;

  const res = await fetch(`${BACKEND_URL}/metadata/${type}/${mediaId}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to fetch streams (${res.status})`);
  }
  return res.json();
}

export function buildStreamUrl(infoHash: string, _magnet?: string, fileIdx?: number): string {
  // If infoHash is a full magnet URI, extract the 40-character infoHash
  let hash = infoHash.trim();
  if (hash.startsWith("magnet:?")) {
    const match = hash.match(/xt=urn:btih:([a-fA-F0-9]{40})/i);
    if (match) hash = match[1];
  }

  const params = new URLSearchParams();
  if (fileIdx !== undefined && fileIdx !== null && !isNaN(fileIdx)) {
    params.set("fileIdx", String(fileIdx));
  }

  const query = params.toString();
  return `${BACKEND_URL}/stream/${hash}${query ? `?${query}` : ""}`;
}

// Authenticated User API calls
export async function fetchWatchHistory(token: string) {
  const res = await fetch(`${BACKEND_URL}/user/history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch watch history");
  const data = await res.json();
  return data.history || [];
}

export async function saveWatchProgress(
  token: string,
  progress: {
    mediaId: string;
    title: string;
    mediaType?: string;
    seasonNum?: number | null;
    episodeNum?: number | null;
    currentTime: number;
    duration: number;
    completed?: boolean;
    posterUrl?: string | null;
  },
) {
  const res = await fetch(`${BACKEND_URL}/user/history`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(progress),
  });
  if (!res.ok) throw new Error("Failed to save progress");
  return res.json();
}

async function readApiError(res: Response, fallback: string): Promise<string> {
  const data = await res.json().catch(() => ({}) as { error?: string });
  return data.error || fallback;
}

export async function fetchWatchlist(token: string) {
  const res = await fetch(`${BACKEND_URL}/user/watchlist`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(await readApiError(res, "Failed to fetch watchlist"));
  const data = await res.json();
  return data.watchlist || [];
}

export async function addToWatchlist(
  token: string,
  item: {
    mediaId: string;
    title: string;
    mediaType?: string;
    posterUrl?: string | null;
    releaseInfo?: string | null;
  },
) {
  const res = await fetch(`${BACKEND_URL}/user/watchlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error(await readApiError(res, "Failed to add to watchlist"));
  return res.json();
}

export async function removeFromWatchlist(token: string, mediaId: string) {
  const res = await fetch(`${BACKEND_URL}/user/watchlist/${encodeURIComponent(mediaId)}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(await readApiError(res, "Failed to remove from watchlist"));
  return res.json();
}

export async function getSeriesDetails(mediaId: string): Promise<SeriesDetails> {
  const response = await fetch(`${CINEMETA_META_SERIES}/${encodeURIComponent(mediaId)}.json`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch series details (${response.status})`);
  }

  const data = await response.json();
  const meta = data?.meta;
  const videos: CinemetaVideo[] = Array.isArray(meta?.videos) ? meta.videos : [];

  if (!meta || videos.length === 0) {
    throw new Error("No season or episode information is available for this series.");
  }

  const seasonsByNumber = new Map<number, SeriesSeason>();

  for (const video of videos) {
    const seasonNumber = Number(video.season);
    const episodeNumber = Number(video.episode ?? video.number);

    if (!Number.isFinite(seasonNumber) || !Number.isFinite(episodeNumber)) continue;

    let season = seasonsByNumber.get(seasonNumber);
    if (!season) {
      season = {
        seasonNumber,
        name: seasonNumber === 0 ? "Specials" : `Season ${seasonNumber}`,
        episodeCount: 0,
        episodes: [],
      };
      seasonsByNumber.set(seasonNumber, season);
    }

    if (season.episodes.some((episode) => episode.episodeNumber === episodeNumber)) continue;

    season.episodes.push({
      episodeNumber,
      name: video.name?.trim() || `Episode ${episodeNumber}`,
    });
  }

  const seasons = [...seasonsByNumber.values()]
    .sort((a, b) => a.seasonNumber - b.seasonNumber)
    .map((season) => {
      const episodes = season.episodes.sort((a, b) => a.episodeNumber - b.episodeNumber);
      return { ...season, episodes, episodeCount: episodes.length };
    });

  if (seasons.length === 0) {
    throw new Error("No season or episode information is available for this series.");
  }

  const regularSeasons = seasons.filter((season) => season.seasonNumber > 0);

  return {
    id: String(meta.imdb_id || meta.id || mediaId),
    name: meta.name || mediaId,
    totalSeasons: regularSeasons.length,
    totalEpisodes: regularSeasons.reduce((total, season) => total + season.episodeCount, 0),
    seasons,
  };
}
