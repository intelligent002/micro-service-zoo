from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def read_root():
    """
    FastAPI index of the app
    :return:
    """
    return {"message": "Welcome to FastAPI!"}
