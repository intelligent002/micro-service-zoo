from app.services.health.get_logger import get_logger


async def liveness():
    """
    Health check liveness - app local service scope only
    """
    logger = get_logger()
    logger.info("Liveness check passed.")
    return {'status': 'OK'}
