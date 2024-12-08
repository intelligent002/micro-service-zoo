# What is that repository?

Since registering on GitHub, I have been deeply involved in a variety of projects. Unfortunately, none of these projects are publicly available due to their proprietary nature. Many of them include work on sensitive or classified applications, including some in the military domain.

As a result, I am unable to showcase these projects here.

To address this limitation and provide an opportunity to share some of my handwritten code, I have created this repository. Here, I am adding a collection of microservices designed for deployment in a Docker Compose environment on Linux, macOS, and Windows machines.

This repository goes beyond just providing code. It also integrates visibility and observability tools with the microservices. This approach demonstrates my philosophy that code should not operate as a "black box." Instead, it should provide meaningful insights through business-related dashboards, enabling stakeholders to better understand the flow of data and executions.

While this is not intended as a "DevOps showcase," it reflects my belief that well-positioned code should contribute to a transparent and actionable understanding of system behavior.

---

# Welcome to the Zoo 🦁🐘🐍🐒🐬

**A microservice zoo showcasing a collection of modular services for projects and task management.**

This repository demonstrates a suite of core microservices, each designed to highlight diverse technologies and frameworks. These services are integrated into a cohesive ecosystem, deployable in a Docker Compose environment, and tailored for different user interfaces and protocols.

---

## Core Microservices

### 1. **Public Frontend (zoo-typescript-react)**
- **Framework**: React with TypeScript
- **Protocol**: GraphQL
- **Features**:
  - Fetches and renders projects and their associated tasks.
  - Minimal functionality: Users can click on a project to view its tasks.
- **Health Tests**:
  - **Liveness**: Ensures that the frontend is alive and running without critical issues.
- **Prometheus Metrics**:
  - Exposes performance-related metrics for periodic scraping by Prometheus.

---

### 2. **Public Backend (zoo-python-fastapi / zoo-python-flask)**
- **Framework**: Python with FastAPI (there is a drop-in replacement microservice using Flask)
- **Protocols**: GraphQL, REST
- **Features**:
  - Fully async (FastAPI), with Flask option being fully sync.
  - Exposes GraphQL API endpoint for retrieving project and task data for the public frontend.
  - **Strawberry UI**: For testing GraphQL endpoints directly from the browser (projects/tasks).
  - Exposes REST API endpoint for GraphQL schema auto-generation and download.
  - **Swagger UI**: For testing REST API endpoints directly from the browser (health and schemas).
- **Health Tests**:
  - **Liveness**: Confirms the backend is alive and running without critical issues.
  - **Readiness**: Ensures the backend is ready to serve requests (e.g., all necessary dependencies like database and Redis are available).
- **Prometheus Metrics**:
  - Exposes performance and business-related metrics for periodic scraping by Prometheus.

---

### 3. **Private Frontend (zoo-typescript-angular)**
- **Framework**: Angular with TypeScript
- **Protocol**: REST
- **Features**:
  - Full CRUD operations for projects and tasks.
  - Drag-and-drop functionality for reordering tasks within a project or migrating tasks between projects.
  - Cascading deletes: Removing a project automatically deletes its associated tasks.
- **Health Tests**:
  - **Liveness**: Ensures that the frontend is alive and running without critical issues.
- **Prometheus Metrics**:
  - Exposes performance-related metrics for periodic scraping by Prometheus.

---

### 4. **Private Backend (zoo-php-laravel)**
- **Framework**: PHP-FPM with Laravel
- **Protocol**: REST
- **Features**:
  - Exposes REST API endpoint for all CRUD operations on projects and tasks.
  - Backend logic ensures smooth handling of task reordering and cascading deletes.
  - **Swagger UI**: Integrated Swagger UI for testing API endpoints directly from the browser.
- **Health Tests**:
  - **Liveness**: Confirms the backend is alive and running without critical issues.
  - **Readiness**: Ensures the backend is ready to serve requests (e.g., all necessary dependencies like database and Redis are available).
- **Prometheus Metrics**:
  - Exposes performance and business-related metrics for periodic scraping by Prometheus.

---

### 5. **PHP-FPM Proxy (zoo-php-laravel-http2fpm)**
- **Base**: Nginx
- **Features**:
  - Acts as a proxy to allow browsers to interact with the PHP-FPM backend.
