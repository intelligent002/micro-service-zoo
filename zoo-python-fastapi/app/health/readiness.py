import logging

from fastapi import Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import DBSessionDep

logger = logging.getLogger("health")


async def readiness(db_session: AsyncSession = Depends(DBSessionDep)):
    """
    Health check readiness - app subsidiary services
    """
    subsidiary_status = {"MySQL": "OK", "Redis": "OK"}

    # Check MySQL Database asynchronously
    try:
        # Correct way to handle connection in async mode with session
        async with db_session.begin():
            result = await db_session.execute(text("SELECT 1"))
            if not result.fetchone():
                raise Exception("MySQL connection failed")
        logger.info("Readiness check passed. MySQL is available.")
    except Exception as e:
        logger.error(f"Readiness check failed: Failed service: MySQL: {str(e)}.")
        subsidiary_status["MySQL"] = "ERROR"

    return subsidiary_status
