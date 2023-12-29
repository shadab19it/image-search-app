import datetime
from typing import List, Optional
from fastapi import APIRouter, HTTPException
from prisma.models import User
from pydantic import BaseModel
from dotenv import load_dotenv
from src.prisma import prisma
from enum import Enum as PydanticEnum
import random
from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException
import os
from src.utils.auth import (
    encryptPassword,
    signJWT,
    validatePassword,
)

# Load environment variables from .env file
load_dotenv()

# Load environment variables
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")


router = APIRouter()  # Function to send OTP via Twilio


# Function to generate a random 6-digit OTP
def generate_otp():
    return str(random.randint(100000, 999999))


def send_otp_via_twilio(phone_number: str, otp: str):
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    try:
        message = client.messages.create(
            body=f"Your Login OTP is: {otp}", from_=TWILIO_PHONE_NUMBER, to=phone_number
        )
    except TwilioRestException as e:
        # Handle Twilio exceptions here
        error_message = str(e)
        print(f"Twilio error: {error_message}")
        raise HTTPException(status_code=500, detail="Failed to send OTP")


class SignIn(BaseModel):
    phone: str
    password: Optional[str]


class RoleEnum(str, PydanticEnum):
    admin = "admin"
    user = "user"


class SignInResponse(BaseModel):
    token: str
    user: User
    message: str
    success: bool


@router.post("/auth/sign-in", tags=["auth"])
async def sign_in(signIn: SignIn):
    try:
        user = await prisma.user.find_first(
            where={
                "phone": signIn.phone,
            }
        )
        if user:
            if user.role == "user":
                if user.password:
                    validated = validatePassword(
                        signIn.password, user.password)
                    del user.password
                    del user.otp
                    if validated:
                        token = signJWT(user.id, user.role)
                        return SignInResponse(token=token, user=user, message="Login successfull", success=True)
                else:
                    raise HTTPException(
                        status_code=400, detail="Password Required!"
                    )
            else:
                NEW_GENERATED_OTP = generate_otp()
                await prisma.user.update(
                    where={"phone": signIn.phone}, data={"otp": NEW_GENERATED_OTP}
                )
                send_otp_via_twilio(signIn.phone, NEW_GENERATED_OTP)
                return {
                    "success": True,
                    "message": "OTP send to your register phone number. Please verify",
                }
        else:
            return HTTPException(status_code=404, detail="Phone number not registered")
    except Exception as err:
        raise HTTPException(
            status_code=400, detail=f"Something went wrong: {err}"
        )


class SignUp(BaseModel):
    email: str
    name: str
    password: Optional[str]
    role: RoleEnum
    phone: str


@router.post("/auth/register", tags=["auth"])
async def sign_up(user: SignUp):
    try:
        db_user = await prisma.user.find_first(
            where={
                "OR": [
                    {
                        "name": user.name
                    },
                    {
                        "phone": user.phone
                    }
                ]
            }
        )
        if db_user:
            raise HTTPException(
                status_code=400, detail="User already registered with this credentials"
            )
        passwordHash = ""
        if user.role == "user":
            if user.password:
                passwordHash = encryptPassword(user.password)
            else:
                raise HTTPException(
                    status_code=400, detail="Password Required!"
                )

        created = await prisma.user.create(
            {
                "email": user.email,
                "name": user.name,
                "password": passwordHash,
                "role": user.role,
                "phone": user.phone,
            }
        )

        return {"success": True, "message": "Registeration successfully, Now you can login"}
    except Exception as err:
        raise HTTPException(
            status_code=400, detail=f"Something went wrong: {err}"
        )


@router.get("/auth/verify-otp/{otp}", tags=["auth"])
async def verifyOTP(otp: str):
    db_user = await prisma.user.find_first(where={"otp": otp})
    if db_user:
        token = signJWT(db_user.id, db_user.role)
        await prisma.user.update(where={"phone": db_user.phone}, data={"otp": None})
        del db_user.otp
        return SignInResponse(token=token, user=db_user, message="OTP verificaton successfully", success=True)
    else:
        raise HTTPException(status_code=401, detail="OTP verification failed")


@router.get("/auth/", tags=["auth"])
async def auth():
    users = await prisma.user.find_many()
    return users
