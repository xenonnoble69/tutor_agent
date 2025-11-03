from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import os
import uuid

from models.schemas import DocumentUploadResponse
from database.db import get_db
from database.models import Document
from ingestion.document_processor import document_processor
from vectorstore.qdrant_client import add_chunks_to_vectorstore
from config import settings

router = APIRouter()


@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(
    file: UploadFile = File(...),
    user_id: int = 1,  # TODO: Get from auth
    db: Session = Depends(get_db)
):
    """Upload and process a document"""
    
    # Validate file type
    allowed_extensions = ['.pdf', '.docx', '.txt']
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"File type {file_ext} not supported. Allowed: {allowed_extensions}"
        )
    
    # Generate unique document ID
    doc_id = str(uuid.uuid4())
    
    # Save file
    file_path = os.path.join(settings.upload_dir, f"{doc_id}_{file.filename}")
    
    with open(file_path, "wb") as f:
        content = await file.read()
        f.write(content)
    
    try:
        # Process document
        chunks = document_processor.process_document(file_path, file.filename)
        
        # Add to vector store
        chunks_added = await add_chunks_to_vectorstore(chunks)
        
        # Save to database
        document = Document(
            id=doc_id,
            filename=file.filename,
            file_path=file_path,
            user_id=user_id,
            chunks_count=chunks_added
        )
        db.add(document)
        db.commit()
        
        return DocumentUploadResponse(
            document_id=doc_id,
            filename=file.filename,
            chunks_created=chunks_added,
            message=f"Document processed successfully. {chunks_added} chunks created."
        )
    
    except Exception as e:
        # Clean up on error
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/list")
async def list_documents(
    user_id: int = 1,  # TODO: Get from auth
    db: Session = Depends(get_db)
):
    """List all uploaded documents"""
    documents = db.query(Document).filter(Document.user_id == user_id).all()
    
    return {
        "documents": [
            {
                "id": doc.id,
                "filename": doc.filename,
                "upload_date": doc.upload_date,
                "chunks_count": doc.chunks_count
            }
            for doc in documents
        ]
    }


@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    db: Session = Depends(get_db)
):
    """Delete a document"""
    document = db.query(Document).filter(Document.id == document_id).first()
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Delete file
    if os.path.exists(document.file_path):
        os.remove(document.file_path)
    
    # Delete from database
    db.delete(document)
    db.commit()
    
    return {"message": "Document deleted successfully"}
