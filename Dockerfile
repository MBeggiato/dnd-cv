# Verwende das offizielle Node.js 20 Alpine Image als Basis
FROM node:20-alpine AS base

# Installiere Abhängigkeiten nur wenn package.json sich ändert
FROM base AS deps
# Prüfe https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine um zu verstehen, warum libc6-compat eventuell benötigt wird.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Installiere Abhängigkeiten basierend auf dem bevorzugten Paketmanager
COPY package.json package-lock.json* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile nicht gefunden." && exit 1; \
  fi

# Rebuild das Source Code nur wenn benötigt
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js telemetrie während des Builds deaktivieren
ENV NEXT_TELEMETRY_DISABLED=1

RUN \
  if [ -f package-lock.json ]; then npm run build; \
  else echo "Lockfile nicht gefunden." && exit 1; \
  fi

# Production Image, kopiere alle Dateien und starte Next.js
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Next.js telemetrie während der Laufzeit deaktivieren
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatisch nutze output traces um die Image-Größe zu reduzieren
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js wird von next build erstellt, wenn output: "standalone" verwendet wird
CMD ["node", "server.js"]
