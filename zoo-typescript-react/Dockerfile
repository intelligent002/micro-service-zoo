# Stage 1: Build the React application
FROM node:18-alpine3.20 AS build

# Set working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app files into the container
COPY . .

# Build the React app (production build)
RUN npm run build

# Stage 2: Serve with Nginx
FROM docker.artifactory.intel.r7g.org/nginx:1.27.1-alpine-slim
RUN apk update && apk add curl jq

# Copy the built React files from the previous stage to Nginx's html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom Nginx configuration (if needed)
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose the default Nginx port
EXPOSE 8002/tcp

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
