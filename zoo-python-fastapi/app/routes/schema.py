from fastapi import APIRouter
from fastapi.responses import JSONResponse, FileResponse

from app.schemas.common import RespOkString, RespErrString, RespOkList, RespOkGeneric
from app.services.schema import schema_list, schema_generate, schema_download

router = APIRouter()


@router.get("/schema/generate",
            response_model=RespOkString,
            responses={
                200: {"model": RespOkString},
                500: {"model": RespErrString},
            })
async def route_generate():
    """Generate a new GQL schema file, returns the version date identification"""
    result = await schema_generate()
    if "ERROR" in result.values():
        return JSONResponse(status_code=500, content=result)

    return JSONResponse(status_code=200, content=result)


@router.get("/schema/list",
            response_model=RespOkList,
            responses={
                200: {"model": RespOkList},
                403: {"model": RespErrString}
            })
async def route_list():
    """List of GQL schema versions for download, returns array of versions as strings"""
    result = await schema_list()
    if "ERROR" in result.values():
        return JSONResponse(status_code=403, content=result)

    return JSONResponse(status_code=200, content=result)


@router.get("/schema/{version}",
            response_class=FileResponse,
            responses={
                200: {"description": "File successfully downloaded"},
                403: {"description": "Permission denied", "model": RespErrString},
                404: {"description": "File not found", "model": RespErrString},
            })
async def route_download(version):
    """Download GQL schema file by its version date identification"""
    return await schema_download(version)
