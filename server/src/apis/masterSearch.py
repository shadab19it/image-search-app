from pydantic import BaseModel
from dotenv import load_dotenv
from src.prisma import prisma
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from src.utils.auth import JWTBearer, decodeJWT

# for model image search
from fastapi import FastAPI, UploadFile, File, Response, Body, Request
from sentence_transformers import SentenceTransformer, util
from DeepImageSearch import Load_Data, Search_Setup
from datasets import load_dataset
from io import BytesIO
import base64
from  PIL import  Image
router = APIRouter()


# RUN and Train Model on First run the app
# **************************************************************************

# SETUP FOR SEARCHING IMAGE WITH TEXT

print("Start : download data")
dataForImgToText = load_dataset("imagefolder", data_dir='imgDB/master', split="train")
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


@router.get("/master/search-image-with-text")
async def search_text_with_image(searchText: str, pageSize: int = 10):
    if len(searchText.strip()) == 0:
        return {"success": False, "message": "Search Query Missing"}
    try:
        query_embedding = model.encode([searchText], convert_to_tensor=True)
        results = util.semantic_search(query_embedding, image_embeddings, top_k=pageSize)[0]

        result_images = []
        for r in results:
            # Convert the image to a binary format
            image_binary = textImgData[r['corpus_id']]
            # print("filename",r)
            buffered = BytesIO()
            image_binary.save(buffered, format="PNG")
            img_str = base64.b64encode(buffered.getvalue())
            result_images.append(
                {"img_str": img_str, "name": "", "totalPrice": "", "metadata": ""})

        return {"success": True, "result": result_images}
    except Exception as e:
        return {"success": False, "result": [], "message": "Result not Found", "error": f"{e}"}
