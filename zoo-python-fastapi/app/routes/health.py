from typing import Dict

from fastapi import APIRouter
from pydantic import BaseModel, Field

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
async def readiness_check():
    # You can add any readiness logic here (e.g., checking database connection)
    return readiness()
