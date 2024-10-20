# Stage 1: Build the React application
FROM node:20.18.0-alpine3.20 AS build

# Set working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package.json ./

# Install dependencies
RUN npm i

# Copy the rest of the app files into the container
COPY . .

# Build the React app (production build)
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:1.27.1-alpine-slim
RUN apk update && apk add --no-cache \
    curl \
    jq \
    nano \
    wget \
    && rm -rf /var/cache/apk/* /tmp/*

# Copy the built React files from the previous stage to Nginx's html directory
COPY --from=build /app/dist/browser/ /usr/share/nginx/html
COPY --from=build /app/package*json /usr/share/nginx/html

# Copy configuration and starter files
COPY nginx/default.conf.template /etc/nginx/conf.d/
COPY nginx/nginx.conf.template /etc/nginx/
COPY nginx/start.sh /start.sh
RUN chmod +x /start.sh && rm -f /etc/nginx/conf.d/default.conf

# Expose the default Nginx port
EXPOSE 8002/tcp

# Start Nginx server via new starter
CMD ["/start.sh"]
