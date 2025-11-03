#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║     🎓 Agentic AI Tutor - Complete Setup Script         ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo "📋 Checking prerequisites..."

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Python 3 found${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js found${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker is not installed (optional but recommended)${NC}"
else
    echo -e "${GREEN}✅ Docker found${NC}"
fi

echo ""
echo "🔧 Setting up backend..."
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Setup .env file
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please add your GEMINI_API_KEY to backend/.env${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

# Create uploads directory
mkdir -p uploads

echo -e "${GREEN}✅ Backend setup complete!${NC}"

cd ..

echo ""
echo "🎨 Setting up frontend..."
cd frontend

# Install Node dependencies
npm install

echo -e "${GREEN}✅ Frontend setup complete!${NC}"

cd ..

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                    ✅ Setup Complete!                     ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1️⃣  Add your Gemini API key:"
echo "   Edit backend/.env and add: GEMINI_API_KEY=your-key-here"
echo "   Get your key at: https://makersuite.google.com/app/apikey"
echo ""
echo "2️⃣  Start Qdrant vector database:"
echo "   docker run -p 6333:6333 qdrant/qdrant"
echo ""
echo "3️⃣  Start the backend:"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   uvicorn main:app --reload"
echo ""
echo "4️⃣  Start the frontend (in a new terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "5️⃣  Open your browser:"
echo "   http://localhost:5173"
echo ""
echo "📚 Documentation:"
echo "   - Quick Start: docs/QUICKSTART.md"
echo "   - API Docs: docs/API.md"
echo "   - Deployment: docs/DEPLOYMENT.md"
echo ""
echo "🐳 Alternative: Use Docker Compose"
echo "   docker-compose up --build"
echo ""
echo "Happy Learning! 🎓✨"
