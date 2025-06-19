# Production Dockerfile for Next.js with Yarn
# --- Build Stage ---
    FROM node:18-alpine AS builder
    WORKDIR /app
    COPY package.json yarn.lock ./
    RUN yarn install --frozen-lockfile
    COPY . .
    RUN yarn build
    
    # --- Production Stage ---
    FROM node:18-alpine AS runner
    WORKDIR /app
    # Only copy necessary files for production
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/package.json ./package.json
    COPY --from=builder /app/yarn.lock ./yarn.lock
    COPY --from=builder /app/next.config.* ./
    COPY --from=builder /app/node_modules ./node_modules
    
    EXPOSE 3000
    ENV NODE_ENV=production
    CMD ["yarn", "start"] 