import logging


def get_logger():
    """
    Lazy initialization of the schema logger.
    The logger will only be created when this function is called.
    """
    logger = logging.getLogger("schema")
    return logger
