from pydantic import BaseModel, EmailStr
from typing import Optional, List
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