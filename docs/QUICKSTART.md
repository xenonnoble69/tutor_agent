# Quick Start Guide

## Prerequisites
- Python 3.9+
- Node.js 18+
- Docker (for Qdrant)
- Gemini API key ([Get it here](https://makersuite.google.com/app/apikey))

## Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start Qdrant vector database
docker run -p 6333:6333 qdrant/qdrant

# Run the server
uvicorn main:app --reload
```

The API will be available at http://localhost:8000
API documentation: http://localhost:8000/docs

## Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at http://localhost:5173

## Usage Flow

1. **Upload Documents**: Go to Documents page and upload your study materials (PDF, DOCX, TXT)
2. **Add Syllabus**: Go to Syllabus page and paste your course syllabus
3. **Map Content**: Click "Map Content" to link syllabus topics with uploaded materials
4. **Start Learning**: Go to Learn page to:
   - Get interactive lessons on topics
   - Take quizzes and get evaluated
5. **Track Progress**: View your learning statistics and study plan

## API Endpoints

### Documents
- `POST /api/documents/upload` - Upload a document
- `GET /api/documents/list` - List all documents
- `DELETE /api/documents/{id}` - Delete a document

### Syllabus
- `POST /api/syllabus/parse` - Parse syllabus text
- `POST /api/syllabus/map/{id}` - Map topics to content
- `GET /api/syllabus/list` - List all syllabi
- `GET /api/syllabus/{id}/topics` - Get topics

### Lessons
- `POST /api/lessons/plan/{syllabus_id}` - Create lesson plan
- `POST /api/lessons/teach` - Interactive teaching session
- `GET /api/lessons/session/{id}` - Get session history

### Quiz
- `POST /api/quiz/generate` - Generate quiz for topic
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/history` - Get quiz history

### Progress
- `GET /api/progress/stats` - Get progress statistics
- `GET /api/progress/topics` - Get topic mastery levels
- `GET /api/progress/study-plan` - Get weekly study plan
- `GET /api/progress/revision-due` - Get topics due for revision

## Troubleshooting

### Backend Issues
- **Import errors**: Make sure virtual environment is activated
- **Qdrant connection error**: Ensure Docker container is running
- **API key error**: Check your GEMINI_API_KEY in .env

### Frontend Issues
- **API connection error**: Ensure backend is running on port 8000
- **Build errors**: Try deleting node_modules and running `npm install` again

## Architecture

```
Frontend (React) 
    ↓
Backend API (FastAPI)
    ↓
├── Document Processor → Vector DB (Qdrant)
├── Syllabus Parser
├── AI Agents (Gemini)
└── SQLite Database
```

## Next Steps

- Add user authentication
- Implement n8n automation workflows
- Deploy to production (Railway, Vercel)
- Add more agent capabilities
- Implement spaced repetition algorithm
