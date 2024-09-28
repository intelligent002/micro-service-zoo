from prometheus_fastapi_instrumentator import Instrumentator


def init_metrics(app):
    Instrumentator().instrument(app).expose(app)
