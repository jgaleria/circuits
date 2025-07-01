from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI(title="Circuits Backend API", version="1.0.0")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "service": "circuits-backend",
        "version": "1.0.0",
        "python_version": "3.11"
    }

@app.get("/")
async def root():
    return {"message": "Circuits FastAPI Backend"} 