from flask_restx import Namespace

# Define the namespace for health checks
ns_health = Namespace('Health', path='/health', description='Health related operations')
