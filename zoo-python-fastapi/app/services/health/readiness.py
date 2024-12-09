from fastapi import Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import Config
from app.dependencies import DBSessionDep
from app.metrics import rest_counter
from app.services.health.get_logger import get_logger


async def readiness(db_session: AsyncSession = Depends(DBSessionDep)):
    """
    Health check readiness - app subsidiary services
    """
    logger = get_logger()
    subsidiary_status = {"MySQL": "OK"}

    # Check MySQL Database asynchronously
    try:
        # Correct way to handle connection in async mode with session
        async with db_session.begin():
            result = await db_session.execute(text("SELECT 1"))
            if not result.fetchone():
                raise Exception("MySQL connection failed")
        logger.info("Readiness check passed. MySQL is available.")
        rest_counter.labels(
            environment=Config.ENVIRONMENT,
            request="readiness",
            status="OK"
        ).inc()

    except Exception as e:
        logger.error(f"Readiness check failed: Failed service: MySQL: {str(e)}.")
        rest_counter.labels(
            environment=Config.ENVIRONMENT,
            request="readiness",
            status="ERROR"
        ).inc()
        subsidiary_status["MySQL"] = "ERROR"

    return subsidiary_status
