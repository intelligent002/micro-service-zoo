from flask import Blueprint, request, current_app

from app.routes.graphql import route_graphql
from app.routes.index import route_index

routes = Blueprint('routes', __name__)
#routes.register_blueprint(route_index)
routes.register_blueprint(route_graphql)


@routes.before_request
def log_request_info():
    """
    Log request headers and body to STDOUT if DEBUG_MODE is enabled.
    Avoid logging sensitive information like POST/PUT/PATCH bodies.
    """
    if current_app.config.get('DEBUG_MODE', True):
        # Log headers (filter out sensitive information like Authorization, Cookies)
        filtered_headers = {k: v for k, v in request.headers.items() if k.lower() not in ['authorization', 'cookie']}
        current_app.logger.debug("Headers: %s", filtered_headers)

        # Avoid logging the full body for sensitive methods like PUT/POST/PATCH, while we do read only
        if request.method in ['PUT','PATCH']: # POST is used by graphql, lets debug it
            current_app.logger.debug("Body logging skipped for %s request.", request.method)
        else:
            current_app.logger.debug("Body: %s", request.get_data(as_text=True))
