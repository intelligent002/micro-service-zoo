from fastapi import APIRouter

from app.schemas.common import RespOkString

router = APIRouter()


@router.get("/",
            response_model=RespOkString,
            responses={
                200: {"model": RespOkString}
            })
async def read_root():
    """FastAPI index of the app"""
    return {"status": "OK", "result": "Welcome to FastAPI!"}
