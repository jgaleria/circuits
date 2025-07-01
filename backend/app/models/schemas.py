from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

class Profile(BaseModel):
    id: str
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class ProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None

class User(BaseModel):
    id: int
    email: str
    name: Optional[str] = None
    # Only include fields that exist in your users table

class UserResponse(BaseModel):
    users: List[User]
    count: int

# Authentication models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    display_name: Optional[str] = None

class AuthResponse(BaseModel):
    user: Dict[str, Any]
    session: Dict[str, Any]
    access_token: str
    token_type: str = "bearer"

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int 