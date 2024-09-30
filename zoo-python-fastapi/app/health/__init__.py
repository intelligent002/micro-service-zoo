import logging


def get_health_logger():
    """
    Lazy initialization of the health logger.
    The logger will only be created when this function is called.
    """
    logger = logging.getLogger("health")
    return logger
