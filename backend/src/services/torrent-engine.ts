import type { Torrent, TorrentFile } from "webtorrent"
import WebTorrent from "webtorrent"
import crypto from "node:crypto"

// Single shared client so multiple streams reuse the same peer pool
const opts = {
  maxConns: 55,
  peerId: crypto.randomBytes(20),
  nodeId: crypto.randomBytes(20),
  tracker: true,
  dht: true,
  webSeeds: true,
}

export const client = new WebTorrent(opts)

client.on("error", (err) => {
  console.error("WebTorrent client error:", err instanceof Error ? err.message : String(err))
})

export const VIDEO_EXTENSIONS = [".mkv", ".mp4", ".avi", ".webm", ".mov", ".m4v", ".wmv"]

const MIME_TYPES: Record<string, string> = {
  ".mp4": "video/mp4",
  ".m4v": "video/mp4",
  ".mkv": "video/x-matroska",
  ".webm": "video/webm",
  ".avi": "video/x-msvideo",
  ".mov": "video/quicktime",
  ".wmv": "video/x-ms-wmv",
}

export const DEFAULT_TRACKERS = [
  "udp://tracker.opentrackr.org:1337/announce",
  "udp://open.stealth.si:80/announce",
  "udp://tracker.torrent.eu.org:451/announce",
  "udp://open.demonii.com:1337/announce",
  "udp://tracker.qu.ax:6969/announce",
  "udp://exodus.desync.com:6969/announce",
  "udp://explodie.org:6969/announce",
  "udp://tracker.bittor.pw:1337/announce",
  "http://tracker.opentrackr.org:1337/announce",
  "http://tracker.renfei.net:8080/announce",
]

function normalizeTorrentTarget(target: string): string {
  const trimmed = target.trim()
  if (/^[a-fA-F0-9]{40}$/.test(trimmed)) {
    const trParams = DEFAULT_TRACKERS.map((tr) => `&tr=${encodeURIComponent(tr)}`).join("")
    return `magnet:?xt=urn:btih:${trimmed}${trParams}`
  }
  return trimmed
}

// In-flight map to deduplicate concurrent requests for the same torrent
const torrentPromises = new Map<string, Promise<Torrent>>()

// Get an already-loaded torrent or add via magnet/id; resolves once metadata (file list) is ready
export async function resolveTorrent(torrentId: string, timeoutMs = 30000): Promise<Torrent> {
  const target = normalizeTorrentTarget(torrentId)

  const existing = await client.get(target) || await client.get(torrentId)
  if (existing) {
    if (existing.ready) return existing
    return waitForTorrentReady(existing, timeoutMs)
  }

  const inFlight = torrentPromises.get(target)
  if (inFlight) return inFlight

  const promise = (async () => {
    try {
      const torrent = await client.add(target)
      return await waitForTorrentReady(torrent, timeoutMs)
    } finally {
      torrentPromises.delete(target)
    }
  })()

  torrentPromises.set(target, promise)
  return promise
}

function waitForTorrentReady(torrent: Torrent, timeoutMs: number): Promise<Torrent> {
  if (torrent.ready) return Promise.resolve(torrent)

  return new Promise<Torrent>((resolve, reject) => {
    let timer: NodeJS.Timeout

    const cleanup = () => {
      clearTimeout(timer)
      torrent.removeListener("ready", onReady)
      torrent.removeListener("error", onError as any)
    }

    const onReady = () => {
      cleanup()
      resolve(torrent)
    }

    const onError = (err: unknown) => {
      cleanup()
      reject(err instanceof Error ? err : new Error(String(err)))
    }

    timer = setTimeout(() => {
      cleanup()
      reject(new Error(`Timeout (${timeoutMs / 1000}s) waiting for torrent metadata. Ensure the torrent has active seeders.`))
    }, timeoutMs)

    torrent.once("ready", onReady)
    ;(torrent as any).once("error", onError)
  })
}

// Use Torrentio's fileIdx when given, otherwise fall back to the largest video file
export function pickFile(torrent: Torrent, fileIdx?: number): TorrentFile {
  if (fileIdx != null && !isNaN(fileIdx)) {
    const file = torrent.files[fileIdx]
    if (file) return file
  }

  const videos = torrent.files.filter((file) =>
    VIDEO_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext))
  )
  const candidates = videos.length > 0 ? videos : torrent.files

  if (candidates.length === 0) {
    throw new Error("Torrent contains no files")
  }

  return candidates.reduce((largest, file) =>
    file.length > largest.length ? file : largest
  )
}

// Handles HTTP Range requests so <video> can seek; return 206 partial content
export function streamFile(file: TorrentFile, rangeHeader?: string): Response {
  const size = file.length
  const match = rangeHeader?.match(/bytes=(\d*)-(\d*)/)

  let start = 0
  let end = size - 1
  let status = 200

  if (match) {
    start = match[1] ? parseInt(match[1], 10) : 0
    end = match[2] ? parseInt(match[2], 10) : size - 1

    // Out-of-bounds range → 416 with acceptable range in header
    if (start >= size || end >= size || start > end) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } })
    }
    status = 206
  }

  const headers = new Headers({
    "Content-Type": MIME_TYPES[extOf(file.name)] ?? "application/octet-stream",
    "Accept-Ranges": "bytes",
    "Content-Length": String(end - start + 1),
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Expose-Headers": "Content-Range, Accept-Ranges, Content-Length, Content-Type",
  })
  if (status === 206) {
    headers.set("Content-Range", `bytes ${start}-${end}/${size}`)
  }

  const stream = file.stream({ start, end })
  return new Response(stream as any, { status, headers })
}

// Grab file extension (".", "mkv") to pick the right MIME type
function extOf(name: string): string {
  const dot = name.lastIndexOf(".")
  return dot === -1 ? "" : name.slice(dot).toLowerCase()
}

// Clean up: stop seeding/fetching a torrent to free memory and bandwidth
export function destroyTorrent(torrentId: string): Promise<void> {
  return client.remove(torrentId)
}