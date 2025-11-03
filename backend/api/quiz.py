from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import uuid

from models.schemas import (
    QuizGenerateRequest, QuizGenerateResponse, QuizQuestion,
    QuizSubmission, QuizResult
)
from database.db import get_db
from database.models import Quiz, QuizAttempt, UserTopicMastery, Topic
from vectorstore.qdrant_client import get_chunks_for_topic
from agents.agents import quiz_agent, evaluation_agent
from datetime import datetime, timedelta

router = APIRouter()


@router.post("/generate", response_model=QuizGenerateResponse)
async def generate_quiz(
    request: QuizGenerateRequest,
    db: Session = Depends(get_db)
):
    """Generate a quiz for a topic"""
    
    # Get relevant chunks
    result = await get_chunks_for_topic(request.topic, limit=5)
    
    if not result['chunks_data']:
        raise HTTPException(
            status_code=404,
            detail="No content found for this topic"
        )
    
    chunks_text = [c['text'] for c in result['chunks_data']]
    
    # Generate questions
    questions = await quiz_agent.generate_quiz(
        topic=request.topic,
        chunks=chunks_text,
        num_questions=request.num_questions,
        difficulty=request.difficulty
    )
    
    # Create quiz ID
    quiz_id = str(uuid.uuid4())
    
    # Save quiz to database
    quiz = Quiz(
        id=quiz_id,
        topic=request.topic,
        questions_count=len(questions)
    )
    db.add(quiz)
    db.commit()
    
    return QuizGenerateResponse(
        quiz_id=quiz_id,
        topic=request.topic,
        questions=[QuizQuestion(**q) for q in questions]
    )


@router.post("/submit", response_model=QuizResult)
async def submit_quiz(
    submission: QuizSubmission,
    user_id: int = 1,  # TODO: Get from auth
    db: Session = Depends(get_db)
):
    """Submit and evaluate quiz answers"""
    
    # Get quiz
    quiz = db.query(Quiz).filter(Quiz.id == submission.quiz_id).first()
    
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # In a real app, we'd store questions and retrieve them here
    # For now, we'll evaluate based on submission
    
    results = []
    correct_count = 0
    
    for question_id, answer in submission.answers.items():
        # Placeholder evaluation - in production, retrieve and compare
        is_correct = True  # This should be actual evaluation
        if is_correct:
            correct_count += 1
        
        results.append({
            "question_id": question_id,
            "is_correct": is_correct,
            "score": 1.0 if is_correct else 0.0
        })
    
    total_questions = len(submission.answers)
    score = (correct_count / total_questions) * 100 if total_questions > 0 else 0
    
    # Save attempt
    attempt = QuizAttempt(
        quiz_id=submission.quiz_id,
        user_id=user_id,
        score=score,
        total_questions=total_questions,
        correct_answers=correct_count
    )
    db.add(attempt)
    
    # Update topic mastery
    topic = db.query(Topic).filter(Topic.name == quiz.topic).first()
    if topic:
        mastery = db.query(UserTopicMastery).filter(
            UserTopicMastery.user_id == user_id,
            UserTopicMastery.topic_id == topic.id
        ).first()
        
        if mastery:
            # Update existing mastery
            mastery.score = (mastery.score + score) / 2  # Average
            mastery.attempts += 1
            mastery.last_practiced = datetime.now()
            mastery.next_revision = datetime.now() + timedelta(days=7)
        else:
            # Create new mastery record
            mastery = UserTopicMastery(
                user_id=user_id,
                topic_id=topic.id,
                score=score,
                attempts=1,
                last_practiced=datetime.now(),
                next_revision=datetime.now() + timedelta(days=7)
            )
            db.add(mastery)
    
    db.commit()
    
    # Get feedback
    feedback = []
    for result in results:
        feedback.append({
            "question_id": result['question_id'],
            "is_correct": result['is_correct'],
            "feedback": "Correct!" if result['is_correct'] else "Incorrect. Review this topic."
        })
    
    return QuizResult(
        quiz_id=submission.quiz_id,
        score=score,
        total_questions=total_questions,
        correct_answers=correct_count,
        feedback=feedback
    )


@router.get("/history")
async def get_quiz_history(
    user_id: int = 1,  # TODO: Get from auth
    db: Session = Depends(get_db)
):
    """Get user's quiz history"""
    
    attempts = db.query(QuizAttempt).filter(
        QuizAttempt.user_id == user_id
    ).order_by(QuizAttempt.attempted_at.desc()).limit(20).all()
    
    return {
        "attempts": [
            {
                "quiz_id": attempt.quiz_id,
                "score": attempt.score,
                "total_questions": attempt.total_questions,
                "correct_answers": attempt.correct_answers,
                "attempted_at": attempt.attempted_at
            }
            for attempt in attempts
        ]
    }
