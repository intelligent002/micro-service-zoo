FROM alpine:3.14

# Install Prometheus and curl
RUN apk add --no-cache curl && \
    wget https://github.com/prometheus/prometheus/releases/download/v2.54.1/prometheus-2.54.1.linux-amd64.tar.gz -O /tmp/prometheus.tar.gz && \
    tar -xvf /tmp/prometheus.tar.gz -C /tmp/ && \
    mv /tmp/prometheus-2.54.1.linux-amd64/prometheus /bin/prometheus && \
    mv /tmp/prometheus-2.54.1.linux-amd64/promtool /bin/promtool && \
    rm -rf /tmp/prometheus*

# Create working directory and set permissions for the 'nobody' user
RUN mkdir -p /prometheus && chown -R nobody:nogroup /prometheus

WORKDIR /prometheus
VOLUME [ "/prometheus" ]

# Expose Prometheus ports
EXPOSE 9090

# Run as 'nobody' user
USER nobody

ENTRYPOINT ["/bin/prometheus"]
CMD ["--config.file=/etc/prometheus/prometheus.yml", "--storage.tsdb.path=/prometheus", "--web.console.libraries=/usr/share/prometheus/console_libraries", "--web.console.templates=/usr/share/prometheus/consoles"]
