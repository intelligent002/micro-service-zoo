import logging
import sys

from flask import Flask, request, jsonify
from flask_graphql import GraphQLView
from prometheus_flask_exporter import PrometheusMetrics
from pythonjsonlogger import jsonlogger
from sqlalchemy import create_engine, text

from config import Config
from models import db
from schema import schema

app = Flask(__name__)
app.config.from_object(Config)

# Initialize the database with the app
db.init_app(app)

# Set up logging to JSON format for app.logger
logHandler = logging.StreamHandler(sys.stdout)
formatter = jsonlogger.JsonFormatter('%(asctime)s %(name)s %(levelname)s %(message)s')
logHandler.setFormatter(formatter)

# Add the handler to the Flask app's logger
app.logger.addHandler(logHandler)
app.logger.setLevel(logging.DEBUG)

# Initialize Prometheus metrics
metrics = PrometheusMetrics(app)

# Health check liveness - test local scope only
@app.route('/liveness')
def liveness():
    return jsonify(status="OK"), 200

# Create the SQLAlchemy engine
engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)

# Health check readiness - test subsidiary services too
@app.route('/readiness')
def readiness():
    try:
        # Try to connect to the MySQL database
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            if result.fetchone():
                return jsonify(status="OK"), 200
    except Exception as e:
        # Log subsidiary system failures
        app.logger.error("readiness check failed: %s", str(e))
        # Catch any exceptions and return them as JSON
        return jsonify(status="ERROR", message=str(e)), 200

# Logging into STDOUT
@app.before_request
def log_request_info():
    # Log full request information
    app.logger.debug("Headers: %s", request.headers)
    app.logger.debug("Body: %s", request.get_data(as_text=True))

@app.route('/')
def index():
    return "Welcome to GraphQL API for Projects and Tasks"

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
