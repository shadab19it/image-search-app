import base64
from fastapi.responses import FileResponse
from pydantic import BaseModel
from src.apis import apis
from src.prisma import prisma
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi import Body, FastAPI, HTTPException

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Make image URLs

app.mount("/apis/imgDB/master",
          StaticFiles(directory='imgDB/master'), name="master")
app.mount("/apis/imgDB/mandap",
          StaticFiles(directory='imgDB/mandap'), name="mandap")


app.include_router(apis, prefix="/apis")


@app.on_event("startup")
async def startup():
    await prisma.connect()


@app.on_event("shutdown")
async def shutdown():
    await prisma.disconnect()


class ImageFile(BaseModel):
    path: str


@app.post("/apis/get-image")
async def create_item(info: ImageFile):
    with open(info.path, "rb") as file:
        b64file = base64.b64encode(file.read()).decode("utf-8")
    return b64file


@app.get("/")
def read_root():
    return {"message": "Welcome to Melting flower"}
