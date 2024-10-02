# Use official Node.js image as base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Build the Next.js app for production
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Set environment variable to production
ENV NODE_ENV=production

# Command to start the app
CMD ["npm", "start"]
