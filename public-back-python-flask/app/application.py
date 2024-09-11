from flask import Flask
from prometheus_flask_exporter import PrometheusMetrics

from app.config import Config
from app.config import db
from app.logger import configure_logging
from app.routes import routes

#
def create_app():
    """
    method will instantiate a flask app
    """
    app = Flask(__name__)
    app.config.from_object(Config)

    # Set up logging
    configure_logging(app)

    # Initialize SQLAlchemy with the Flask app
    db.init_app(app)

    # Initialize Prometheus metrics
    PrometheusMetrics(app)

    app.register_blueprint(routes)
    return app
