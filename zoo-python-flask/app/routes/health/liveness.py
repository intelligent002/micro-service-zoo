from flask import current_app
from flask_restx import Resource, fields

from app.routes.health.namespace import ns_health

# Define the LIVENESS response for serialization and validation
response_liveness = ns_health.model('ResponseLiveness', {
    'status': fields.String(required=True, description='Liveness status', example='OK')
})


# Liveness check endpoint
class EndpointLiveness(Resource):
    @ns_health.marshal_with(response_liveness, code=200)
    def get(self):
        """
        Health check liveness - app local service scope only
        """
        current_app.logger.info("Liveness check passed.")
        return {'status': 'OK'}, 200
