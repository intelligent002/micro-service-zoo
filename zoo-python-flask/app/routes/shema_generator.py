import os
import re
from datetime import datetime

from flask import jsonify, Blueprint, send_file
from werkzeug.utils import secure_filename

from app.config import Config
from app.graphql.schema import schema  # GraphQL schema

routes_schema = Blueprint('routes_schema', __name__)


# Function to generate the GraphQL schema as SDL (Schema Definition Language)
def generate_schema(version):
    schema_str = str(schema)  # Generate the schema string (SDL)
    schema_with_version = f"# GraphQL Schema Version: {version} (UTC)\n" + schema_str
    return schema_with_version


# Route to generate schema and save it with a Unix timestamp version
@routes_schema.route('/schema/generate', methods=['GET'])
def generate_schema_route():
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

    return jsonify({"status": "OK", "message": f"Schema generated with version [{version}] and saved as [{filename}]."})


# Route to list all schema versions
@routes_schema.route('/schema/list', methods=['GET'])
def list_schema_versions():
    # List all files in the SCHEMA_DIR ending with .graphql
    versions = [f.replace('schema_', '').replace('.graphql', '')
                for f in os.listdir(Config.SCHEMA_DIR) if f.endswith('.graphql')]
    return jsonify({"status": "OK", "available_versions": versions})


# Route to serve (download) a specific version of the schema
@routes_schema.route('/schema/<version>', methods=['GET'])
def serve_schema(version):
    # Check if the version matches the expected pattern (YYYY-MM-DD-HH-MM-SS)
    if not re.match(r'^\d{4}-\d{2}-\d{2}---\d{2}-\d{2}-\d{2}$', version):
        return jsonify({"status": "ERROR", "message": "Invalid schema version format"}), 400

    filename = f"schema_{version}.graphql"
    filepath = os.path.join(Config.SCHEMA_DIR, secure_filename(filename))

    # Check if the requested schema file exists
    if not os.path.exists(filepath):
        return jsonify({"status": "ERROR", "message": "Schema version not found"}), 404

    # Serve the file for download
    return send_file(filepath, as_attachment=True)
