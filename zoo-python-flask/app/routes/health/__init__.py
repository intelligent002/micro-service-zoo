from app.routes.health.liveness import EndpointLiveness
from app.routes.health.readiness import EndpointReadiness

from app.routes.health.namespace import ns_health

# Add liveness and readiness routes to the health namespace
ns_health.add_resource(EndpointLiveness, '/liveness')
ns_health.add_resource(EndpointReadiness, '/readiness')