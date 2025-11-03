from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from models.schemas import ProgressStats, TopicMastery, StudyPlan
from database.db import get_db
from database.models import UserTopicMastery, Topic
from datetime import datetime

router = APIRouter()


@router.get("/stats", response_model=ProgressStats)
async def get_progress_stats(
    user_id: int = 1,  # TODO: Get from auth
    db: Session = Depends(get_db)
):
    """Get user's overall progress statistics"""
    
    # Get all mastery records
    mastery_records = db.query(UserTopicMastery).filter(
        UserTopicMastery.user_id == user_id
    ).all()
    
    if not mastery_records:
        return ProgressStats(
            user_id=str(user_id),
            topics_completed=0,
            total_topics=0,
            average_score=0.0,
            weak_areas=[],
            strong_areas=[],
            last_activity=None
        )
    
    # Calculate statistics
    total_topics = db.query(Topic).count()
    topics_completed = len([m for m in mastery_records if m.score >= 70])
    average_score = sum(m.score for m in mastery_records) / len(mastery_records)
    
    # Identify weak and strong areas
    weak_areas = []
    strong_areas = []
    
    for mastery in mastery_records:
        topic = db.query(Topic).filter(Topic.id == mastery.topic_id).first()
        if topic:
            if mastery.score < 60:
                weak_areas.append(topic.name)
            elif mastery.score >= 80:
                strong_areas.append(topic.name)
    
    # Get last activity
    last_activity = max(m.last_practiced for m in mastery_records) if mastery_records else None
    
    return ProgressStats(
        user_id=str(user_id),
        topics_completed=topics_completed,
        total_topics=total_topics,
        average_score=round(average_score, 2),
        weak_areas=weak_areas[:5],  # Top 5
        strong_areas=strong_areas[:5],  # Top 5
        last_activity=last_activity
    )


@router.get("/topics", response_model=list[TopicMastery])
async def get_topic_mastery(
    user_id: int = 1,  # TODO: Get from auth
    db: Session = Depends(get_db)
):
    """Get mastery level for all topics"""
    
    mastery_records = db.query(UserTopicMastery).filter(
        UserTopicMastery.user_id == user_id
    ).all()
    
    result = []
    for mastery in mastery_records:
        topic = db.query(Topic).filter(Topic.id == mastery.topic_id).first()
        if topic:
            result.append(TopicMastery(
                topic=topic.name,
                score=mastery.score,
                attempts=mastery.attempts,
                last_practiced=mastery.last_practiced,
                next_revision=mastery.next_revision
            ))
    
    return result


@router.get("/study-plan", response_model=StudyPlan)
async def get_study_plan(
    user_id: int = 1,  # TODO: Get from auth
    db: Session = Depends(get_db)
):
    """Generate a weekly study plan"""
    
    # Get all topics with mastery
    mastery_records = db.query(UserTopicMastery).filter(
        UserTopicMastery.user_id == user_id
    ).all()
    
    # Get all topics
    all_topics = db.query(Topic).all()
    
    # Topics not yet studied
    studied_topic_ids = [m.topic_id for m in mastery_records]
    topics_to_study = [
        t.name for t in all_topics 
        if t.id not in studied_topic_ids
    ][:5]  # Top 5 new topics
    
    # Topics needing revision (low score or due for revision)
    topics_to_revise = []
    now = datetime.now()
    
    for mastery in mastery_records:
        topic = db.query(Topic).filter(Topic.id == mastery.topic_id).first()
        if topic:
            needs_revision = (
                mastery.score < 70 or
                (mastery.next_revision and mastery.next_revision <= now)
            )
            if needs_revision:
                topics_to_revise.append(topic.name)
    
    # Estimate hours (rough calculation)
    estimated_hours = len(topics_to_study) * 2 + len(topics_to_revise) * 1
    
    return StudyPlan(
        week_number=1,  # Could be calculated based on start date
        topics_to_study=topics_to_study,
        topics_to_revise=topics_to_revise[:5],  # Top 5
        estimated_hours=float(estimated_hours)
    )


@router.get("/revision-due")
async def get_revision_due(
    user_id: int = 1,  # TODO: Get from auth
    db: Session = Depends(get_db)
):
    """Get topics due for revision"""
    
    now = datetime.now()
    
    mastery_records = db.query(UserTopicMastery).filter(
        UserTopicMastery.user_id == user_id,
        UserTopicMastery.next_revision <= now
    ).all()
    
    topics_due = []
    for mastery in mastery_records:
        topic = db.query(Topic).filter(Topic.id == mastery.topic_id).first()
        if topic:
            topics_due.append({
                "topic": topic.name,
                "last_practiced": mastery.last_practiced,
                "score": mastery.score,
                "next_revision": mastery.next_revision
            })
    
    return {
        "topics_due": topics_due,
        "count": len(topics_due)
    }
