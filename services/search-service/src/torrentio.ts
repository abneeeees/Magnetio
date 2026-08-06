import type { TorrentioResult } from "../../shared/index";

async function fetchMovies(
  stream_id: string
): Promise<TorrentioResult[]> {
  const stream_url = `https://torrentio.strem.fun/stream/movie/${encodeURIComponent(stream_id)}.json`;
  const response = await fetch(stream_url);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<TorrentioResult[]>;
}

async function fetchSeries(
  stream_id: string,
  stream_season: number,
  stream_episode: number,
): Promise<TorrentioResult[]> {
  const series_stream_url = `https://torrentio.strem.fun/stream/series/${encodeURIComponent(stream_id)}:${encodeURIComponent(stream_season)}:${encodeURIComponent(stream_episode)}.json`;
  const response = await fetch(series_stream_url);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<TorrentioResult[]>;
}

export async function fetchTorrentioList(
  streamType: boolean,
): Promise<TorrentioResult[]> {
  const stream_id = "something";
  const stream_season = 1;
  const stream_episode = 1;

  try {
    if (!streamType) {
      return await fetchMovies(stream_id);
    } else {
      return await fetchSeries(stream_id, stream_season, stream_episode);
    }
  } catch (err) {
    console.error("GET request failed:", err instanceof Error ? err.message : err);
    return [];
  }
}
