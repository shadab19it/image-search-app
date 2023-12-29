from enum import Enum
from pydantic import BaseModel
from typing import List, Optional


class Role(Enum):
    Admin = "admin"
    User = "user"


class ImageType(Enum):
    Mandap = "Mandap"
    Master = "Master"

# class ImageResult(BaseModel):
#     path:str
#     name:str
#     code:str
#     imageType:str
#     totalPrice:Optional[int]
#     metadata:Optional[object]


class ImageResult:
    def __init__(self, mdata, id, code, description, imageType, size, totalPrice, flowerPrice, otherPrice):
        self.id = id
        self.code = code
        self.description = description
        self.imageType = imageType
        self.size = size
        self.totalPrice = totalPrice
        self.flowerPrice = flowerPrice
        self.otherPrice = otherPrice
    
    