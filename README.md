# Magnetio

Magnetio is a lightweight, peer-to-peer web media streaming platform for movies and TV series. It resolves torrent streams via Torrentio and streams video directly to the browser using sequential BitTorrent chunking and HTTP 206 Partial Content range requests.

---

## Project Structure

```text
Magnetio/
├── backend/    # Hono API + WebTorrent sequential streaming engine (Node.js)
└── frontend/   # Next.js 15 web client + HTML5 streaming player (Tailwind CSS)
```

---

## Quick Start

### 1. Start the Backend
```bash
cd backend
npm install
npm run dev
```
Backend API will run at **`http://localhost:3000`**.

### 2. Start the Frontend
```bash
cd frontend
bun install
bun dev
```
Frontend Web UI will run at **`http://localhost:3001`**.

---

## Tech Stack

- **Backend**: Node.js, TypeScript, [Hono](https://hono.dev), [WebTorrent](https://webtorrent.io)
- **Frontend**: [Next.js 15](https://nextjs.org), React 19, Tailwind CSS v4, Lucide Icons
- **Stream Sources**: Torrentio Stremio Addon Protocol & Cinemeta Catalog

---

## Disclaimer

This project is created for educational and self-hosting purposes. Users are responsible for complying with applicable laws regarding content accessed via BitTorrent.