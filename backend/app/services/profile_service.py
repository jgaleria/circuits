from typing import Optional, Dict, Any
from app.services.supabase_client import get_supabase_client
from app.models.schemas import Profile, ProfileUpdate
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

async def get_user_profile(user_id: str) -> Optional[Dict[str, Any]]:
    """Get user profile by ID"""
    try:
        supabase = get_supabase_client()
        response = supabase.table("profiles").select("*").eq("id", user_id).single().execute()
        if response.data:
            logger.info(f"Retrieved profile for user: {user_id}")
            return response.data
        else:
            logger.warning(f"No profile found for user: {user_id}")
            return None
    except Exception as e:
        logger.error(f"Error fetching profile for {user_id}: {e}")
        raise

async def update_user_profile(user_id: str, updates: ProfileUpdate) -> Dict[str, Any]:
    """Update user profile"""
    try:
        supabase = get_supabase_client()
        # Prepare update data
        update_data = {
            **updates.model_dump(exclude_unset=True),
            "updated_at": datetime.utcnow().isoformat()
        }
        response = supabase.table("profiles").update(update_data).eq("id", user_id).execute()
        if response.data and len(response.data) > 0:
            logger.info(f"Updated profile for user: {user_id}")
            return response.data[0]
        else:
            raise ValueError("Profile update failed")
    except Exception as e:
        logger.error(f"Error updating profile for {user_id}: {e}")
        raise

async def create_user_profile(user_id: str, display_name: Optional[str] = None) -> Dict[str, Any]:
    """Create new user profile"""
    try:
        supabase = get_supabase_client()
        profile_data = {
            "id": user_id,
            "display_name": display_name,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        response = supabase.table("profiles").insert(profile_data).execute()
        if response.data and len(response.data) > 0:
            logger.info(f"Created profile for user: {user_id}")
            return response.data[0]
        else:
            raise ValueError("Profile creation failed")
    except Exception as e:
        logger.error(f"Error creating profile for {user_id}: {e}")
        raise 