from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.dependencies import DBSessionDep
from app.schemas.common import RespOkDict, RespErrDict, BaseOkResp
from app.services.health import liveness, readiness

router = APIRouter()

@router.get("/liveness",
            response_model=BaseOkResp,
            responses={
                200: {"model": BaseOkResp}
            })
async def route_liveness():
    """Liveness checkup - application scope only"""
    response = await liveness()
    return JSONResponse(status_code=200, content=response)


@router.get("/readiness",
            response_model=RespOkDict,
            responses={
                200: {"model": RespOkDict},
                503: {"model": RespErrDict}
            })
async def route_readiness(db_session: DBSessionDep):
    """Readiness checkup - subsidiary services included"""
    subsidiary = await readiness(db_session)
    if "ERROR" in subsidiary.values():
        return JSONResponse(status_code=503, content={"status": "ERROR", "error": subsidiary})

    return JSONResponse(status_code=200, content={"status": "OK", "result": subsidiary})
