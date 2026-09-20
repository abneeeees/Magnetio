FROM node:22-slim

WORKDIR /app

COPY backend/package.json backend/bun.lock ./

RUN npm install -g bun@1.3.10
RUN bun install

COPY backend/ .

EXPOSE 3000

CMD ["bun", "run", "dev"]