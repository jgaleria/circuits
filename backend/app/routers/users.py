from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.services.users_service import get_all_users, get_user_by_id
from app.models.schemas import User, UserResponse

router = APIRouter(prefix="/api/users", tags=["users"])

@router.get("/", response_model=UserResponse)
async def list_users(
    limit: Optional[int] = Query(10, ge=1, le=100, description="Number of users to return"),
    offset: Optional[int] = Query(0, ge=0, description="Number of users to skip")
):
    """Get all users with pagination"""
    try:
        users_data = await get_all_users()
        # Apply pagination
        paginated_users = users_data[offset:offset + limit]
        return UserResponse(
            users=paginated_users,
            count=len(users_data)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching users: {str(e)}"
        )

@router.get("/{user_id}")
async def get_user(user_id: str):
    """Get a specific user by ID"""
    try:
        user_data = await get_user_by_id(user_id)
        if not user_data:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
        return user_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching user: {str(e)}"
        )

@router.get("/test/connection")
async def test_users_table():
    """Test connection to users table"""
    try:
        users_data = await get_all_users()
        return {
            "status": "success",
            "message": "Successfully connected to users table",
            "total_users": len(users_data),
            "sample_user": users_data[0] if users_data else None
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error connecting to users table: {str(e)}"
        ) 