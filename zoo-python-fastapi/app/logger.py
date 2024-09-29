import logging
import sys

from pythonjsonlogger import jsonlogger


# Configure logging to use JSON format
def configure_logging():
    log = logging.getLogger()
    log.setLevel(logging.INFO)

    # Create a handler that logs to stderr
    json_handler = logging.StreamHandler(sys.stderr)
    formatter = jsonlogger.JsonFormatter("(timestamp) (level) (name) (message)")

    # Set the formatter to JSON
    json_handler.setFormatter(formatter)

    # Add the handler to the root log
    log.addHandler(json_handler)
