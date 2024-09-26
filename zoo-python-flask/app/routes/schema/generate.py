import os
from datetime import datetime

from flask_restx import Resource, fields

from app.config import Config
from app.graphql.schema import schema  # GraphQL schema
from app.routes.schema.namespace import ns_schema


# Function to generate the GraphQL schema as SDL (Schema Definition Language)
def generate_schema(version):
    schema_str = str(schema)  # Generate the schema string (SDL)
    schema_with_version = f"# GraphQL Schema Version: {version} (UTC)\n" + schema_str
    return schema_with_version


# Define the EndpointSchemaGenerate response model for serialization and validation
response_generate = ns_schema.model('ResponseSchemaGenerator', {
    'status': fields.String(required=True, description='Generation status', example='OK'),
    'data': fields.String(required=True, description='Status of schema generation',
                          example='Schema generated with version [2024-09-26---10-42-00] and saved as [schema_2024-09-26---10-42-00.graphql].')
})


# endpoint EndpointSchemaGenerate
class EndpointSchemaGenerate(Resource):
    @ns_schema.marshal_with(response_generate, code=200)
    def get(self):
        """
        Generate GQL scheme according to current code, version according to UTC time
        """
        # Generate Unix timestamp as the version
        version = datetime.utcnow().strftime('%Y-%m-%d---%H-%M-%S')

        # Generate the schema
        schema_content = generate_schema(version)

        # Save to a file with timestamp in the filename
        filename = f"schema_{version}.graphql"
        filepath = os.path.join(Config.SCHEMA_DIR, filename)

        # Write the schema to a file
        with open(filepath, 'w') as file:
            file.write(schema_content)

        return {"status": "OK", "data": f"Schema generated with version [{version}] and saved as [{filename}]."}, 200
