from typing import List, Optional
from app.services.supabase_client import get_supabase_client
from app.models.schemas import User
import logging

logger = logging.getLogger(__name__)

async def get_all_users() -> List[dict]:
    """Get all users from the users table"""
    try:
        supabase = get_supabase_client()
        response = supabase.table('users').select('*').execute()
        if response.data:
            logger.info(f"Retrieved {len(response.data)} users")
            return response.data
        else:
            logger.warning("No users found")
            return []
    except Exception as e:
        logger.error(f"Error fetching users: {e}")
        raise

async def get_user_by_id(user_id: str) -> Optional[dict]:
    """Get a specific user by ID"""
    try:
        supabase = get_supabase_client()
        response = supabase.table('users').select('*').eq('id', user_id).single().execute()
        if response.data:
            logger.info(f"Retrieved user: {user_id}")
            return response.data
        else:
            logger.warning(f"User not found: {user_id}")
            return None
    except Exception as e:
        logger.error(f"Error fetching user {user_id}: {e}")
        raise 