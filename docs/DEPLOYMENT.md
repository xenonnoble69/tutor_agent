# Deployment Guide

## Backend Deployment (Railway)

### 1. Prepare for Deployment

Create `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. Deploy to Railway

1. Create account at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables:
   - `GEMINI_API_KEY`
   - `QDRANT_URL` (use Qdrant Cloud)
5. Deploy!

### 3. Qdrant Cloud Setup

1. Create account at [cloud.qdrant.io](https://cloud.qdrant.io)
2. Create a new cluster (free tier available)
3. Get connection URL and API key
4. Add to Railway environment variables

## Frontend Deployment (Vercel)

### 1. Prepare for Deployment

Update `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
  }
})
```

### 2. Deploy to Vercel

1. Create account at [vercel.com](https://vercel.com)
2. Click "New Project" → Import from GitHub
3. Select frontend folder
4. Add environment variable:
   - `VITE_API_BASE_URL` = your Railway backend URL
5. Deploy!

## Alternative: Docker Compose

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  qdrant:
    image: qdrant/qdrant
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - QDRANT_URL=http://qdrant:6333
    depends_on:
      - qdrant
    volumes:
      - ./backend/uploads:/app/uploads

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    environment:
      - VITE_API_BASE_URL=http://localhost:8000/api
    depends_on:
      - backend

volumes:
  qdrant_data:
```

Run with:
```bash
docker-compose up --build
```

## Environment Variables Summary

### Backend
- `GEMINI_API_KEY` - Required
- `QDRANT_URL` - Qdrant connection URL
- `QDRANT_API_KEY` - Optional for Qdrant Cloud
- `DATABASE_URL` - SQLite by default

### Frontend
- `VITE_API_BASE_URL` - Backend API URL
