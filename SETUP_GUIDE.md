# ReSeek Setup Guide

## Current Status

✅ **Backend API**: Running on http://localhost:8000  
✅ **Frontend**: Running on http://localhost:5000  
⚠️ **Database**: Not configured (Supabase credentials needed)  
⚠️ **OpenAI**: Not configured (API key needed)  

## Quick Start

### 1. Configure Environment Variables

Edit `backend/.env` and add your credentials:

```bash
cd backend
nano .env
```

**Required values to update:**

```env
# Supabase Configuration
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_ANON_KEY=your-actual-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key-here

# For PostgreSQL with Supabase:
DATABASE_URL=postgresql+psycopg://postgres:[YOUR-PASSWORD]@db.YOUR-PROJECT.supabase.co:5432/postgres

# OR use SQLite for local development (current default):
DATABASE_URL=sqlite:///./reseek.db

# OpenAI Configuration
OPENAI_API_KEY=sk-your-actual-openai-key-here

# Optional: Finnhub for live earnings data
FINNHUB_API_KEY=your-finnhub-key
```

### 2. Set up Supabase (Recommended)

1. Create a free account at https://supabase.com
2. Create a new project
3. Go to **Project Settings** → **API** to find:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`  
   - `SUPABASE_SERVICE_ROLE_KEY`

4. Enable pgvector extension in Supabase SQL Editor:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

5. Get your database URL from **Project Settings** → **Database**

### 3. Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy it to `OPENAI_API_KEY` in `.env`

### 4. Set up Database Schema

Once you've configured Supabase/database credentials:

```bash
cd backend

# Install Alembic if not already installed
pip install alembic

# Initialize Alembic (if not done)
alembic init alembic

# Create initial migration
alembic revision --autogenerate -m "Initial schema"

# Apply migrations
alembic upgrade head
```

### 5. (Optional) Get Finnhub API Key

For live earnings call data:

1. Sign up at https://finnhub.io
2. Get your free API key
3. Add to `FINNHUB_API_KEY` in `.env`

## Testing the Setup

### 1. Test Backend API

Visit http://localhost:8000/docs to see the interactive API documentation.

Try the root endpoint:
```bash
curl http://localhost:8000/
```

You should see:
```json
{"message": "ReSeek API", "status": "running"}
```

### 2. Test Frontend

Open http://localhost:5000 in your browser. You should see the ReSeek dashboard.

### 3. Test with Mock Data

The Mock provider can generate sample earnings call data for testing:

```python
# In Python console or create a test script
import asyncio
from backend.app.providers.mock import MockProvider

async def test_mock():
    provider = MockProvider()
    transcript = await provider.fetch_transcript("mock_AAPL_20241028")
    print(transcript.transcript_text[:500])

asyncio.run(test_mock())
```

## Development Workflow

### Backend Development

The backend automatically reloads when you make changes:

```bash
# Backend is already running via workflow
# Edit files in backend/app/
# Changes are automatically detected and server reloads
```

### Frontend Development

The frontend also has hot module reloading:

```bash
# Frontend is already running via workflow  
# Edit files in frontend/src/
# Browser automatically refreshes
```

### Adding New Features

1. **New API Route**: Add to `backend/app/routes/`
2. **New Service**: Add to `backend/app/services/`
3. **New Model**: Add to `backend/app/models/models.py`, then create migration
4. **New Frontend Page**: Add to `frontend/src/pages/`

## Troubleshooting

### Database Connection Issues

If you see "Database connection not available" warnings:

1. Verify your `DATABASE_URL` is correct
2. For Supabase, ensure the database is accessible
3. For local development, you can use SQLite: `DATABASE_URL=sqlite:///./reseek.db`

### OpenAI API Errors

If AI features don't work:

1. Verify `OPENAI_API_KEY` is set correctly
2. Check you have credits in your OpenAI account
3. Test with: `curl https://api.openai.com/v1/models -H "Authorization: Bearer YOUR_API_KEY"`

### Port Already in Use

If ports 5000 or 8000 are taken:

```bash
# Find and kill process using port 5000 or 8000
lsof -ti:5000 | xargs kill -9
lsof -ti:8000 | xargs kill -9

# Restart workflows
```

## Next Steps

1. Configure your Supabase and OpenAI credentials
2. Set up the database schema with Alembic
3. Test creating watchlists and viewing events
4. Try the RAG chat feature with mock data
5. Connect Finnhub for real earnings call data

## Architecture Overview

```
ReSeek/
├── backend/           # FastAPI application
│   ├── app/
│   │   ├── main.py          # FastAPI app entry point
│   │   ├── config.py        # Settings and environment
│   │   ├── database.py      # SQLAlchemy setup
│   │   ├── models/          # Database models
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic (RAG, summarization, etc.)
│   │   └── providers/       # Transcript providers (Finnhub, Mock)
│   └── prompts/       # LLM system prompts
│
├── frontend/          # React + Vite application
│   └── src/
│       ├── App.jsx          # Main app component
│       ├── pages/           # Page components
│       └── ...
│
└── README.md
```

## Key Features Implemented

✅ Provider interface (Finnhub + Mock)  
✅ Multi-pass summarization with citations  
✅ RAG chat with source grounding  
✅ Q&A mapping with deflection scores  
✅ Vector similarity search (pgvector)  
✅ FastAPI backend with full REST API  
✅ React frontend with dashboard  
✅ Both dev servers configured and running  

## Features Pending Implementation

⏳ Alembic migrations setup  
⏳ APScheduler for automatic polling  
⏳ Full frontend (Company detail tabs, Settings page)  
⏳ Supabase Auth integration  
⏳ Timestamp anchoring in UI  
⏳ Europe/Berlin timezone display  

## Support

For issues or questions:
- Check API docs: http://localhost:8000/docs
- Review logs in the console
- Refer to the main README.md for architecture details
