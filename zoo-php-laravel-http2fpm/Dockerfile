FROM nginx:1.27.1-alpine-slim
RUN apk update && apk add --no-cache \
    curl \
    jq \
    nano \
    wget \
    && rm -rf /var/cache/apk/* /tmp/*

# Copy configuration and starter files
COPY nginx/default.conf.template /etc/nginx/conf.d/
COPY nginx/nginx.conf.template /etc/nginx/
COPY nginx/start.sh /start.sh
RUN chmod +x /start.sh && rm -f /etc/nginx/conf.d/default.conf

# Start Nginx server via new starter
CMD ["/start.sh"]