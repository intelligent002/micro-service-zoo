FROM jaegertracing/all-in-one:1.62.0

# Install curl
USER root

RUN apk update && apk add --no-cache curl && \
    rm -rf /var/cache/apk/* /tmp/*

# Switch back to non-root user
USER nobody
