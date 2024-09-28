import logging
import sys

from pythonjsonlogger import jsonlogger


# Configure logging to use JSON format
def configure_logging():
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    # Create a handler that logs to stderr
    handler = logging.StreamHandler(sys.stderr)

    # Set the formatter to JSON
    formatter = jsonlogger.JsonFormatter('(timestamp) (level) (name) (message)')
    handler.setFormatter(formatter)

    # Add the handler to the root logger
    logger.addHandler(handler)
