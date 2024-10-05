from prometheus_client import Counter, Histogram
from prometheus_fastapi_instrumentator import Instrumentator


def init_metrics(app):
    # Initialize Prometheus Instrumentation for FastAPI
    Instrumentator().instrument(app).expose(app)


# Define your custom counters using prometheus_client.Counter
projects_counter = Counter('graphql_get_projects_requests_total', 'Total number of requests to getProjects')
tasks_counter = Counter('graphql_get_tasks_requests_total', 'Total number of requests to getTasks')

# Define histograms to track request durations using prometheus_client.Histogram
projects_duration = Histogram('graphql_get_projects_duration_seconds', 'Duration of getProjects method in seconds')
tasks_duration = Histogram('graphql_get_tasks_duration_seconds', 'Duration of getTasks method in seconds')
