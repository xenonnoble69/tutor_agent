from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from config import settings
from api import documents, syllabus, lessons, quiz, progress
from database.db import init_db
from vectorstore.qdrant_client import init_vector_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize resources on startup and cleanup on shutdown"""
    # Startup
    print("🚀 Starting Agentic AI Tutor...")
    
    # Create upload directory
    os.makedirs(settings.upload_dir, exist_ok=True)
    
    # Initialize database
    init_db()
    print("✅ Database initialized")
    
    # Initialize vector database
    await init_vector_db()
    print("✅ Vector database initialized")
    
    yield
    
    # Shutdown
    print("👋 Shutting down...")


app = FastAPI(
    title="Agentic AI Tutor API",
    description="Syllabus-aligned autonomous learning system",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
if os.path.exists(settings.upload_dir):
    app.mount("/uploads", StaticFiles(directory=settings.upload_dir), name="uploads")

# Include routers
app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])
app.include_router(syllabus.router, prefix="/api/syllabus", tags=["Syllabus"])
app.include_router(lessons.router, prefix="/api/lessons", tags=["Lessons"])
app.include_router(quiz.router, prefix="/api/quiz", tags=["Quiz"])
app.include_router(progress.router, prefix="/api/progress", tags=["Progress"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "🎓 Agentic AI Tutor API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug
    )
