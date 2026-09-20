# Magnetio — Backend

Torrent streaming engine and metadata proxy built with TypeScript, [Hono](https://hono.dev), and [WebTorrent](https://webtorrent.io). Fetches stream lists from Torrentio, resolves torrents, and serves video bytes with HTTP 206 Partial Content range support.

---

## Getting Started

### Prerequisites

- **Node.js 20.9+** — WebTorrent's native network sockets require Node's libuv implementation, so this app must run under Node (`tsx`), not the Bun runtime.
- **Bun** 1.3+ — package manager.

### Installation
```bash
bun install
```

### Run Development Server
```bash
bun run dev
```
Runs the server via `tsx` on **`http://localhost:3000`**.

### Configuration
- `PORT` — server port (default `3000`).

---

## API Endpoints

- `GET /` — API health check and endpoint list
- `GET /metadata/:type/:id` — Fetch available torrent streams with magnet links from Torrentio; supports an optional `?filter=` query (e.g. `/metadata/movie/tt0133093`, `/metadata/series/tt0903747:1:1`)
- `GET /stream/:infoHash` — Live HTTP 206 video stream with Range header seeking support; optional `?fileIdx=` to pick a specific file instead of the largest video, and `?magnet=` to pass a full magnet URI (with trackers)

### Streaming behavior

- Prefers Torrentio's `fileIdx` when provided, otherwise picks the largest video file.
- Plain 40-char infoHashes are auto-resolved into a magnet URI with default trackers.
- Supports `Range` requests (`206 Partial Content`), returns `416` for out-of-bounds ranges.
- Concurrent requests for the same torrent are deduplicated; a single WebTorrent client shares the peer pool across streams.

---

## Docker

Built from [`docker/backend.Dockerfile`](../docker/backend.Dockerfile) (Node 22 + Bun as package manager). With `docker compose up`, the API is published on port `3000`.