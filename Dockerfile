FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY tsconfig.json ./
COPY src ./src

RUN npm install -D typescript @types/node && \
    npm run build && \
    npm prune --production

FROM node:18-alpine

RUN apk add --no-cache \
    curl \
    postgresql-client \
    tini

ENV NODE_ENV=production \
    PORT=3000

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY scripts ./scripts

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000 9464

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3000/health/liveness || exit 1

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "dist/index.js"]
