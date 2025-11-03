# API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
Currently no authentication is required. User authentication will be added in future versions.

---

## Documents Endpoints

### Upload Document
**POST** `/documents/upload`

Upload a document file (PDF, DOCX, TXT) for processing.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (File)

**Response:**
```json
{
  "document_id": "uuid",
  "filename": "example.pdf",
  "chunks_created": 45,
  "message": "Document processed successfully. 45 chunks created."
}
```

### List Documents
**GET** `/documents/list`

Get all uploaded documents for the user.

**Response:**
```json
{
  "documents": [
    {
      "id": "uuid",
      "filename": "example.pdf",
      "upload_date": "2025-11-03T10:00:00",
      "chunks_count": 45
    }
  ]
}
```

### Delete Document
**DELETE** `/documents/{document_id}`

Delete a document and its chunks.

---

## Syllabus Endpoints

### Parse Syllabus
**POST** `/syllabus/parse`

Parse syllabus text into structured topics.

**Request:**
```json
{
  "syllabus_text": "Unit 1: Networks\n- OSI Model\n- TCP/IP",
  "course_name": "Computer Networks"
}
```

**Response:**
```json
{
  "syllabus_id": "uuid",
  "units": [
    {
      "unit": "Networks",
      "topics": ["OSI Model", "TCP/IP"]
    }
  ],
  "total_topics": 2
}
```

### Map Topics to Content
**POST** `/syllabus/map/{syllabus_id}`

Map syllabus topics to uploaded document content using embeddings.

**Response:**
```json
{
  "mappings": [
    {
      "topic": "OSI Model",
      "relevant_chunks": ["chunk_1", "chunk_2"],
      "confidence_score": 0.85,
      "has_sufficient_content": true
    }
  ],
  "total_mapped": 2,
  "topics_needing_content": []
}
```

---

## Lessons Endpoints

### Create Lesson Plan
**POST** `/lessons/plan/{syllabus_id}`

Generate a sequential lesson plan for all syllabus topics.

**Response:**
```json
{
  "plan_id": "uuid",
  "lessons": [
    {
      "lesson_number": 1,
      "title": "Understanding OSI Model",
      "topic": "OSI Model",
      "estimated_duration": "45 minutes"
    }
  ],
  "total_lessons": 5
}
```

### Interactive Teaching
**POST** `/lessons/teach`

Start or continue an interactive teaching session.

**Request:**
```json
{
  "topic": "OSI Model",
  "user_message": "Can you explain the layers?",
  "session_id": "uuid"
}
```

**Response:**
```json
{
  "session_id": "uuid",
  "message": "The OSI model has 7 layers...",
  "follow_up_question": "Which layer handles routing?"
}
```

---

## Quiz Endpoints

### Generate Quiz
**POST** `/quiz/generate`

Generate quiz questions for a topic.

**Request:**
```json
{
  "topic": "OSI Model",
  "num_questions": 5,
  "difficulty": "medium"
}
```

**Response:**
```json
{
  "quiz_id": "uuid",
  "topic": "OSI Model",
  "questions": [
    {
      "question_id": "q1",
      "question": "How many layers does the OSI model have?",
      "options": ["5", "6", "7", "8"],
      "correct_answer": "7",
      "explanation": "The OSI model has 7 layers..."
    }
  ]
}
```

### Submit Quiz
**POST** `/quiz/submit`

Submit quiz answers for evaluation.

**Request:**
```json
{
  "quiz_id": "uuid",
  "answers": {
    "q1": "7",
    "q2": "Application"
  }
}
```

**Response:**
```json
{
  "quiz_id": "uuid",
  "score": 80.0,
  "total_questions": 5,
  "correct_answers": 4,
  "feedback": [
    {
      "question_id": "q1",
      "is_correct": true,
      "feedback": "Correct! Well done."
    }
  ]
}
```

---

## Progress Endpoints

### Get Progress Stats
**GET** `/progress/stats`

Get overall learning progress statistics.

**Response:**
```json
{
  "user_id": "1",
  "topics_completed": 5,
  "total_topics": 10,
  "average_score": 78.5,
  "weak_areas": ["Subnetting", "NAT"],
  "strong_areas": ["OSI Model", "TCP/IP"],
  "last_activity": "2025-11-03T10:00:00"
}
```

### Get Topic Mastery
**GET** `/progress/topics`

Get mastery levels for all studied topics.

**Response:**
```json
[
  {
    "topic": "OSI Model",
    "score": 85.0,
    "attempts": 3,
    "last_practiced": "2025-11-03T10:00:00",
    "next_revision": "2025-11-10T10:00:00"
  }
]
```

### Get Study Plan
**GET** `/progress/study-plan`

Get personalized weekly study plan.

**Response:**
```json
{
  "week_number": 1,
  "topics_to_study": ["Subnetting", "VLANs"],
  "topics_to_revise": ["OSI Model", "TCP/IP"],
  "estimated_hours": 8.0
}
```

---

## Error Responses

All endpoints may return error responses:

```json
{
  "detail": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error
