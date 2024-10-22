FROM quay.io/prometheus/node-exporter:v1.8.2

# Switch to root user to install curl
USER root

# Download statically compiled curl binary and place it in /usr/bin
RUN wget https://github.com/moparisthebest/static-curl/releases/download/v8.10.1/curl-amd64 -O /usr/bin/curl \
    && chmod +x /usr/bin/curl

# Switch back to non-root user (nobody)
USER nobody