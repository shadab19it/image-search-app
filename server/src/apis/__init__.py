from fastapi import APIRouter

from src.apis.auth import router as authRouter
from src.apis.users import router as usersRouter
from src.apis.dbOperatons import router as dbOperationRouter
from src.apis.imageSearch import router as imgSearchRouter
from src.apis.masterSearch import router as masterSearchRouter


apis = APIRouter()
apis.include_router(authRouter)
apis.include_router(usersRouter)
apis.include_router(dbOperationRouter)
apis.include_router(imgSearchRouter)
apis.include_router(masterSearchRouter)

__all__ = ["apis"]
