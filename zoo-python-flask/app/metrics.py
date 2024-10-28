from prometheus_client import Counter, Histogram

# Define your custom counters using prometheus_client.Counter
gql_counter = Counter('graphql_requests_count',
                      'Total number of requests to getProjects',
                      ['environment', 'request', 'status'])

# Define histograms to track request durations using prometheus_client.Histogram
gql_duration = Histogram('graphql_requests_duration_seconds',
                         'Duration of getProjects method in seconds',
                         ['environment', 'request'],
                         buckets=[0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10, 15, 20, 30])
