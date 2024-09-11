import logging
import sys

from pythonjsonlogger import jsonlogger

from app.config import Config


def configure_logging(app):
    # Set up logging to JSON format for app.logger
    handler = logging.StreamHandler(sys.stdout)
    formatter = jsonlogger.JsonFormatter('%(asctime)s %(name)s %(levelname)s %(message)s')
    handler.setFormatter(formatter)

    # Add the handler to the Flask app's logger
    app.logger.addHandler(handler)
    app.logger.setLevel(Config.LOG_LEVEL)
