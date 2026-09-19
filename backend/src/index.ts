import { Hono } from "hono"
import { cors } from "hono/cors"
import { serve } from "@hono/node-server"
import { fetchMetadata } from "./services/torrent-metadata"
import { resolveTorrent, pickFile, streamFile } from "./services/torrent-engine"

export const app = new Hono()

// Enable CORS and expose Range headers for video streaming
app.use(
  "/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "HEAD", "OPTIONS"],
    exposeHeaders: ["Content-Range", "Accept-Ranges", "Content-Length", "Content-Type"],
  })
)

// API root: advertise the available endpoints
app.get("/", (c) =>
  c.json({
    service: "Magnetio",
    endpoints: ["/metadata/:type/:id", "/stream/:infoHash"],
  })
)

// Proxy to Torrentio → list of playable torrents with magnets
app.get("/metadata/:type/:id", async (c) => {
  const { type, id } = c.req.param()
  const filter = c.req.query("filter")

  try {
    const data = await fetchMetadata(type, id, filter ?? undefined)
    return c.json(data)
  } catch (err) {
    return c.json({ error: err instanceof Error ? err.message : String(err) }, 500)
  }
})

// Stream a torrent: resolve -> pick file -> serve bytes with HTTP range support
app.get("/stream/:infoHash", async (c) => {
  const { infoHash } = c.req.param()
  const magnet = c.req.query("magnet")
  const fileIdx = c.req.query("fileIdx")
  const range = c.req.raw.headers.get("range") ?? undefined

  // Prefer full magnet URI (with trackers) if provided, otherwise fallback to infoHash
  const torrentTarget = magnet || infoHash

  try {
    const torrent = await resolveTorrent(torrentTarget)
    const file = pickFile(torrent, fileIdx != null ? Number(fileIdx) : undefined)
    return streamFile(file, range)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const status = message.includes("Timeout") ? 408 : 500
    return c.json({ error: message }, status)
  }
})

const PORT = Number(process.env.PORT ?? 3000)
serve({ fetch: app.fetch, port: PORT }, () => {
  console.log(`Magnetio API → http://localhost:${PORT}`)
})