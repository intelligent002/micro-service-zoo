import logging

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger("health")


async def readiness(db: AsyncSession):
    """
    Health check readiness - app subsidiary services
    """
    subsidiary_status = {"MySQL": "OK", "Redis": "OK"}

    # Check MySQL Database asynchronously
    try:
        # Correct way to handle connection in async mode with session
        async with db.begin():
            result = await db.execute(text("SELECT 1"))
            if not result.fetchone():
                raise Exception("MySQL connection failed")
        logger.info("Readiness check passed. MySQL is available.")
    except Exception as e:
        logger.error(f"Readiness check failed: {str(e)}. Failed service: MySQL")
        subsidiary_status["MySQL"] = "ERROR"

    return subsidiary_status
