# Use the official Bun image as the base
FROM oven/bun:1 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and bun.lockb (if exists)
COPY package.json bun.lock* ./

# Install dependencies with Bun
RUN bun install

# Copy the rest of the application code
COPY . .

# Build the Next.js app for production
RUN bun run build

# Create a new stage for the production image
FROM oven/bun:1 AS runner

# Set working directory
WORKDIR /app

# Copy the standalone build and static files from the builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose port 3000
ENV NODE_ENV=production
EXPOSE 3000

# Run the production server with Bun
CMD ["bun", "server.js"]