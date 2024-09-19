import logging
import sys

from pythonjsonlogger import jsonlogger

from app.config import Config


def configure_logging(app):
    # Remove any existing handlers
    for handler in app.logger.handlers:
        app.logger.removeHandler(handler)

    # Set up logging to JSON format for app.logger
    json_handler = logging.StreamHandler(sys.stdout)
    json_formatter = jsonlogger.JsonFormatter('%(asctime)s %(name)s %(levelname)s %(message)s')
    json_handler.setFormatter(json_formatter)

    # Add the JSON handler to the Flask app's logger
    app.logger.addHandler(json_handler)
    app.logger.setLevel(Config.LOG_LEVEL)

