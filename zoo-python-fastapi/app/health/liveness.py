from app.health import get_health_logger


async def liveness():
    """
    Health check liveness - app local service scope only
    """
    logger = get_health_logger()
    logger.info("Liveness check passed.")
    return {'status': 'OK'}
