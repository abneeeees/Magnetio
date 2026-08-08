# Magnetio (work in progress)

Magnetio is a decentralised music streaming platform built on BitTorrent architecture — streams are played, downloaded, and searched for directly through magnet links/swarms rather than a centralized media server.

## Repo structure

```
apps/       # frontend + API applications
services/   # torrent engine, search service, etc.
docker/     # container definitions for local/dev deployment
```

<!--## Design principles

- Clean separation of concerns — the frontend contains zero torrent logic; all of that lives behind the torrent engine service.
- The torrent engine is intentionally decoupled so the underlying implementation (currently built on `libtorrent`) can be swapped out module-by-module for a custom, dependency-free engine over time.
- Fully decentralised: no central media library — content is discovered and streamed peer-to-peer via magnet links.

## Tech stack

`Next.js` · `React` · `TypeScript` · `Tailwind CSS` · `NestJS` · `Fastify` · `Node.js` · `PostgreSQL` · `Redis` · `Docker` · `Turborepo` · `Bun`-->

## Getting started

```bash
bun install
bun run dev
```

*(This is a Turborepo monorepo — most commands should be run from the root via `turbo`. Adjust once individual app/service scripts are finalized.)*

## Disclaimer

This project is for educational/self-hosting purposes. Users are responsible for ensuring their use complies with applicable laws regarding the content they access via BitTorrent.