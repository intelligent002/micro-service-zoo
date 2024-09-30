FROM docker.artifactory.intel.r7g.org/fabiocicerchia/nginx-lua:1.27.1-alpine3.20.3

# Install necessary dependencies
RUN apk update && apk add --no-cache \
    curl \
    jq \
    nano \
    wget \
    util-linux \
    && rm -rf /var/cache/apk/* /tmp/*

# Install lua-resty-uuid via luarocks and clean up
RUN luarocks install lua-resty-uuid \
    && luarocks purge --old-versions \
    && rm -rf /root/.cache/luarocks

# Copy configuration and starter files
COPY nginx/default.conf.template /etc/nginx/conf.d/
COPY nginx/nginx.conf.template /etc/nginx/
COPY nginx/start.sh /start.sh

# Set execute permissions and remove default config
RUN chmod +x /start.sh && rm -f /etc/nginx/conf.d/default.conf

# Start Nginx server via new starter
CMD ["/start.sh"]
