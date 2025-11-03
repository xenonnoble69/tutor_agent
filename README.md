# 🎓 Agentic AI Tutor – Syllabus-Aligned Autonomous Learning System

An intelligent tutoring system that maps your study materials to syllabus topics, generates personalized lessons, and adapts to your learning pace using AI agents.

## 🚀 Features

### MVP
- 📄 Upload documents (PDF, DOCX, notes)
- 📋 Syllabus parsing and topic extraction
- 🔍 Automatic content-syllabus mapping using embeddings
- 🤖 AI-generated lessons for each topic
- 💬 Interactive teaching mode (chat-based)
- ✅ Quizzes and evaluations
- 📊 Progress tracking
- 🗄️ Local database for user learning state

### Advanced (Agentic)
- 🔎 Automatic gap detection
- 📈 Adaptive teaching based on performance
- 📅 Weekly study plan generation
- 🔄 Smart revision scheduler
- 🎯 Student profiling and weak area detection
- 🤖 Multi-agent pipeline (planner + teacher + evaluator + retriever)

## 🏗️ Architecture

```
Frontend (React) → Backend API (FastAPI) → Vector DB (Qdrant)
                         ↓
                   Agent Engine
                   ├─ Planner Agent
                   ├─ Teaching Agent
                   ├─ Quiz Agent
                   └─ Evaluation Agent
                         ↓
                   SQLite Database
```

## 📦 Tech Stack

### Backend
- **Framework**: FastAPI
- **LLM**: Google Gemini API
- **Vector DB**: Qdrant
- **Database**: SQLite
- **Document Processing**: PyMuPDF, python-docx

### Frontend
- **Framework**: React + Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- Gemini API key

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set environment variables
export GEMINI_API_KEY="your-api-key-here"
export QDRANT_URL="http://localhost:6333"

# Run the server
uvicorn main:app --reload
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Vector Database Setup

```bash
docker run -p 6333:6333 qdrant/qdrant
```

## 📁 Project Structure

```
tutor_agent/
├── backend/
│   ├── api/              # API endpoints
│   ├── agents/           # AI agent implementations
│   ├── ingestion/        # Document processing
│   ├── vectorstore/      # Vector DB operations
│   ├── models/           # Data models
│   ├── database/         # Database operations
│   └── main.py           # FastAPI app
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service layer
│   │   └── App.jsx       # Main app component
│   └── package.json
└── docs/                 # Documentation
```

## 🔄 Development Timeline

- **Week 1**: Backend foundation, document ingestion, embeddings
- **Week 2**: Agent implementation, topic mapping
- **Week 3**: Frontend UI, progress tracking
- **Week 4**: Agentic features, testing, deployment

## 📝 License

MIT License

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.
