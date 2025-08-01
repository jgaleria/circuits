from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.services.supabase_client import get_supabase_client
from app.routers import users, auth, profiles  # Import profiles router
from app.routers import chat  # Import chat router
import os

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '.env'))
print("OPENAI_API_KEY:", os.environ.get("OPENAI_API_KEY"))

app = FastAPI(title="Circuits Backend API", version="1.0.0")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://frontend:3000",
        "http://127.0.0.1:3000",
        "http://0.0.0.0:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)
app.include_router(auth.router)
app.include_router(profiles.router)
app.include_router(chat.router)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "service": "circuits-backend",
        "version": "1.0.0",
        "python_version": "3.11"
    }

@app.get("/test-supabase")
async def test_supabase_connection():
    try:
        supabase = get_supabase_client()
        # Test 1: Simple connection test
        response = supabase.table('profiles').select('id').limit(1).execute()
        # Test 2: Check if we can access auth users (admin operation)
        auth_response = supabase.auth.admin.list_users()
        return {
            "status": "success",
            "message": "Supabase connection working",
            "connection": "established",
            "profiles_table": "accessible",
            "auth_admin": "accessible",
            "user_count": len(auth_response.users) if hasattr(auth_response, 'users') and auth_response.users else 0
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Supabase connection failed: {str(e)}"
        )

@app.get("/")
async def root():
    return {"message": "Circuits FastAPI Backend"}

@app.get("/debug/network")
async def debug_network(request: Request):
    return {
        "client_host": request.client.host if request.client else "unknown",
        "headers": dict(request.headers),
        "base_url": str(request.base_url),
        "url": str(request.url)
    } 