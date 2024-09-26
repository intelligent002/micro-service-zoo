from flask_restx import Namespace

# Define the namespace for health checks
ns_schema = Namespace('Schema', path='/graphql', description='GQL Schema related operations')
