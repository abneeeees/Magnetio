# Magnetio — Frontend

Minimalist web client and streaming video player for Magnetio built with [Next.js 16](https://nextjs.org), React 19, and Tailwind CSS v4.

---

## Getting Started

### Prerequisites

- **Node.js 20.9+** — `next dev` runs under Node.
- **Bun** 1.3+ — package manager.

### Installation
```bash
bun install
```

### Run Development Server
```bash
bun run dev
```
Runs the web app on **`http://localhost:3001`** (`next dev -H 0.0.0.0 -p 3001`).

### Configuration

- `NEXT_PUBLIC_BACKEND_URL` — backend API base URL (default `http://localhost:3000`, used in `lib/api.ts`).

---

## Features

- **Catalog & Search**: Browse top movies/shows (via Cinemeta) or search by title / IMDb ID (`tt0133093`).
- **Stream Selector**: Choose video quality (4K / 1080p / 720p), view seeds & sizes, and copy magnet links.
- **TV Series Support**: Season & Episode selector for series playback.
- **In-Browser Player**: Plays live HTTP 206 Partial Content streams with buffer indicators & external VLC link.
- **Direct Stream**: Paste any raw magnet link or 40-character infoHash to stream instantly.

---

## Project Structure

```text
frontend/
├── app/          # Next.js App Router pages & layout
├── components/   # MediaCard, Navbar, StreamSelector, VideoPlayer, DirectStream
├── lib/          # API client (Cinemeta + Magnetio backend)
├── types/        # Shared TypeScript types
└── public/
```

---

## Docker

Built from [`docker/frontend.Dockerfile`](../docker/frontend.Dockerfile) (Node 22 + Bun as package manager). With `docker compose up`, the app is published on port `3001`.