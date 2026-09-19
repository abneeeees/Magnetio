import type { TorrentMetaData } from "../config/types"

// Build a magnet link from a 40-char infoHash, appending optional trackers
export function infoHashToMagnet(
  infoHash: string,
  trackers: string[] = []
): string {
  const trParams = trackers
    .map((t) => (t.startsWith("tracker:") ? t.slice("tracker:".length) : t))
    .filter(Boolean)
    .map((t) => `&tr=${encodeURIComponent(t)}`)
    .join("")

  return `magnet:?xt=urn:btih:${infoHash}${trParams}`
}

// Shape raw Torrentio streams into the client-facing {title, infoHash, magnet, fileIdx} objects
function fetchJson(data: TorrentMetaData) {
  if (!data?.streams || !Array.isArray(data.streams)) {
    return []
  }

  return data.streams.map((stream) => {
    return {
      title: stream.title,
      infoHash: stream.infoHash,
      magnet: infoHashToMagnet(stream.infoHash, stream.sources),
      fileIdx: stream.fileIdx,
      sources: stream.sources ?? [],
    }
  })
}

// Hit Torrentio's stream endpoint: /stream/{type}/{id}.json
export async function fetchMetadata(
  streamType: string,
  id: string,
  filterParams?: string,
) {
  const filterPath = filterParams ? `/${filterParams}` : ""
  const fullUrl = `https://torrentio.strem.fun${filterPath}/stream/${streamType}/${id}.json`
  const response = await fetch(fullUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  const data = (await response.json()) as TorrentMetaData
  return fetchJson(data)
}

// CLI entrypoint so this file can be run standalone with `bun src/services/torrent-metadata.ts`
async function main() {
  const ans = await fetchMetadata("movie", "tt0133093")
  console.log(ans)
}

if (import.meta.main) {
  main()
}