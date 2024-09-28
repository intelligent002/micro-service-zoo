import logging
from fastapi.responses import JSONResponse
logger = logging.getLogger("health")

async def readiness():
    """
    Health check readiness - app subsidiary services
    """
    subsidiary_status = {"MySQL": "OK", "Redis": "OK"}

    # Check MySQL Database
    try:
        with db.engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            if not result.fetchone():
                raise Exception("MySQL connection failed")
        logger.info("Readiness check passed. MySQL is available.")
    except Exception as e:
        logger.error("Readiness check failed: %s. Failed service: MySQL", str(e))

        subsidiary_status["MySQL"] = "ERROR"

    # If any service fails, return 503
    if "ERROR" in subsidiary_status.values():
        return {'status': 'ERROR', 'data': subsidiary_status}, 503

    return {'status': 'OK', 'data': subsidiary_status}, 200
    # return JSONResponse(
    #     content={"error": "Service Unavailable", "message": "Some problem detected."},
    #     status_code=503
    # )