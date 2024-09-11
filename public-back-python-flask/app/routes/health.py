from flask import Blueprint, jsonify, current_app
from sqlalchemy import text

from app.config import db

routes_health = Blueprint('routes_health', __name__)

@routes_health.route('/liveness')
def liveness():
    """
    Health check liveness - app local scope only
    """
    return jsonify(status="OK"), 200


@routes_health.route('/readiness')
def readiness():
    """
    Health check readiness - app subsidiary services too
    """
    readiness_status = {"MySQL": "OK"}

    # Check MySQL Database
    try:
        with db.engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            if not result.fetchone():
                raise Exception("MySQL connection failed")
        current_app.logger.info("Readiness check passed. MySQL is available.")
    except Exception as e:
        current_app.logger.error("Readiness check failed: %s. Failed service: MySQL", str(e))
        readiness_status["MySQL"] = "ERROR"

    # If any service fails, return 503
    if "ERROR" in readiness_status.values():
        return jsonify(status="ERROR", services=readiness_status), 503

    return jsonify(status="OK", services=readiness_status), 200