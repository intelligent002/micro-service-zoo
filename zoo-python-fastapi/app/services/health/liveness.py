from app.config import Config
from app.metrics import rest_counter
from app.services.health.get_logger import get_logger


async def liveness():
    """
    Health check liveness - app local service scope only
    """
    logger = get_logger()
    logger.info("Liveness check passed.")
    rest_counter.labels(
        environment=Config.ENVIRONMENT,
        request="liveness",
        status="OK"
    ).inc()
    return {'status': 'OK'}
