FROM jaegertracing/all-in-one:1.62.0

# Switch to root user to install curl
USER root

# Install curl
RUN apk update && apk add --no-cache curl && \
    rm -rf /var/cache/apk/* /tmp/*



# Switch back to non-root user
USER nobody
