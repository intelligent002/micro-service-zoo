import os

from app.config import Config
from app.services.schema.get_logger import get_logger


async def schema_list():
    """List all GQL Schema files available for download from that pod"""
    logger = get_logger()
    try:
        versions = [f.replace('schema_', '').replace('.graphql', '')
                    for f in os.listdir(Config.SCHEMA_DIR) if f.endswith('.graphql')]
    except Exception as e:
        message = f"Failed to list the versions [{str(e)}]"
        logger.error(message)
        return {"status": "ERROR", "message": message}

    logger.info("Schemas was listed.")
    return {"status": "OK", "result": versions}
