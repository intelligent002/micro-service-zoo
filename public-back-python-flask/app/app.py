from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from prometheus_flask_exporter import PrometheusMetrics

from app.config import Config
from app.logger import configure_logging

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Set up logging
    configure_logging(app)

    # Initialize SQLAlchemy with the Flask app
    db.init_app(app)

    # Initialize Prometheus metrics
    PrometheusMetrics(app)

    from app.routes import routes

    app.register_blueprint(routes)
    return app
