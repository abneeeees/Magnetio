export interface MediaItem {
  id: string;
  imdb_id?: string;
  type: "movie" | "series";
  name: string;
  poster?: string;
  background?: string;
  releaseInfo?: string;
  description?: string;
  genre?: string[];
  cast?: string[];
}

export interface TorrentStream {
  title: string;
  infoHash: string;
  magnet: string;
  fileIdx?: number;
  sources?: string[];
}

export interface ParsedStreamInfo {
  quality: string;
  size: string;
  seeders: string;
  provider: string;
  rawTitle: string;
}

// cleans the title part of the torrent metadata to extract useful info
export function parseStreamTitle(title: string): ParsedStreamInfo {
  const lines = title.split("\n").map((l) => l.trim());
  const header = lines[0] || "";
  const sub = lines[1] || "";

  // Extract quality
  let quality = "HD";
  if (
    header.includes("2160p") ||
    header.includes("4k") ||
    header.includes("4K") ||
    header.includes("UHD")
  ) {
    quality = "4K";
  } else if (header.includes("1080p") || header.includes("FHD")) {
    quality = "1080p";
  } else if (header.includes("720p")) {
    quality = "720p";
  } else if (header.includes("480p") || header.includes("SD")) {
    quality = "480p";
  }

  // Extract seeders and size
  let seeders = "—";
  let size = "—";
  let provider = "P2P";

  const seederMatch = title.match(/👤\s*(\d+)/);
  if (seederMatch) seeders = seederMatch[1];

  const sizeMatch = title.match(/💾\s*([\d\.]+\s*[GMK]B)/i);
  if (sizeMatch) size = sizeMatch[1];

  const providerMatch = title.match(/⚙️\s*([^\n]+)/);
  if (providerMatch) provider = providerMatch[1];

  return {
    quality,
    size,
    seeders,
    provider,
    rawTitle: header || sub || title,
  };
}

export interface SeriesEpisode {
  episodeNumber: number;
  name: string;
}

export interface SeriesSeason {
  seasonNumber: number;
  name: string;
  episodeCount: number;
  episodes: SeriesEpisode[];
}

export interface SeriesDetails {
  id: string;
  name: string;
  totalSeasons: number;
  totalEpisodes: number;
  seasons: SeriesSeason[];
}
