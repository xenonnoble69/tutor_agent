from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import uuid

from models.schemas import (
    SyllabusInput, SyllabusParseResponse, SyllabusUnit,
    MappingResponse, TopicMapping
)
from database.db import get_db
from database.models import Syllabus, Topic
from ingestion.syllabus_parser import syllabus_parser
from vectorstore.qdrant_client import get_chunks_for_topic

router = APIRouter()


@router.post("/parse", response_model=SyllabusParseResponse)
async def parse_syllabus(
    syllabus_input: SyllabusInput,
    user_id: int = 1,  # TODO: Get from auth
    db: Session = Depends(get_db)
):
    """Parse syllabus text into structured format"""
    
    # Parse syllabus
    units = syllabus_parser.parse(syllabus_input.syllabus_text)
    
    # Generate syllabus ID
    syllabus_id = str(uuid.uuid4())
    
    # Save to database
    syllabus = Syllabus(
        id=syllabus_id,
        course_name=syllabus_input.course_name,
        raw_text=syllabus_input.syllabus_text,
        user_id=user_id
    )
    db.add(syllabus)
    
    # Save topics
    total_topics = 0
    for unit in units:
        for topic_name in unit.topics:
            topic_id = f"{syllabus_id}_{total_topics}"
            topic = Topic(
                topic_id=topic_id,
                name=topic_name,
                unit=unit.unit,
                syllabus_id=syllabus_id
            )
            db.add(topic)
            total_topics += 1
    
    db.commit()
    
    return SyllabusParseResponse(
        syllabus_id=syllabus_id,
        units=units,
        total_topics=total_topics
    )


@router.post("/map/{syllabus_id}", response_model=MappingResponse)
async def map_topics_to_content(
    syllabus_id: str,
    db: Session = Depends(get_db)
):
    """Map syllabus topics to document content"""
    
    # Get syllabus and topics
    syllabus = db.query(Syllabus).filter(Syllabus.id == syllabus_id).first()
    if not syllabus:
        raise HTTPException(status_code=404, detail="Syllabus not found")
    
    topics = db.query(Topic).filter(Topic.syllabus_id == syllabus_id).all()
    
    mappings = []
    topics_needing_content = []
    
    for topic in topics:
        # Get relevant chunks from vector store
        result = await get_chunks_for_topic(topic.name)
        
        mapping = TopicMapping(
            topic=topic.name,
            relevant_chunks=result['relevant_chunks'],
            confidence_score=result['confidence_score'],
            has_sufficient_content=result['has_sufficient_content']
        )
        mappings.append(mapping)
        
        # Update topic in database
        topic.has_sufficient_content = result['has_sufficient_content']
        
        if not result['has_sufficient_content']:
            topics_needing_content.append(topic.name)
    
    db.commit()
    
    return MappingResponse(
        mappings=mappings,
        total_mapped=len(mappings),
        topics_needing_content=topics_needing_content
    )


@router.get("/list")
async def list_syllabi(
    user_id: int = 1,  # TODO: Get from auth
    db: Session = Depends(get_db)
):
    """List all syllabi"""
    syllabi = db.query(Syllabus).filter(Syllabus.user_id == user_id).all()
    
    return {
        "syllabi": [
            {
                "id": syl.id,
                "course_name": syl.course_name,
                "created_at": syl.created_at,
                "topics_count": len(syl.topics)
            }
            for syl in syllabi
        ]
    }


@router.get("/{syllabus_id}/topics")
async def get_syllabus_topics(
    syllabus_id: str,
    db: Session = Depends(get_db)
):
    """Get all topics for a syllabus"""
    topics = db.query(Topic).filter(Topic.syllabus_id == syllabus_id).all()
    
    return {
        "topics": [
            {
                "id": topic.topic_id,
                "name": topic.name,
                "unit": topic.unit,
                "has_sufficient_content": topic.has_sufficient_content
            }
            for topic in topics
        ]
    }
