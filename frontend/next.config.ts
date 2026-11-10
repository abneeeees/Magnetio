import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

// Pin Next's root to this app. The repo root has its own bun.lock for the
// shared Prettier/Husky tooling, and without this Next infers the repo root.
const appRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: { root: appRoot },
  outputFileTracingRoot: appRoot,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
