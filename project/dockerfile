# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# First copy only package files for caching
COPY package.json package-lock.json ./

# Install prod dependencies only
RUN npm ci --omit=dev

# Copy remaining files
COPY . .

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app ./

CMD ["node", "server.js"]