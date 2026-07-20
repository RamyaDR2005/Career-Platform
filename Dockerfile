FROM node:20-slim

WORKDIR /app

# Install OpenSSL for Prisma and Git (if needed by pnpm dependencies)
RUN apt-get update && apt-get install -y openssl git

# Install pnpm
RUN npm install -g pnpm

# Copy package and lockfile
COPY package.json pnpm-lock.yaml ./

# Install dependencies (ignoring scripts initially if there's any lockfile strictness)
RUN pnpm install

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose port 3000
EXPOSE 3000

# Start the application in development mode
CMD ["pnpm", "dev"]
