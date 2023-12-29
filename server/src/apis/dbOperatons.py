from typing import List
from fastapi import APIRouter, HTTPException
from src.prisma import prisma
from pydantic import BaseModel
from src.utils.utils import percentage_to_value,calculateRatePer
from src.models.scalar import ImageType,ImageResult
import csv
import os

router = APIRouter()


@router.get("/get-mandap-rate/{code}/{per}", tags=["DB Operations"])
async def read_data(code: str, per: int):
    metaData = await prisma.meltingflowerimgs.find_unique(where={"code": code, "imageType": "Mandap"})
    percentage = int(per)
    flowerPrice = metaData.flowerPrice
    otherPrice = metaData.otherPrice
    perValue = percentage_to_value(int(percentage), int(flowerPrice))
    newTolalPrice = int(flowerPrice) + int(otherPrice) + int(perValue)

    return {"metadata": metaData, "perValue": perValue, "newTolalPrice": newTolalPrice}


# TODO ADD DYNAMIC CSV FILE
@router.get("/insert-file-metadata/", tags=['DB Operations'])
async def insert():
    # await prisma.meltingflowerimgs.delete_many()
    with open('meltingflower-mandap.csv', 'r') as csv_file:
        csv_reader = csv.reader(csv_file)
        data = csv_reader

        for index, row in enumerate(data):
            if index == 0:
                ""
            else:
                await prisma.meltingflowerimgs.create(
                    {
                        "code": row[0],
                        "description": row[1],
                        "imageType": row[2],
                        "size": row[3],
                        "totalPrice": int(row[4]),
                        "flowerPrice": int(row[5]),
                        "otherPrice": int(row[6])
                    }
                )
    return {"message": "Success"}


class ImagePushDB(BaseModel):
    imageType: str
    dir: str
    token: str

@router.post("/push-images-to-db", tags=["DB Operations"])
async def pushImgsTodb(info: ImagePushDB):
    # await prisma.allimages.delete_many(where={"imageType":info.imageType})

    try:
        imagesPath = []
        for filename in os.listdir(info.dir):
            filePath = f"{info.dir}/{filename}"

            # For Updating the file
            # image = await prisma.allimages.update(where={"name": filename}, data={"code": code})
            # imagesPath.append(image)
            existing_record = await prisma.allimages.find_first(where={"path": filePath})
            if existing_record is None:
              code, file_extension = os.path.splitext(filename)
              image = await prisma.allimages.create(data={"name": filename, "path": filePath, "imageType": info.imageType, "code": code })
              imagesPath.append(image)

        return {"success": True, "message": f"images are pushed to db from dir. {info.dir}", "data": imagesPath, "tolal": len(imagesPath)}
    except Exception as err:
        raise HTTPException(
            status_code=400, detail=f"Something went wrong: {err}"
        )
        
        


@router.get("/get-db-images/{imageType}/{pageSize}/{pageNo}", tags=["DB Operations"])
async def getImgesFromDB(imageType: str, pageSize: int = 20, pageNo: int = 1, ratePer:int= 0):
    try:
        resultData= []
        skip = pageSize * (pageNo - 1)
        images = await prisma.allimages.find_many(where={"imageType": imageType}, skip=skip, take=pageSize)
        total_count = await prisma.allimages.count(where={"imageType": imageType})
        for img in images:
            metadata = await prisma.meltingflowerimgs.find_first(where={"code": img.code,"imageType": imageType})
            if metadata is None:
               new_obj = {**img.__dict__,"totalPrice":0,"name":img.name}
               resultData.append(new_obj)
            else:
               totalPrice =await calculateRatePer(metadata=metadata,ratePer=int(ratePer))
               new_obj = {**img.__dict__,"totalPrice":totalPrice,"metadata":metadata}
               resultData.append(new_obj)
        return {"success": True, "message": f"Images Found", "result": resultData, "tolal_count": total_count}

    except Exception as err:
        raise HTTPException(
            status_code=400, detail=f"Something went wrong: {err}"
        )
