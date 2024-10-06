import os

from fastapi.responses import JSONResponse, FileResponse

from app.config import Config
from app.services.schema.get_logger import get_logger
from app.validators.version import validate_version, secure_filename


async def schema_download(version):
    """
    Download GQL scheme by provided version
    """
    logger = get_logger()

    if not validate_version(version):
        message = f"Invalid schema version format was passed in [{version}], expected format is [2024-09-26---10-42-00]"
        logger.error(message)
        return JSONResponse(status_code=422,
                            content={"status": "ERROR",
                                     "error": message})

    # Check if the requested schema file exists
    filename = f"schema_{version}.graphql"
    filepath = os.path.join(Config.SCHEMA_DIR, secure_filename(filename))
    if not os.path.exists(filepath):
        message = f"File [{filepath}] was not found, version passed in [{version}]"
        logger.error(message)
        return JSONResponse(status_code=404,
                            content={"status": "ERROR",
                                     "error": message})

    # Serve the file for download
    return FileResponse(filepath, status_code=200)
