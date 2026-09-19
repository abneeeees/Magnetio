# Magnetio — Frontend

Minimalist web client and streaming video player for Magnetio built with [Next.js 15](https://nextjs.org), React 19, and Tailwind CSS v4.

---

## Getting Started

### Installation
```bash
bun install
# or: npm install
```

### Run Development Server
```bash
bun dev
# or: npm run dev
```
Runs the web app on **`http://localhost:3001`**.

---

## Features

- **Catalog & Search**: Browse popular movies/shows or search by title / IMDb ID (`tt0133093`).
- **Stream Selector**: Choose video quality (4K / 1080p / 720p), view seeds & sizes, and copy magnet links.
- **TV Series Support**: Season & Episode selector for series playback.
- **In-Browser Player**: Plays live HTTP 206 Partial Content streams with buffer indicators & external VLC link.
- **Direct Stream**: Paste any raw magnet link or 40-character infoHash to stream instantly.
