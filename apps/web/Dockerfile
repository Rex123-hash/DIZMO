FROM node:24-slim AS builder

WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json ./
COPY packages/core/package.json packages/core/package.json
COPY apps/web/package.json apps/web/package.json

RUN npm ci

COPY packages/core packages/core
COPY apps/web apps/web

RUN npm run build -w @dizmo/core && npm run build -w @dizmo/web
RUN npm prune --omit=dev

FROM node:24-slim AS runner

ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json
COPY --from=builder /app/apps/web/vite.config.ts ./apps/web/vite.config.ts
COPY --from=builder /app/apps/web/dist ./apps/web/dist

CMD ["sh", "-c", "npm run preview -w @dizmo/web -- --host 0.0.0.0 --port ${PORT:-8080}"]
