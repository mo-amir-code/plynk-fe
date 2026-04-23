# =========================
# Base Image
# =========================
FROM node:20-alpine AS base

WORKDIR /app

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

# Compatibility for native Node modules
RUN apk add --no-cache libc6-compat

# Install pnpm globally
RUN npm install -g pnpm


# =========================
# Dependencies Stage
# =========================
FROM base AS deps

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile


# =========================
# Build Stage
# =========================
FROM base AS builder

WORKDIR /app

# Public environment variables (available in browser)
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ARG NEXT_PUBLIC_CLARITY_PROJECT_ID

ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID
ENV NEXT_PUBLIC_CLARITY_PROJECT_ID=$NEXT_PUBLIC_CLARITY_PROJECT_ID

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js app
RUN pnpm run build


# =========================
# Production Runner Stage
# =========================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080

# Create secure non-root user
RUN addgroup -S nodejs -g 1001 && \
    adduser -S nextjs -u 1001 -G nodejs

# Copy public assets
COPY --from=builder /app/public ./public

# Copy standalone server output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy static assets
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Run app securely
USER nextjs

# Cloud Run listens here
EXPOSE 8080

# Start Next.js standalone server
CMD ["node", "server.js"]