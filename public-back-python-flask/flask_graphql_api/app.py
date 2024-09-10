import logging
from flask import Flask, request, jsonify
from flask_graphql import GraphQLView
from models import db
from schema import schema
from config import Config
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from prometheus_flask_exporter import PrometheusMetrics

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)

# Initialize Prometheus metrics
metrics = PrometheusMetrics(app)
# Custom metrics for tracking health check failures
health_check_failures = metrics.counter(
    'health_check_failures', 'Number of health check failures'
)

# Configure logging to debug level
logging.basicConfig(level=logging.DEBUG)

@app.before_request
def log_request_info():
    # Log full request information
    app.logger.debug("Headers: %s", request.headers)
    app.logger.debug("Body: %s", request.get_data(as_text=True))

@app.route('/')
def index():
    return "GraphQL API for Projects and Tasks"


# Create the SQLAlchemy engine
engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)


# Health check route
@app.route('/health')
def health():
    try:
        # Try to connect to the MySQL database
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            if result.fetchone():
                return jsonify(status="OK"), 200
    except OperationalError:
        # Increment the health check failure metric
        health_check_failures.inc()
        return jsonify(status="ERROR", message="Cannot connect to the database"), 500


app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True  # Enable GraphiQL interface for easy testing
    )
)

if __name__ == "__main__":
    app.run(debug=True)
