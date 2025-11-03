#!/bin/bash

echo "🚀 Setting up Agentic AI Tutor Backend..."

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Create .env file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file - Please add your GEMINI_API_KEY"
else
    echo "ℹ️  .env file already exists"
fi

# Create uploads directory
mkdir -p uploads

echo "✅ Backend setup complete!"
echo ""
echo "Next steps:"
echo "1. Add your GEMINI_API_KEY to the .env file"
echo "2. Start Qdrant: docker run -p 6333:6333 qdrant/qdrant"
echo "3. Run the server: uvicorn main:app --reload"
