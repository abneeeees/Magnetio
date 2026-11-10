FROM oven/bun:1.3.10 AS bun

FROM node:22-slim

COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun

# Prisma's query engine needs OpenSSL at generate and run time.
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/package.json backend/bun.lock ./

RUN bun install --frozen-lockfile

COPY backend/ .

# Prisma 7 no longer generates the client from a dependency postinstall, and Bun
# skips dependency lifecycle scripts unless they are allow-listed. Generate it
# here so the image contains a client built for this platform (and its engine).
# Use "bun run" — the image only ships the bun binary, not the bunx shim.
RUN DATABASE_URL="postgresql://build:build@localhost:5432/build" bun run db:generate

EXPOSE 3000

CMD ["bun", "run", "dev"]
