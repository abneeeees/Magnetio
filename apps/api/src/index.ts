import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

app.use("*", logger());
app.use("*", cors());

app.get("/", (c) => {
  return c.json({ name: "magnetio-api", status: "ok" });
});

app.get("/api/torrents", (c) => {
  return c.json({ torrents: [] });
});

app.get("/api/search", (c) => {
  const query = c.req.query("q");
  return c.json({ query, results: [] });
});

export default {
  port: 3001,
  fetch: app.fetch,
};
