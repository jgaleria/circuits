from fastapi import APIRouter, HTTPException, status, Depends
from app.models.schemas import Profile, ProfileUpdate
from app.services.profile_service import get_user_profile, update_user_profile
from app.middleware.auth import require_auth
from typing import Dict, Any

router = APIRouter(prefix="/api/profiles", tags=["profiles"])

@router.get("/me", response_model=Profile)
async def get_current_user_profile(current_user: dict = Depends(require_auth)):
    """Get current user's profile"""
    try:
        user_id = current_user.id
        profile_data = await get_user_profile(user_id)
        if not profile_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found"
            )
        return profile_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching profile: {str(e)}"
        )

@router.put("/me", response_model=Profile)
async def update_current_user_profile(
    updates: ProfileUpdate,
    current_user: dict = Depends(require_auth)
):
    """Update current user's profile"""
    try:
        user_id = current_user.id
        updated_profile = await update_user_profile(user_id, updates)
        return updated_profile
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating profile: {str(e)}"
        )

@router.get("/{user_id}", response_model=Profile)
async def get_profile_by_id(
    user_id: str,
    current_user: dict = Depends(require_auth)
):
    """Get profile by user ID (for admin or same user)"""
    try:
        # Users can only access their own profile unless they're admin
        if current_user.id != user_id:
            # Add admin check here if you have role-based access
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        profile_data = await get_user_profile(user_id)
        if not profile_data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Profile not found"
            )
        return profile_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching profile: {str(e)}"
        )

# Add profile endpoints here 