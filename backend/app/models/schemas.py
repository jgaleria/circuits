from pydantic import BaseModel, EmailStr
from typing import Optional
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