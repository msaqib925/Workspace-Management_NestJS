# Use official Node.js LTS image as the base
FROM node:22-alpine

# Set working directoryß
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install Nest CLI globally (important for build step)
RUN npm install -g @nestjs/cli

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]