import { MediaItem, TorrentStream } from "@/types";

export const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

const CINEMETA_TOP_MOVIES = "https://cinemeta-catalogs.strem.io/top/catalog/movie/top.json";
const CINEMETA_TOP_SERIES = "https://cinemeta-catalogs.strem.io/top/catalog/series/top.json";

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

export async function searchMedia(query: string, type: "movie" | "series" = "movie"): Promise<MediaItem[]> {
  if (!query.trim()) return [];

  // Check if direct IMDb ID was provided
  const cleanQuery = query.trim();
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
  episode?: number
): Promise<TorrentStream[]> {
  const mediaId =
    type === "series" && season && episode ? `${id}:${season}:${episode}` : id;

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
