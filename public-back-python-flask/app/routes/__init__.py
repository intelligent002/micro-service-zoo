from flask import Blueprint, request, current_app

from app.routes.graphql import routes_graphql
from app.routes.health import routes_health
from app.routes.index import routes_index

routes = Blueprint('routes', __name__)
routes.register_blueprint(routes_health)
routes.register_blueprint(routes_index)
routes.register_blueprint(routes_graphql)


# Logging into STDOUT
@routes.before_request
def log_request_info():
    # Log full request information
    current_app.logger.debug("Headers: %s", request.headers)
    current_app.logger.debug("Body: %s", request.get_data(as_text=True))
