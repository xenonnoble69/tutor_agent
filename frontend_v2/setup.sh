#!/bin/bash

# Frontend v2 Setup Script
echo "🚀 Setting up Agentic AI Tutor Frontend v2..."

# Navigate to frontend_v2 directory
cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "The frontend will be available at: http://localhost:5173"
echo "Make sure the backend is running at: http://localhost:8000"
echo ""
