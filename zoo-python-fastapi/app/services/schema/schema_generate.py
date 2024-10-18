import os
from datetime import datetime, timezone

import aiofiles  # For async file I/O

from app.config import Config
from app.services.graphql.schema import schema  # GraphQL schema
from app.services.schema.get_logger import get_logger


# endpoint EndpointSchemaGenerate
async def schema_generate():
    """
    Generate GQL scheme according to current code, version according to UTC time
    """
    logger = get_logger()

    # Generate the version - as the Unix timestamp in UTC
    version = datetime.now(timezone.utc).strftime('%Y-%m-%d---%H-%M-%S')

    # Generate the schema - with version inside
    contents = await generate_schema_contents(version)

    # Store the schema - in a file named after version
    try:
        await store_schema_file(version, contents)
    except Exception as e:
        logger.error(f"Failed to store the schema file: [{str(e)}].")
        return {"status": "ERROR",
                "error": "Failed to store the schema file, examine the logs."}

    return {"status": "OK", "result": version}


async def generate_schema_contents(version):
    """generate the GraphQL schema as SDL (Schema Definition Language)"""
    schema_str = str(schema)  # Generate the schema string (SDL)
    schema_with_version = f"# GraphQL Schema Version: {version} (UTC)\n" + schema_str
    return schema_with_version


async def store_schema_file(version, contents):
    """
    Save to a file with timestamp in the filename
    :param version:
    :param contents:
    """

    filename = f"schema_{version}.graphql"
    filepath = os.path.join(Config.SCHEMA_DIR, filename)

    # try to create folder if not exists
    if not os.path.exists(Config.SCHEMA_DIR):
        os.makedirs(Config.SCHEMA_DIR)

    # confirm directory created
    if not os.path.exists(Config.SCHEMA_DIR):
        raise OSError(f"Unable to create [{Config.SCHEMA_DIR}] folder")

    # Use aiofiles for async file writing
    async with aiofiles.open(filepath, 'w') as file:
        await file.write(contents)

    logger = get_logger()
    logger.info(f"Schema version [{version}] saved successfully at [{filepath}]")
