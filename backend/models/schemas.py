from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class ChunkMetadata(BaseModel):
    """Metadata for a document chunk"""
    chunk_id: str
    source: str
    page: Optional[int] = None


class DocumentChunk(BaseModel):
    """Document chunk with text and metadata"""
    chunk_id: str
    text: str
    source: str
    metadata: Dict[str, Any] = {}


class DocumentUploadResponse(BaseModel):
    """Response after document upload"""
    document_id: str
    filename: str
    chunks_created: int
    message: str


class SyllabusUnit(BaseModel):
    """Syllabus unit with topics"""
    unit: str
    topics: List[str]


class SyllabusInput(BaseModel):
    """Input for syllabus parsing"""
    syllabus_text: str
    course_name: Optional[str] = None


class SyllabusParseResponse(BaseModel):
    """Response after syllabus parsing"""
    syllabus_id: str
    units: List[SyllabusUnit]
    total_topics: int


class TopicMapping(BaseModel):
    """Mapping between syllabus topic and document chunks"""
    topic: str
    relevant_chunks: List[str]
    confidence_score: float
    has_sufficient_content: bool


class MappingResponse(BaseModel):
    """Response after topic-document mapping"""
    mappings: List[TopicMapping]
    total_mapped: int
    topics_needing_content: List[str]


class LessonPlanItem(BaseModel):
    """Single item in lesson plan"""
    lesson_number: int
    title: str
    topic: str
    estimated_duration: str


class LessonPlan(BaseModel):
    """Complete lesson plan"""
    plan_id: str
    lessons: List[LessonPlanItem]
    total_lessons: int


class TeachingMessage(BaseModel):
    """Message in teaching session"""
    role: str  # 'assistant' or 'user'
    content: str
    timestamp: datetime = Field(default_factory=datetime.now)


class TeachingRequest(BaseModel):
    """Request to teaching agent"""
    topic: str
    user_message: Optional[str] = None
    session_id: Optional[str] = None


class TeachingResponse(BaseModel):
    """Response from teaching agent"""
    session_id: str
    message: str
    follow_up_question: Optional[str] = None


class QuizQuestion(BaseModel):
    """Single quiz question"""
    question_id: str
    question: str
    options: List[str]
    correct_answer: str
    explanation: str


class QuizGenerateRequest(BaseModel):
    """Request to generate quiz"""
    topic: str
    num_questions: int = 5
    difficulty: str = "medium"


class QuizGenerateResponse(BaseModel):
    """Response with generated quiz"""
    quiz_id: str
    topic: str
    questions: List[QuizQuestion]


class QuizSubmission(BaseModel):
    """User's quiz submission"""
    quiz_id: str
    answers: Dict[str, str]  # question_id -> user_answer


class QuizResult(BaseModel):
    """Quiz evaluation result"""
    quiz_id: str
    score: float
    total_questions: int
    correct_answers: int
    feedback: List[Dict[str, Any]]


class ProgressStats(BaseModel):
    """User progress statistics"""
    user_id: str
    topics_completed: int
    total_topics: int
    average_score: float
    weak_areas: List[str]
    strong_areas: List[str]
    last_activity: Optional[datetime] = None


class TopicMastery(BaseModel):
    """Mastery level for a specific topic"""
    topic: str
    score: float
    attempts: int
    last_practiced: datetime
    next_revision: Optional[datetime] = None


class StudyPlan(BaseModel):
    """Weekly study plan"""
    week_number: int
    topics_to_study: List[str]
    topics_to_revise: List[str]
    estimated_hours: float
