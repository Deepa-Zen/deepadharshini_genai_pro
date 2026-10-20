from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.services.activity_logger import activity_logger

router = APIRouter(prefix="/auth", tags=["Authentication"])

class LoginRequest(BaseModel):
    email: str
    password: str
    role: Optional[str] = "user" # "admin" or "user"

class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str
    role: Optional[str] = "user"

@router.post("/login")
async def login(req: LoginRequest):
    email = req.email.strip().lower()
    is_admin = req.role == "admin" or "admin" in email

    user_info = {
        "id": "admin-001" if is_admin else "user-101",
        "email": req.email,
        "full_name": "System Administrator" if is_admin else (req.email.split("@")[0].title() or "Traveler"),
        "role": "admin" if is_admin else "user",
        "token": f"bearer-{req.role}-token-xyz",
        "avatar": "https://api.dicebear.com/7.x/bottts/svg?seed=Admin" if is_admin else "https://api.dicebear.com/7.x/adventurer/svg?seed=Traveler"
    }

    activity_logger.log_activity(
        user_name=user_info["full_name"],
        user_email=req.email,
        action="User Login",
        details=f"Logged in successfully as {user_info['role'].upper()}"
    )

    return {"status": "success", "user": user_info}

@router.post("/register")
async def register(req: RegisterRequest):
    is_admin = req.role == "admin" or "admin" in req.email.lower()
    user_info = {
        "id": "user-reg-" + req.email[:4],
        "email": req.email,
        "full_name": req.full_name,
        "role": "admin" if is_admin else "user",
        "token": f"bearer-{req.role}-token-xyz",
        "avatar": "https://api.dicebear.com/7.x/adventurer/svg?seed=" + req.full_name
    }

    activity_logger.log_activity(
        user_name=user_info["full_name"],
        user_email=req.email,
        action="User Registration",
        details=f"New account created ({user_info['role'].upper()})"
    )

    return {"status": "success", "user": user_info}
