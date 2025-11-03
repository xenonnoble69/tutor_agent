from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import uuid

from models.schemas import (
    LessonPlan, LessonPlanItem,
    TeachingRequest, TeachingResponse
)
from database.db import get_db
from database.models import Topic, SessionHistory
from vectorstore.qdrant_client import get_chunks_for_topic
from agents.agents import planner_agent, teaching_agent

router = APIRouter()


@router.post("/plan/{syllabus_id}", response_model=LessonPlan)
async def create_lesson_plan(
    syllabus_id: str,
    db: Session = Depends(get_db)
):
    """Create a lesson plan for a syllabus"""
    
    # Get all topics
    topics = db.query(Topic).filter(Topic.syllabus_id == syllabus_id).all()
    
    if not topics:
        raise HTTPException(status_code=404, detail="No topics found for this syllabus")
    
    # Get context for each topic
    topic_names = [t.name for t in topics]
    context_chunks = {}
    
    for topic in topics:
        result = await get_chunks_for_topic(topic.name, limit=3)
        context_chunks[topic.name] = [c['chunk_id'] for c in result['chunks_data']]
    
    # Generate lesson plan
    lessons = await planner_agent.create_lesson_plan(topic_names, context_chunks)
    
    plan_id = str(uuid.uuid4())
    
    lesson_items = [
        LessonPlanItem(**lesson)
        for lesson in lessons
    ]
    
    return LessonPlan(
        plan_id=plan_id,
        lessons=lesson_items,
        total_lessons=len(lesson_items)
    )


@router.post("/teach", response_model=TeachingResponse)
async def teach_topic(
    request: TeachingRequest,
    user_id: int = 1,  # TODO: Get from auth
    db: Session = Depends(get_db)
):
    """Interactive teaching session"""
    
    # Get relevant chunks for topic
    result = await get_chunks_for_topic(request.topic, limit=5)
    
    if not result['chunks_data']:
        raise HTTPException(
            status_code=404,
            detail="No content found for this topic. Please upload relevant documents."
        )
    
    chunks_text = [c['text'] for c in result['chunks_data']]
    
    # Generate session ID if new session
    session_id = request.session_id or str(uuid.uuid4())
    
    # Get teaching response
    response = await teaching_agent.teach_topic(
        topic=request.topic,
        chunks=chunks_text,
        user_message=request.user_message
    )
    
    # Save to history
    if request.user_message:
        history = SessionHistory(
            session_id=session_id,
            user_id=user_id,
            topic=request.topic,
            question=request.user_message,
            student_answer=""  # Updated when student responds
        )
        db.add(history)
        db.commit()
    
    return TeachingResponse(
        session_id=session_id,
        message=response['message'],
        follow_up_question=response['follow_up_question']
    )


@router.get("/session/{session_id}")
async def get_session_history(
    session_id: str,
    db: Session = Depends(get_db)
):
    """Get teaching session history"""
    
    history = db.query(SessionHistory).filter(
        SessionHistory.session_id == session_id
    ).order_by(SessionHistory.timestamp).all()
    
    return {
        "session_id": session_id,
        "messages": [
            {
                "question": h.question,
                "answer": h.student_answer,
                "timestamp": h.timestamp
            }
            for h in history
        ]
    }
