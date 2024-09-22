import json

from flask import Flask
from flask_cors import CORS
from graphql.language.location import SourceLocation
from prometheus_flask_exporter import PrometheusMetrics

from app.config import Config
from app.config import db
from app.logger import configure_logging
from app.routes import routes


class CustomJSONEncoder(json.JSONEncoder):
    """
    SourceLocation is not serializing well, so here we help it a bit
    """
    def default(self, obj):
        if isinstance(obj, SourceLocation):
            return {
                'line': obj.line,
                'column': obj.column
            }
        return super().default(obj)

def create_app():
    """
    method will instantiate a flask app
    """
    app = Flask(__name__)
    CORS(app)  # Enable CORS
    app.config.from_object(Config)

    # Set up logging
    configure_logging(app)

    # Initialize SQLAlchemy with the Flask app
    db.init_app(app)

    # Initialize Prometheus metrics
    PrometheusMetrics(app)

    # Register all routes with prefix
    app.register_blueprint(routes, url_prefix='/graphql')

    # Set Flask to use the custom JSON encoder globally
    app.json_encoder = CustomJSONEncoder

    return app
