"""
Database initialization script
Run this to create the database tables
"""

from database.db import init_db

if __name__ == "__main__":
    print("Initializing database...")
    init_db()
    print("✅ Database initialized successfully!")
    print("Tables created:")
    print("  - users")
    print("  - documents")
    print("  - syllabi")
    print("  - topics")
    print("  - user_topic_mastery")
    print("  - session_history")
    print("  - quizzes")
    print("  - quiz_attempts")
