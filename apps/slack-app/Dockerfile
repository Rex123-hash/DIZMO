FROM node:24-slim AS builder

WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json ./
COPY packages/core/package.json packages/core/package.json
COPY apps/slack-app/package.json apps/slack-app/package.json

RUN npm ci

COPY packages/core packages/core
COPY apps/slack-app apps/slack-app

RUN npm run build -w @dizmo/core && npm run build -w @dizmo/slack-app
RUN npm prune --omit=dev

FROM node:24-slim AS runner

ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/core/package.json ./packages/core/package.json
COPY --from=builder /app/packages/core/dist ./packages/core/dist
COPY --from=builder /app/apps/slack-app/package.json ./apps/slack-app/package.json
COPY --from=builder /app/apps/slack-app/dist ./apps/slack-app/dist

CMD ["npm", "run", "start", "-w", "@dizmo/slack-app"]

