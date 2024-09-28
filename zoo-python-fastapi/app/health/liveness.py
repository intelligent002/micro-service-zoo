import logging

logger = logging.getLogger("health")


async def liveness():
    """
    Health check liveness - app local service scope only
    """
    logger.info("Liveness check passed.")
    return {'status': 'OK'}
