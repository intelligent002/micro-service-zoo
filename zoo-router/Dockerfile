FROM docker.artifactory.intel.r7g.org/nginx:1.27.1-alpine-slim
RUN apk update && apk add curl jq

# Copy configuration and starter files
COPY nginx/nginx.conf.template /etc/nginx/conf.d/default.conf.template
COPY nginx/start.sh /start.sh
RUN chmod +x /start.sh && rm -f /etc/nginx/conf.d/default.conf

# Start Nginx server via new starter
CMD ["/start.sh"]