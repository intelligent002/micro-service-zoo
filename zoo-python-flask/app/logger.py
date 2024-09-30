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

def configure_logging(app):
    # Remove any existing handlers
    for handler in app.logger.handlers:
        app.logger.removeHandler(handler)

    # Set up logging to JSON format for app.logger
    handler = logging.StreamHandler(sys.stdout)
    formatter = CustomJsonFormatter()
    handler.setFormatter(formatter)

    # Add the JSON handler to the Flask app's logger
    app.logger.addHandler(handler)
    app.logger.setLevel(Config.LOG_LEVEL)

