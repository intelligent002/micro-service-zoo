import time
from functools import wraps

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
                         buckets=[0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10, 15, 20, 30])


def async_time_decorator(histogram, labels):
    """ Custom decorator for async function timing with a dynamic histogram. """

    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            start_time = time.perf_counter()
            try:
                # Await the actual async function
                result = await func(*args, **kwargs)
                return result
            finally:
                # Calculate the duration and observe in the provided histogram
                duration = time.perf_counter() - start_time
                histogram.labels(**labels).observe(duration)

        return wrapper

    return decorator
