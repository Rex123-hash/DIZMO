FROM node:24-slim AS builder

WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json ./
COPY packages/core/package.json packages/core/package.json
COPY services/relief-mcp/package.json services/relief-mcp/package.json

RUN npm ci

COPY packages/core packages/core
COPY services/relief-mcp services/relief-mcp

RUN npm run build -w @dizmo/core && npm run build -w @dizmo/relief-mcp
RUN npm prune --omit=dev

FROM node:24-slim AS runner

ENV NODE_ENV=production
WORKDIR /app

COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/core/package.json ./packages/core/package.json
COPY --from=builder /app/packages/core/dist ./packages/core/dist
COPY --from=builder /app/services/relief-mcp/package.json ./services/relief-mcp/package.json
COPY --from=builder /app/services/relief-mcp/dist ./services/relief-mcp/dist

CMD ["npm", "run", "start", "-w", "@dizmo/relief-mcp"]

