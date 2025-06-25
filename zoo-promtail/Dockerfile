FROM grafana/promtail:3.0.0

# Switch to root user to install curl
USER root

# Add curl to the image
RUN apt-get update -y && apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*


# Switch back to non-root user (nobody)
# USER nobody