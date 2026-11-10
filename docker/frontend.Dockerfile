FROM oven/bun:1

WORKDIR /app

# Copy dependency files
COPY frontend/package.json frontend/bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy application source
COPY frontend/ .

# Next.js default port
EXPOSE 3000

# Start production server
CMD ["bun", "run", "dev"]