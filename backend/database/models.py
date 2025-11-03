from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()


class User(Base):
    """User model"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.now)
    
    # Relationships
    topic_mastery = relationship("UserTopicMastery", back_populates="user")
    sessions = relationship("SessionHistory", back_populates="user")


class Document(Base):
    """Document model"""
    __tablename__ = "documents"
    
    id = Column(String, primary_key=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    upload_date = Column(DateTime, default=datetime.now)
    user_id = Column(Integer, ForeignKey("users.id"))
    chunks_count = Column(Integer, default=0)


class Syllabus(Base):
    """Syllabus model"""
    __tablename__ = "syllabi"
    
    id = Column(String, primary_key=True)
    course_name = Column(String)
    raw_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationships
    topics = relationship("Topic", back_populates="syllabus")


class Topic(Base):
    """Topic model"""
    __tablename__ = "topics"
    
    id = Column(Integer, primary_key=True, index=True)
    topic_id = Column(String, unique=True, index=True)
    name = Column(String, nullable=False)
    unit = Column(String)
    syllabus_id = Column(String, ForeignKey("syllabi.id"))
    has_sufficient_content = Column(Boolean, default=False)
    
    # Relationships
    syllabus = relationship("Syllabus", back_populates="topics")
    mastery_records = relationship("UserTopicMastery", back_populates="topic")


class UserTopicMastery(Base):
    """User's mastery level for each topic"""
    __tablename__ = "user_topic_mastery"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    topic_id = Column(Integer, ForeignKey("topics.id"))
    score = Column(Float, default=0.0)  # 0-100
    attempts = Column(Integer, default=0)
    last_practiced = Column(DateTime, default=datetime.now)
    next_revision = Column(DateTime)
    
    # Relationships
    user = relationship("User", back_populates="topic_mastery")
    topic = relationship("Topic", back_populates="mastery_records")


class SessionHistory(Base):
    """Teaching session history"""
    __tablename__ = "session_history"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    topic = Column(String, nullable=False)
    question = Column(Text)
    student_answer = Column(Text)
    score = Column(Float)
    timestamp = Column(DateTime, default=datetime.now)
    
    # Relationships
    user = relationship("User", back_populates="sessions")


class Quiz(Base):
    """Quiz model"""
    __tablename__ = "quizzes"
    
    id = Column(String, primary_key=True)
    topic = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    questions_count = Column(Integer, default=0)


class QuizAttempt(Base):
    """Quiz attempt and results"""
    __tablename__ = "quiz_attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(String, ForeignKey("quizzes.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    score = Column(Float, nullable=False)
    total_questions = Column(Integer, nullable=False)
    correct_answers = Column(Integer, nullable=False)
    attempted_at = Column(DateTime, default=datetime.now)
