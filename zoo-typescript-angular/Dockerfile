# Stage 1: Dependencies
FROM node:20.18.0-bullseye AS dependencies

# Install Python and build tools
RUN apt-get update && apt-get install -y python3 build-essential

# Set working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*json ./

# Install dependencies
RUN npm i

# Stage 2: Build
FROM dependencies AS build

# Copy the rest of the app files into the container
COPY . .

# Build the React app (production build)
RUN npm run build

# Stage 3: Serve
FROM nginx:1.27.2-alpine-slim AS serve

# Set working directory in the container
WORKDIR /usr/share/nginx/html

# Add some coziness
RUN apk update && apk add --no-cache \
    curl \
    jq \
    nano \
    wget \
    && rm -rf /var/cache/apk/* /tmp/*

# Copy the built React files from the build stage
COPY --from=build /app/dist/browser/ /usr/share/nginx/html

# Copy configuration and starter files
COPY nginx/default.conf.template /etc/nginx/conf.d/
COPY nginx/nginx.conf.template /etc/nginx/
COPY nginx/start.sh /start.sh
RUN chmod +x /start.sh && rm -f /etc/nginx/conf.d/default.conf

# Expose the Nginx port
EXPOSE 8002/tcp

# Start Nginx server via new starter
CMD ["/start.sh"]
