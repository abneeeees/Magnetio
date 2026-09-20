FROM node:22-slim

WORKDIR /app

COPY frontend/package.json frontend/bun.lock ./

RUN npm install -g bun@1.3.10
RUN bun install

COPY frontend/ .

EXPOSE 3001

CMD ["bun", "run", "dev"]