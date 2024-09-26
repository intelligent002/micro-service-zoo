import json

from flask import Flask
from flask_cors import CORS
from flask_restx import Api
from graphql.language.location import SourceLocation
from prometheus_flask_exporter import PrometheusMetrics

from app.config import Config
from app.config import db
from app.logger import configure_logging
from app.routes import routes
from app.routes.health import ns_health
from app.routes.schema import ns_schema


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

    # Register all namespaces
    api = Api(app, version='1.0', title='zoo-python-flask microservice',
              description='API features: GraphQL, REST, liveness, readiness, GQL schema generation')


    # Register all namespaces
    api.add_namespace(ns_health)
    api.add_namespace(ns_schema)


    # Register all routes
    app.register_blueprint(routes, url_prefix='/graphql')

    # Set up logging
    configure_logging(app)

    # Initialize SQLAlchemy with the Flask app
    db.init_app(app)

    # Initialize Prometheus metrics
    PrometheusMetrics(app)

    all_routes = []
    for rule in app.url_map.iter_rules():
        # Convert the methods to a string like "[POST GET]"
        methods = f"[{' '.join(sorted(rule.methods))}]"

        # Create the line in the format: /route/ ...[POST GET]...........(dots)............. endpoint
        route = str(rule)
        endpoint = rule.endpoint

        # Calculate the number of dots for padding
        dots_count = 80 - (len(route) + len(methods) + len(endpoint))
        dots = '.' * dots_count if dots_count > 0 else ' '

        # Format the output
        line = f"{route} {methods} {dots} {endpoint}"
        print(line)

    # Set Flask to use the custom JSON encoder globally
    app.json_encoder = CustomJSONEncoder

    return app
