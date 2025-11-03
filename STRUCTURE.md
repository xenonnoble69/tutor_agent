# 📁 Project Structure

```
tutor_agent/
│
├── 📄 README.md                    # Main project documentation
├── 📄 LICENSE                      # MIT License
├── 📄 TODO.md                      # Project roadmap
├── 📄 CONTRIBUTING.md              # Contribution guidelines
├── 📄 setup.sh                     # One-command setup script
├── 🐳 docker-compose.yml           # Docker orchestration
│
├── 📂 backend/                     # FastAPI Backend
│   ├── 📄 main.py                  # FastAPI app entry point
│   ├── 📄 config.py                # Configuration management
│   ├── 📄 requirements.txt         # Python dependencies
│   ├── 📄 Dockerfile               # Backend container
│   ├── 📄 setup.sh                 # Backend setup script
│   ├── 📄 init_db.py               # Database initialization
│   ├── 📄 .env.example             # Environment variables template
│   │
│   ├── 📂 api/                     # API endpoints
│   │   ├── documents.py            # Document upload/management
│   │   ├── syllabus.py             # Syllabus parsing & mapping
│   │   ├── lessons.py              # Lesson generation & teaching
│   │   ├── quiz.py                 # Quiz generation & evaluation
│   │   └── progress.py             # Progress tracking
│   │
│   ├── 📂 agents/                  # AI Agents
│   │   └── agents.py               # Planner, Teacher, Quiz, Evaluator agents
│   │
│   ├── 📂 database/                # Database layer
│   │   ├── db.py                   # Database connection & session
│   │   └── models.py               # SQLAlchemy models
│   │
│   ├── 📂 ingestion/               # Document processing
│   │   ├── document_processor.py   # PDF/DOCX/TXT extraction & chunking
│   │   └── syllabus_parser.py      # Syllabus text parsing
│   │
│   ├── 📂 models/                  # Pydantic schemas
│   │   └── schemas.py              # Request/response models
│   │
│   ├── 📂 vectorstore/             # Vector database
│   │   └── qdrant_client.py        # Qdrant operations & embeddings
│   │
│   └── 📂 uploads/                 # User uploaded files (created at runtime)
│
├── 📂 frontend/                    # React Frontend
│   ├── 📄 package.json             # Node dependencies
│   ├── 📄 vite.config.js           # Vite configuration
│   ├── 📄 tailwind.config.js       # Tailwind CSS config
│   ├── 📄 index.html               # HTML entry point
│   ├── 📄 Dockerfile               # Frontend container
│   ├── 📄 nginx.conf               # Nginx configuration
│   ├── 📄 setup.sh                 # Frontend setup script
│   │
│   └── 📂 src/
│       ├── 📄 main.jsx             # React entry point
│       ├── 📄 App.jsx              # Main app component with routing
│       ├── 📄 index.css            # Global styles
│       │
│       ├── 📂 pages/               # Page components
│       │   ├── HomePage.jsx        # Landing page
│       │   ├── DocumentsPage.jsx   # Document upload/management
│       │   ├── SyllabusPage.jsx    # Syllabus input & mapping
│       │   ├── LearnPage.jsx       # Teaching & quiz interface
│       │   └── ProgressPage.jsx    # Progress dashboard
│       │
│       ├── 📂 components/          # Reusable components (to be added)
│       │
│       └── 📂 services/            # API integration
│           └── api.js              # API client functions
│
└── 📂 docs/                        # Documentation
    ├── QUICKSTART.md               # Quick start guide
    ├── API.md                      # API documentation
    └── DEPLOYMENT.md               # Deployment guide
```

## 🎯 Key Components

### Backend Architecture
```
┌─────────────────────────────────────────────────────────┐
│                     FastAPI Backend                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Document   │  │   Syllabus   │  │    Lesson    │ │
│  │   Processor  │  │    Parser    │  │   Generator  │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘ │
│         │                  │                  │          │
│         └──────────────────┴──────────────────┘          │
│                            │                              │
│                     ┌──────▼───────┐                     │
│                     │  Embeddings  │                     │
│                     │   (Gemini)   │                     │
│                     └──────┬───────┘                     │
│                            │                              │
│         ┌──────────────────┼──────────────────┐          │
│         │                  │                  │          │
│  ┌──────▼───────┐   ┌─────▼──────┐   ┌──────▼───────┐ │
│  │   Qdrant     │   │   SQLite   │   │  AI Agents   │ │
│  │  (Vectors)   │   │ (Metadata) │   │  (Gemini)    │ │
│  └──────────────┘   └────────────┘   └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Agent System
```
┌─────────────────────────────────────────────────────────┐
│                    Agent Pipeline                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  User Input                                              │
│      ↓                                                   │
│  ┌───────────────┐                                      │
│  │ Planner Agent │ → Creates learning path              │
│  └───────┬───────┘                                      │
│          ↓                                               │
│  ┌───────────────┐                                      │
│  │Teaching Agent │ → Interactive explanation            │
│  └───────┬───────┘                                      │
│          ↓                                               │
│  ┌───────────────┐                                      │
│  │  Quiz Agent   │ → Generates questions                │
│  └───────┬───────┘                                      │
│          ↓                                               │
│  ┌───────────────┐                                      │
│  │Evaluation Agt │ → Assesses performance               │
│  └───────┬───────┘                                      │
│          ↓                                               │
│  Progress Update                                         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Data Flow
```
1. Document Upload
   PDF/DOCX → Extract Text → Chunk → Embed → Store in Qdrant

2. Syllabus Processing
   Raw Text → Parse Topics → Embed Topics → Map to Chunks

3. Teaching Session
   Topic → Retrieve Chunks → Agent Generation → Response

4. Quiz Flow
   Topic → Get Chunks → Generate Questions → Store → Evaluate

5. Progress Tracking
   Quiz Results → Update Mastery → Calculate Stats → Show Dashboard
```

## 🔑 Key Files to Understand

1. **backend/main.py** - Start here to understand the API structure
2. **backend/agents/agents.py** - Core AI agent implementations
3. **backend/vectorstore/qdrant_client.py** - Embedding and search logic
4. **frontend/src/App.jsx** - Frontend routing and layout
5. **frontend/src/pages/LearnPage.jsx** - Main learning interface

## 🚀 Getting Started

Run the setup script:
```bash
./setup.sh
```

This will:
- ✅ Create Python virtual environment
- ✅ Install backend dependencies
- ✅ Install frontend dependencies
- ✅ Create necessary directories
- ✅ Setup configuration files

## 📚 Learn More

- Read `docs/QUICKSTART.md` for detailed setup
- Check `docs/API.md` for API documentation
- See `TODO.md` for future features
