# Use an official Node.js runtime as a parent image
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Copy prisma folder
COPY prisma ./prisma

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build the application (if needed)
# RUN npm run build

# Use a lightweight image to run the application
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy the built files and dependencies from the previous stage
COPY --from=build /app /app

# Expose port 4005
EXPOSE 3000

# Start the application
CMD ["node", "src/index.js"]