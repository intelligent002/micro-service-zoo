import logging
import sys

from pythonjsonlogger import jsonlogger


# Configure logging to use JSON format
def configure_logging():
    log = logging.getLogger()
    log.setLevel(logging.INFO)

    # Create a handler that logs to stderr
    json_handler = logging.StreamHandler(sys.stderr)
    formatter = jsonlogger.JsonFormatter("(timestamp) (level) (logger_name) (message) (host) (environment) (service_name) (request_id) (trace_id)")

    # Set the formatter to JSON
    json_handler.setFormatter(formatter)

    # Add the handler to the root log
    log.addHandler(json_handler)
