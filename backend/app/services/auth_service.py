from typing import Dict, Any, Optional
from app.services.supabase_client import get_supabase_client
from app.models.schemas import LoginRequest, SignupRequest, PasswordUpdateRequest, ForgotPasswordRequest, ResetPasswordRequest
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

async def update_password(user_id: str, data: PasswordUpdateRequest) -> None:
    """Update the password for an authenticated user"""
    try:
        supabase = get_supabase_client()
        # Supabase requires the user to be authenticated; update_user expects the new password
        response = supabase.auth.admin.update_user_by_id(user_id, {"password": data.new_password})
        if response.user is None:
            raise ValueError("Failed to update password")
    except Exception as e:
        logger.error(f"Password update error: {e}")
        raise

async def forgot_password(data: ForgotPasswordRequest) -> None:
    """Send a password reset email"""
    try:
        supabase = get_supabase_client()
        response = supabase.auth.reset_password_for_email(data.email)
        if response is None or getattr(response, 'error', None):
            raise ValueError("Failed to send password reset email")
    except Exception as e:
        logger.error(f"Forgot password error: {e}")
        raise

async def reset_password(data: ResetPasswordRequest) -> None:
    """Reset password using a token (from email link)"""
    try:
        supabase = get_supabase_client()
        # This is a placeholder; actual implementation may depend on Supabase SDK
        response = supabase.auth.update_user({"password": data.new_password}, data.token)
        if response.user is None:
            raise ValueError("Failed to reset password")
    except Exception as e:
        logger.error(f"Reset password error: {e}")
        raise 