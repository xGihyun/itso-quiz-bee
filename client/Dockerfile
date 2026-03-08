# Multi-stage build for React/Vite application
# Stage 1: Build
FROM oven/bun:1 AS base

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start development server
CMD ["bun", "run", "dev"]
