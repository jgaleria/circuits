from fastapi import APIRouter, HTTPException, status, Depends
from app.models.schemas import LoginRequest, SignupRequest, AuthResponse, TokenResponse
from app.services.auth_service import authenticate_user, create_user, refresh_token
from app.middleware.auth import get_current_user
from typing import Dict, Any

router = APIRouter(prefix="/api/auth", tags=["authentication"])

@router.post("/login", response_model=AuthResponse)
async def login(login_data: LoginRequest):
    """Login user with email and password"""
    try:
        auth_result = await authenticate_user(login_data)
        return AuthResponse(
            user=auth_result["user"],
            session=auth_result["session"],
            access_token=auth_result["access_token"],
            token_type="bearer"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authentication failed"
        )

@router.post("/signup", response_model=AuthResponse)
async def signup(signup_data: SignupRequest):
    """Create new user account"""
    try:
        auth_result = await create_user(signup_data)
        return AuthResponse(
            user=auth_result["user"],
            session=auth_result["session"] or {},
            access_token=auth_result["access_token"] or "",
            token_type="bearer"
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Account creation failed"
        )

@router.post("/refresh", response_model=TokenResponse)
async def refresh_access_token(refresh_token: str):
    """Refresh access token"""
    try:
        refresh_result = await refresh_token(refresh_token)
        return TokenResponse(
            access_token=refresh_result["access_token"],
            token_type="bearer",
            expires_in=refresh_result["expires_in"],
            user=refresh_result["user"]
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token refresh failed"
        )

@router.get("/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current authenticated user information"""
    return {
        "user": current_user,
        "authenticated": True
    }

@router.post("/logout")
async def logout():
    """Logout user (client should delete token)"""
    return {"message": "Logged out successfully"} 