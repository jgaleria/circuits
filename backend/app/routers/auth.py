from fastapi import APIRouter, HTTPException, status, Depends
from app.models.schemas import LoginRequest, SignupRequest, AuthResponse, TokenResponse, PasswordUpdateRequest, ForgotPasswordRequest, ResetPasswordRequest
from app.services.auth_service import authenticate_user, create_user, refresh_token, update_password, forgot_password, reset_password
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

@router.put("/password")
async def change_password(
    data: PasswordUpdateRequest,
    current_user: dict = Depends(get_current_user)
):
    """Update password for authenticated user"""
    try:
        await update_password(current_user.id, data)
        return {"message": "Password updated successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/forgot-password")
async def forgot_password_route(data: ForgotPasswordRequest):
    """Send password reset email"""
    try:
        await forgot_password(data)
        return {"message": "Password reset email sent"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/reset-password")
async def reset_password_route(data: ResetPasswordRequest):
    """Reset password using token"""
    try:
        await reset_password(data)
        return {"message": "Password has been reset"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        ) 