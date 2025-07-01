from typing import Dict, Any, Optional
from app.services.supabase_client import get_supabase_client
from app.models.schemas import LoginRequest, SignupRequest
import logging

logger = logging.getLogger(__name__)

async def authenticate_user(login_data: LoginRequest) -> Dict[str, Any]:
    """Authenticate user with Supabase"""
    try:
        supabase = get_supabase_client()
        response = supabase.auth.sign_in_with_password({
            "email": login_data.email,
            "password": login_data.password
        })
        if not response.user or not response.session:
            raise ValueError("Invalid credentials")
        return {
            "user": response.user.model_dump(),
            "session": response.session.model_dump(),
            "access_token": response.session.access_token
        }
    except Exception as e:
        logger.error(f"Authentication error: {e}")
        raise

async def create_user(signup_data: SignupRequest) -> Dict[str, Any]:
    """Create new user with Supabase"""
    try:
        supabase = get_supabase_client()
        response = supabase.auth.sign_up({
            "email": signup_data.email,
            "password": signup_data.password,
            "options": {
                "data": {
                    "display_name": signup_data.display_name
                }
            }
        })
        if not response.user:
            raise ValueError("Failed to create user")
        # Create profile entry if user was created successfully
        if response.user and signup_data.display_name:
            await create_user_profile(response.user.id, signup_data.display_name)
        return {
            "user": response.user.model_dump(),
            "session": response.session.model_dump() if response.session else None,
            "access_token": response.session.access_token if response.session else None
        }
    except Exception as e:
        logger.error(f"User creation error: {e}")
        raise

async def create_user_profile(user_id: str, display_name: str) -> None:
    """Create profile for new user"""
    try:
        supabase = get_supabase_client()
        profile_data = {
            "id": user_id,
            "display_name": display_name,
            "created_at": "now()",
            "updated_at": "now()"
        }
        supabase.table("profiles").insert(profile_data).execute()
        logger.info(f"Created profile for user: {user_id}")
    except Exception as e:
        logger.error(f"Profile creation error: {e}")
        # Don't raise here - user creation succeeded, profile creation is secondary

async def refresh_token(refresh_token: str) -> Dict[str, Any]:
    """Refresh Supabase session token"""
    try:
        supabase = get_supabase_client()
        response = supabase.auth.refresh_session(refresh_token)
        if not response.session:
            raise ValueError("Failed to refresh token")
        return {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "expires_in": response.session.expires_in,
            "user": response.user.model_dump() if response.user else None
        }
    except Exception as e:
        logger.error(f"Token refresh error: {e}")
        raise 