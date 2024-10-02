import logging
import os
import sys
import time

from pythonjsonlogger import jsonlogger

from app.config import Config


class CustomJsonFormatter(jsonlogger.JsonFormatter):
    def add_fields(self, log_record, record, message_dict):
        super(CustomJsonFormatter, self).add_fields(log_record, record, message_dict)

        # Add custom fields to the log record
        log_record['timestamp'] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        log_record['level'] = record.levelname
        log_record['message'] = record.getMessage()
        log_record['logger_name'] = record.name

        # Docker and environment-related info
        log_record['host'] = os.getenv("HOSTNAME", "unknown")
        log_record['environment'] = os.getenv("ENVIRONMENT", "")
        log_record['service_name'] = os.getenv("SERVICE_NAME", "")

        # Request and trace fields (you can extend this later with request_id, trace_id, etc.)
        log_record['request_id'] = ""
        log_record['trace_id'] = ""
        log_record['extra'] = {}


def setup_logging():
    """
    Set up the global logging configuration.
    """

    # Create a stream handler (for output to console)
    handler = logging.StreamHandler(sys.stdout)

    # Use the custom JSON formatter
    formatter = CustomJsonFormatter()
    handler.setFormatter(formatter)

    # Get the root get_logger.py
    root_logger = logging.getLogger()
    root_logger.handlers.clear()

    # set the log level
    root_logger.setLevel(Config.LOG_LEVEL)

    # Attach the handler to the root get_logger.py
    root_logger.addHandler(handler)
