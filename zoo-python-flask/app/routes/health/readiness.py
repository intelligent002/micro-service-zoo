from flask import current_app
from flask_restx import Resource, fields
from sqlalchemy import text

from app.config import db
from app.routes.health.namespace import ns_health

# Define the READINESS response for serialization and validation
response_subsidiary = ns_health.model('ResponseReadinessServices', {
    'MySQL': fields.String(required=True, description='Status of subsidiary service - MySQL', example='OK'),
})

response_readiness = ns_health.model('ResponseReadiness', {
    'status': fields.String(required=True, description='Readiness status', example='OK'),
    'data': fields.Nested(response_subsidiary, required=True,
                          description='Data object containing subsidiary service statuses')
})

class EndpointReadiness(Resource):
    @ns_health.marshal_with(response_readiness, code=200)
    def get(self):
        """
        Health check readiness - app subsidiary services
        """
        subsidiary_status = {"MySQL": "OK"}

        # Check MySQL Database
        try:
            with db.engine.connect() as connection:
                result = connection.execute(text("SELECT 1"))
                if not result.fetchone():
                    raise Exception("MySQL connection failed")
            current_app.logger.info("Readiness check passed. MySQL is available.")
        except Exception as e:
            current_app.logger.error("Readiness check failed: %s. Failed service: MySQL", str(e))
            subsidiary_status["MySQL"] = "ERROR"

        # If any service fails, return 503
        if "ERROR" in subsidiary_status.values():
            return {'status': 'ERROR', 'data': subsidiary_status}, 503

        return {'status': 'OK', 'data': subsidiary_status}, 200
