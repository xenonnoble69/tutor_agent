from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings"""
    
    # Gemini API
    gemini_api_key: str
    
    # Vector Database
    qdrant_url: str = "http://localhost:6333"
    qdrant_api_key: Optional[str] = None
    
    # Database
    database_url: str = "sqlite:///./tutor_agent.db"
    
    # Application
    debug: bool = True
    host: str = "0.0.0.0"
    port: int = 8000
    
    # Upload
    upload_dir: str = "./uploads"
    max_upload_size: int = 10485760  # 10MB
    
    # Vector store
    collection_name: str = "documents"
    embedding_model: str = "models/embedding-001"
    vector_size: int = 768
    
    # Chunking
    chunk_size: int = 400
    chunk_overlap: int = 50
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
