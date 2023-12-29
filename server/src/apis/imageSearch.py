from pydantic import BaseModel
from dotenv import load_dotenv
from src.prisma import prisma
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from src.utils.auth import JWTBearer, decodeJWT
from PIL import Image
from src.utils.utils import percentage_to_value, calculateRatePer
import os

# for model image search
from fastapi import FastAPI, UploadFile, File, Response, Body, Request
from sentence_transformers import SentenceTransformer, util
from DeepImageSearch import Load_Data, Search_Setup
from datasets import load_dataset
from io import BytesIO
import base64

router = APIRouter()


# RUN and Train Model on First run the app
# **************************************************************************

# SETUP FOR SEARCHING IMAGE WITH TEXT

print("Start : download data")
dataForTrain = Load_Data().from_folder(["imgDB/mandap", "imgDB/master"])
dataForImgToText = load_dataset("imagefolder", data_dir="imgDB/mandap", split="train")
textImgData = dataForImgToText["image"]
# GET ALL THE IAMGES FROM LIST
print("Completed : download data")


# TRAIN THE MODEL

# GET THE REQUIRED MODEL
print("Start : Downloading and creating model")
model = SentenceTransformer("clip-ViT-B-32")
print("Completed : Downloading and creating model")


print("Start : Embedding Images")
image_embeddings = model.encode([image for image in textImgData])
print("Completed : Embedding Images")


# **************************************************************************

# SETUP FOR SEARCHING IMAGE WITH IMAGE

print("Start : Download and train model for IMG to IMG")
st = Search_Setup(image_list=dataForTrain, model_name="vgg19", pretrained=True, image_count=500)
print("Start : Indexing Images for img to img search, it's take some time")

print("Start Indexing")
# Index the images
st.run_index()


print("Start : Get metadata")
# Get metadata
metadata = st.get_image_metadata_file()


@router.post("/search-image-with-image")
async def root(file: UploadFile = File(...), pageSize: int = 10, ratePer: int = 0, imageType: str = ""):
    # Specify the file path where you want to save the decoded file

    try:
        imgFile = await file.read()
        output_file_path = f"/{file.filename}"

        # Write the binary data to a file
        with open(output_file_path, "wb") as output_file:
            output_file.write(imgFile)

        # Search Similar images
        similarImg = st.get_similar_images(image_path=output_file_path, number_of_images=pageSize)
        arrayImgs = list(similarImg)


        imgList = []
        for item in arrayImgs:
            filePath = similarImg[item]
            fileName = filePath.split("/")[2]
            # print("2", filePath,fileName)
            code, file_extension = os.path.splitext(fileName)
            imgMetaData = await prisma.meltingflowerimgs.find_first(where={"code": code})
            imgInfo = await prisma.allimages.find_first(where={"code": code})
            # print(imgInfo)
            if imgMetaData is not None:
                totalPrice = await calculateRatePer(metadata=imgMetaData, ratePer=ratePer)
                new_obj = {**imgInfo.__dict__,"totalPrice": totalPrice, "metadata": imgMetaData}
                imgList.append(new_obj)
            else:
                totalPrice = 0
                new_obj = {**imgInfo.__dict__,"totalPrice": totalPrice, "metadata": '',"name":fileName}
                imgList.append(new_obj)

        return {"success": True, "result": imgList, "message": "Images Found"}

    except Exception as e:
        return {
            "success": False,
            "result": [],
            "message": "Result not Found",
            "error": f"{e}",
        }


@router.get("/search-image-with-text")
async def search_text_with_image(searchText: str, pageSize: int = 10, ratePer: int = 0):
    if len(searchText.strip()) == 0:
        return {"success": False, "message": "Search Query Missing"}
    try:
        query_embedding = model.encode([searchText], convert_to_tensor=True)
        results = util.semantic_search(query_embedding, image_embeddings, top_k=pageSize)[0]
        result_images = []
        for r in results:
            # Convert the image to a binary format
            image_binary = textImgData[r["corpus_id"]]
            buffered = BytesIO()
            image_binary.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue())
            result_images.append({"img_str": img_str, "name": "", "totalPrice": "", "metadata": ""})

        return {"success": True, "result": result_images}
    except Exception as e:
        return {
            "success": False,
            "result": [],
            "message": "Result not Found",
            "error": f"{e}",
        }


@router.post("/master/search-image-with-image")
async def masterImgSearch(file: UploadFile = File(...), pageSize: int = 10, ratePer: int = 0, imageType: str = ""):
    # Specify the file path where you want to save the decoded file
    try:
        imgFile = await file.read()
        output_file_path = f"/{file.filename}"

        # Write the binary data to a file
        with open(output_file_path, "wb") as output_file:
            output_file.write(imgFile)
        similarImg = st.get_similar_images(image_path=output_file_path, number_of_images=pageSize)
        arrayImgs = list(similarImg)

        imgList = []
        for item in arrayImgs:
            filePath = similarImg[item]
            fileName = filePath.split("/")[2]
            code, file_extension = os.path.splitext(fileName)
            imgMetaData = await prisma.meltingflowerimgs.find_first(where={"code": code})
            imgInfo = await prisma.allimages.find_first(where={"code": code})

            if imgMetaData is not None:
                totalPrice = calculateRatePer(metadata=imgMetaData, ratePer=ratePer)
                new_obj = {**imgInfo.__dict__,"totalPrice": totalPrice, "metadata": imgMetaData}
                imgList.append(new_obj)
            else:
                totalPrice = 0
                new_obj = {**imgInfo.__dict__,"totalPrice": totalPrice, "metadata": '',"name":fileName}
                imgList.append(new_obj)

        return {"success": True, "result": imgList, "message": "Images Found"}

    except Exception as e:

        return {
            "success": False,
            "result": [],
            "message": "Result not Found",
            "error": f"e",
        }
