from typing import Dict

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_db
from app.health.liveness import liveness
from app.health.readiness import readiness

router = APIRouter()


# Define the LIVENESS response for serialization and validation
class ResponseLiveness(BaseModel):
    status: str = Field(...,
                        title="Service Status",
                        description="Status of the app, local service scope only",
                        examples=["OK"])


@router.get("/liveness",
            response_model=ResponseLiveness,
            responses={
                200: {"model": ResponseLiveness}
            })
async def liveness_check():
    return await liveness()


# Define the READINESS response for serialization and validation
class ResponseReadiness(BaseModel):
    status: str = Field(...,
                        title="Service Status",
                        description="Status of the subsidiary services scope",
                        examples=["OK"])
    data: Dict[str, str] = Field(...,
                                 title="Subsidiary services Status",
                                 description="Health of the subsidiary services",
                                 examples=[{"MySQL": "OK"}])


@router.get("/readiness",
            response_model=ResponseReadiness,
            responses={
                200: {"model": ResponseReadiness}
            })
async def readiness_check(db: AsyncSession = Depends(get_db)):
    status = await readiness(db)
    if "ERROR" in status.values():
        return JSONResponse(status_code=503,
                            content={"status": "ERROR", "data": status})
    return {"status": "OK", "data": status}
