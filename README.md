# Magnetio

Magnetio is a lightweight, peer-to-peer web media streaming platform for movies and TV series. It resolves torrent streams via Torrentio and streams video directly to the browser using sequential BitTorrent chunking and HTTP 206 Partial Content range requests.

---

## Project Structure

```text
Magnetio/
├── backend/   # Hono API + WebTorrent sequential streaming engine (Node.js runtime)
├── frontend/  # Next.js 16 web client + HTML5 streaming player (Tailwind CSS)
├── docker/    # backend.Dockerfile & frontend.Dockerfile
├── docker-compose.yml
└── .dockerignore
```

---

## Prerequisites

- **Node.js 20.9+** (Node 22 recommended) — required to run `tsx`, `@hono/node-server`, and WebTorrent, which need Node's runtime/network stack.
- **Bun** 1.3+ — used as the package manager in both apps.

---

## Quick Start (local development)

### 1. Start the Backend
```bash
cd backend
bun install
bun run dev
```
Backend API runs at **`http://localhost:3000`** (override with the `PORT` env var).

### 2. Start the Frontend
```bash
cd frontend
bun install
bun run dev
```
Frontend web UI runs at **`http://localhost:3001`**.

The frontend expects the backend at `http://localhost:3000` by default. Point it elsewhere with:

```bash
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000 bun run dev
```

---

## Run with Docker

```bash
sudo docker compose up --build
```

- Backend exposed on **`3000:3000`**
- Frontend exposed on **`3001:3001`**

Source directories are bind-mounted for live reload, while `node_modules` lives in named volumes. On SELinux-enforcing hosts (e.g. Fedora) the bind mounts use the `:z` label so containers can read/write them.

---

## Tech Stack

- **Backend**: Node.js, TypeScript, [Hono](https://hono.dev), [WebTorrent](https://webtorrent.io)
- **Frontend**: [Next.js 16](https://nextjs.org), React 19, Tailwind CSS v4, Lucide Icons
- **Stream Sources**: Torrentio Stremio Addon Protocol & Cinemeta Catalog

---

## Disclaimer

This project is created for educational and self-hosting purposes. Users are responsible for complying with applicable laws regarding content accessed via BitTorrent.