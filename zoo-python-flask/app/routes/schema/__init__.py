from app.routes.schema.download import EndpointSchemaDownload
from app.routes.schema.generate import EndpointSchemaGenerate
from app.routes.schema.list import EndpointSchemaList
from app.routes.schema.namespace import ns_schema

# Add liveness and readiness routes to the health namespace
ns_schema.add_resource(EndpointSchemaDownload, '/schema/<version>')
ns_schema.add_resource(EndpointSchemaGenerate, '/schema/generate')
ns_schema.add_resource(EndpointSchemaList, '/schema/list')
