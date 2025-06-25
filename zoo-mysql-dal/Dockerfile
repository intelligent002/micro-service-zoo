# Stage 1: Install dependencies
FROM node:20.18.1 AS dependencies

# Set working directory in the container
WORKDIR /app

# Copy the package files
COPY package*json ./

# Install dependencies
RUN npm ci

# Stage 2: Build the application
FROM dependencies AS build

# Copy the rest of the app files into the container
COPY . .

# Build the app
RUN npm run generate:proto-ts

#RUN npm run build
