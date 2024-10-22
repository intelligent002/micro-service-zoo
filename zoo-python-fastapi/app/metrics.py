from prometheus_client import Counter, Histogram
from prometheus_fastapi_instrumentator import Instrumentator


def init_metrics(app):
    # Initialize Prometheus Instrumentation for FastAPI
    Instrumentator().instrument(app).expose(app)


# Define your custom counters using prometheus_client.Counter
gql_counter = Counter('graphql_requests_count',
                      'Total number of requests to getProjects',
                      ['environment', 'request', 'status'])

# Define histograms to track request durations using prometheus_client.Histogram
gql_duration = Histogram('graphql_requests_duration_seconds',
                         'Duration of getProjects method in seconds',
                         ['environment', 'request'],
                         buckets=[0.0000005, 0.00001, 0.025, 0.5, 1, 1.5, 2, 3, 5, 7.5, 10, 15, 20, 30, 500, 1500, 150000,
                                  1000000])
