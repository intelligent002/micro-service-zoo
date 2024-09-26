import os
import re

from flask import send_file
from flask_restx import Resource
from werkzeug.utils import secure_filename

from app.config import Config
from app.routes.schema.namespace import ns_schema


# endpoint EndpointSchemaDownload
class EndpointSchemaDownload(Resource):
    def get(self, version):
        """
        Download GQL scheme by provided version
        """
        # Check if the version matches the expected pattern (YYYY-MM-DD---HH-MM-SS)
        if not re.match(r'^\d{4}-\d{2}-\d{2}---\d{2}-\d{2}-\d{2}$', version):
            return {"status": "ERROR",
                    "message": f"Invalid schema version format [{version}], expected is [2024-09-26---10-42-00]"}, 400

        filename = f"schema_{version}.graphql"
        filepath = os.path.join(Config.SCHEMA_DIR, secure_filename(filename))

        # Check if the requested schema file exists
        if not os.path.exists(filepath):
            return {"status": "ERROR", "message": f"Schema version [{version}] not found"}, 404

        # Serve the file for download
        return send_file(filepath, as_attachment=True)
