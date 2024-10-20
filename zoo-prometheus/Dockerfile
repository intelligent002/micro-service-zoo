FROM alpine:3.14

# Install Prometheus and curl
RUN apk update && apk add --no-cache curl && \
    wget https://github.com/prometheus/prometheus/releases/download/v2.54.1/prometheus-2.54.1.linux-amd64.tar.gz -O /tmp/prometheus.tar.gz && \
    tar -xvf /tmp/prometheus.tar.gz -C /tmp/ && \
    mv /tmp/prometheus-2.54.1.linux-amd64/prometheus /bin/prometheus && \
    mv /tmp/prometheus-2.54.1.linux-amd64/promtool /bin/promtool && \
    rm -rf /var/cache/apk/* /tmp/*

# Set the working directory for Prometheus
WORKDIR /prometheus
VOLUME [ "/prometheus" ]

# Expose the Prometheus ports
EXPOSE 9090

# Run as a non-root user
USER nobody

# Start Prometheus with default command
ENTRYPOINT ["/bin/prometheus"]
CMD ["--config.file=/etc/prometheus/prometheus.yml", "--storage.tsdb.path=/prometheus", "--web.console.libraries=/usr/share/prometheus/console_libraries", "--web.console.templates=/usr/share/prometheus/consoles"]