- **Health Tests**:
  - **Liveness**: Ensures that the proxy service is running without critical issues.
- **Prometheus Metrics**:
  - Exposes performance-related metrics for periodic scraping by Prometheus.

---

### 6. **MySQL Database (zoo-mysql)**
- **Base**: MySQL 8
- **Topology**: Single instance for local deployment
- **Health Tests**:
  - **Liveness**: Ensures that the database is alive and running without critical issues.

---

### 7. **MySQL Database Exporter (zoo-mysqld-exporter)**
- **Base**: MySQL Exporter for Prometheus
- **Purpose**: Scrapes MySQL performance metrics for monitoring.
- **Prometheus Metrics**:
  - Exposes performance-related metrics for periodic scraping by Prometheus.
- **Health Tests**:
  - **Liveness**: Confirms the exporter is alive and functioning correctly.

---

### 8. **Redis Database (zoo-redis)**
- **Base**: redis:7.4.1
- **Topology**: Single instance for local deployment
- **Purposes**:
  - Supports the PHP-based microservices:
    - Holds Prometheus metrics between page renders.
    - Stores server-side session data.
- **Health Tests**:
  - **Liveness**: Ensures that the database is alive and running without critical issues.

---

### 9. **Prometheus (zoo-prometheus)**
- **Base**: prom/prometheus:v2.54.1
- **Purpose**:
  - Scrapes performance metrics for monitoring.
  - Exposes metrics for rendering in Grafana.
  - Issues alerts upon reaching thresholds.
- **Health Tests**:
  - **Liveness**: Confirms Prometheus is alive and functioning correctly.

---

### 10. **Alert Manager (zoo-alert-manager)**
- **Base**: prom/alertmanager:v0.27.0
- **Purpose**:
  - Manages alerts based on Prometheus metrics.
- **Health Tests**:
  - **Liveness**: Confirms Alert Manager is alive and functioning correctly.

---

### 11. **Grafana (zoo-grafana)**
- **Base**: grafana/grafana:11.2.2
- **Purposes**:
  - Renders the metrics collected from Prometheus.
  - Renders logs from Loki.
- **Health Tests**:
  - **Liveness**: Confirms Grafana is alive and functioning correctly.

---

### 12. **Promtail (zoo-promtail)**
- **Base**: grafana/promtail:3.0.0
- **Purpose**:
  - Collects JSON-based logs from all involved containers.
  - Pushes logs into Loki for storage.
- **Health Tests**:
  - **Liveness**: Confirms Promtail is alive and functioning correctly.

---

### 13. **Loki (zoo-loki)**
- **Base**: grafana/loki:3.2.1
- **Purpose**:
  - Stores logs for further investigation.
- **Health Tests**:
  - **Liveness**: Confirms Loki is alive and functioning correctly.

---

### 14. **Jaeger (zoo-jaeger)**
- **Base**: jaegertracing/all-in-one:1.62.0
- **Purpose**:
  - Enables tracing of the microservices.
- **Health Tests**:
  - **Liveness**: Confirms Jaeger is alive and functioning correctly.

---

### 15. **Router (zoo-router)**
- **Base**: fabiocicerchia/nginx-lua:1.27.1-alpine3.20.3
- **Purposes**:
  - Routes requests to the microservices.
  - Generates `trace_id` for the execution chain.
  - Caches static files (CSS/JS/PNG).
  - Provides SSL offloading.
  - Implements security enhancements and rate-limiting.
  - Acts as the designated front-entry point.
- **Health Tests**:
  - **Liveness**: Confirms the Router is alive and functioning correctly.

---

### 16. **Node Exporter (zoo-node-exporter)**
- **Base**: quay.io/prometheus/node-exporter:v1.8.2
- **Purpose**:
  - Collects detailed information about the host running the Zoo’s Docker engine.
- **Health Tests**:
  - **Liveness**: Confirms Node Exporter is alive and functioning correctly.

---

## Why the Zoo?

This repository provides modular microservices and demonstrates my approach to building transparent, well-integrated systems. It emphasizes clean code, functional design, and observability, ensuring the flow of data and processes is clear to stakeholders through meaningful dashboards.

Get started by cloning this repository and deploying the services to experience the Zoo in action!
