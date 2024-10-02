# Stage 1: Install dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Install dependencies based on the lock file
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of your application code
COPY . .

# Stage 2: Build the application
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app ./

# Build the Next.js app
RUN npm run build

# Stage 3: Prepare production image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application and necessary files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copy next.config.mjs directly from the context
COPY next.config.mjs ./

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

