from prometheus_client import Counter, Histogram

# Define your custom counters
projects_counter = Counter('graphql_get_projects_requests_total', 'Total number of requests to getProjects')
tasks_counter = Counter('graphql_get_tasks_requests_total', 'Total number of requests to getTasks')

# Define histograms to track request durations
projects_duration = Histogram('graphql_get_projects_duration_seconds', 'Duration of getProjects method')
tasks_duration = Histogram('graphql_get_tasks_duration_seconds', 'Duration of getTasks method')
