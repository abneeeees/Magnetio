# Magnetio — Backend

Torrent streaming engine and metadata proxy built with TypeScript, [Hono](https://hono.dev), and [WebTorrent](https://webtorrent.io).

---

## Getting Started

### Installation
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
Runs the server on **`http://localhost:3000`** via `tsx` (Node.js runtime).

> **Note**: Always run with Node.js (`npm run dev` / `tsx`). WebTorrent's native network sockets require Node's libuv implementation.

---

## API Endpoints

- `GET /` — API health check and endpoint list
- `GET /metadata/:type/:id` — Fetch available torrent streams with magnet links from Torrentio (e.g. `/metadata/movie/tt0133093` or `/metadata/series/tt0903747:1:1`)
- `GET /stream/:infoHash?fileIdx=0` — Live HTTP 206 video stream with Range header seeking support
