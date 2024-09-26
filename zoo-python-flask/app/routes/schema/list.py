import os

from flask_restx import Resource, fields

from app.config import Config
from app.routes.schema.namespace import ns_schema

# Define the EndpointSchemaList response model for serialization and validation
response_list = ns_schema.model('List', {
    'status': fields.String(required=True, description='List status', example='OK'),
    'available_versions': fields.List(fields.String, description='List of available versions',
                                      example='2024-09-26---10-42-00'),
})


# endpoint EndpointSchemaList
class EndpointSchemaList(Resource):
    @ns_schema.marshal_with(response_list, code=200)
    def get(self):
        """
        List all GQL Schema files available for download from that pod
        """
        versions = [f.replace('schema_', '').replace('.graphql', '')
                    for f in os.listdir(Config.SCHEMA_DIR) if f.endswith('.graphql')]
        return {"status": "OK", "available_versions": versions}, 200
