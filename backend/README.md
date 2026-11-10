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
- `GET /metadata/:type/:id` — Fetch available torrent streams with magnet links from Torrentio (e.g. `/metadata/movie/tt0133093`, `/metadata/series/tt0903747:1:1`)
- `GET /stream/:infoHash` — Live HTTP 206 video stream with Range header seeking support
- `GET /user/profile` — Get authenticated user profile (requires `Authorization: Bearer <SUPABASE_JWT>`)
- `GET /user/history` — Get watch history & playback progress
- `POST /user/history` — Save/update playback progress (`currentTime`, `duration`, `completed`)
- `GET /user/watchlist` — Get user's saved watchlist
- `POST /user/watchlist` — Add movie/show to watchlist
- `DELETE /user/watchlist/:mediaId` — Remove item from watchlist

### Streaming behavior

- Prefers Torrentio's `fileIdx` when provided, otherwise picks the largest video file.
- Plain 40-char infoHashes are auto-resolved into a magnet URI with default trackers.
- Supports `Range` requests (`206 Partial Content`), returns `416` for out-of-bounds ranges.
- Concurrent requests for the same torrent are deduplicated; a single WebTorrent client shares the peer pool across streams.

---

## Database & Prisma (PostgreSQL / Supabase)

1. Copy `.env.example` to `.env` and fill in your Supabase connection strings:
   ```bash
   cp .env.example .env
   ```
2. Push database schema to PostgreSQL:
   ```bash
   bun run db:push
   ```
3. Open Prisma Studio to browse/edit database records:
   ```bash
   bun run db:studio
   ```
