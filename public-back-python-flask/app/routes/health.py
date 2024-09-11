from flask import Blueprint, jsonify, current_app
from sqlalchemy import create_engine, text

from app.config import Config

routes_health = Blueprint('routes_health', __name__)

# Create the SQLAlchemy engine
engine = create_engine(Config.SQLALCHEMY_DATABASE_URI)


# Health check liveness - app local scope only
@routes_health.route('/liveness')
def liveness():
    return jsonify(status="OK"), 200


# Health check readiness - app subsidiary services too
@routes_health.route('/readiness')
def readiness():
    try:
        # Try to connect to the MySQL database
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            if result.fetchone():
                return jsonify(status="OK"), 200
    except Exception as e:
        # Log subsidiary system failures
        current_app.logger.error("readiness check failed: %s", str(e))
        # Catch any exceptions and return them as JSON
        return jsonify(status="ERROR", message=str(e)), 200
