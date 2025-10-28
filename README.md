# ReSeek - AI Earnings Call Assistant

**ReSeek** is an AI-powered earnings call analysis platform that provides citation-backed summaries, Q&A mapping, and RAG-based chat for investor research.

## Features

- 🔐 **Supabase Authentication** - Email magic link or password-based auth
- 📊 **Watchlist Management** - Track your favorite company tickers
- 📝 **Auto-Ingestion** - Poll Finnhub every minute for new earnings transcripts
- 🤖 **AI Summarization** - Multi-pass pipeline with extractive quotes and abstractive QuickTake (6-8 bullets)
- 💬 **RAG Chat** - Ask questions about earnings calls with strict source grounding and inline citations
- 🎯 **Q&A Mapping** - Analyst questions with deflection scoring
- 🔗 **Source Citations** - Every summary bullet and chat answer includes timestamp-anchored quotes
- 🌍 **Europe/Berlin Timezone** - UI displays in CET/CEST with UTC storage

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- React Router
- Tailwind CSS + shadcn/ui
- Supabase JS Client

**Backend:**
- FastAPI (Python 3.11)
- SQLAlchemy 2.x + Alembic
- Supabase (Postgres + Auth + pgvector)
- OpenAI (gpt-4o-mini, text-embedding-3-large)
- APScheduler for polling
- httpx for async HTTP

**Infrastructure:**
- PostgreSQL with pgvector extension (3072 dimensions)
- Finnhub API for transcript ingestion

## Project Structure

```
/reseek
  /frontend          # Vite + React + TypeScript
  /backend           # FastAPI application
    /app
      /models        # SQLAlchemy models
      /routes        # API endpoints
      /services      # Business logic (RAG, summarization, embeddings)
      /providers     # Transcript provider interface (Finnhub, Mock)
    /alembic         # Database migrations
  /prompts           # LLM system prompts
  README.md
```

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- Supabase account (free tier works)
- OpenAI API key
- Finnhub API key (free tier available)

### Backend Setup

1. **Configure Supabase:**
   - Create a new Supabase project at https://supabase.com
   - Enable pgvector extension:
     ```sql
     CREATE EXTENSION IF NOT EXISTS vector;
     ```
   - Copy your Supabase URL, anon key, and service role key

2. **Set environment variables:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your credentials
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations:**
   ```bash
   alembic upgrade head
   ```

5. **Start backend:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Add your Supabase URL and anon key
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

Visit http://localhost:5000 to access the application.

## Environment Variables

### Backend (.env)

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql+psycopg://postgres:password@host:5432/postgres

# OpenAI
OPENAI_API_KEY=sk-...

# Vector Store
USE_PGVECTOR=true
PGVECTOR_DIM=3072

# Transcript Providers
FINNHUB_API_KEY=your-finnhub-key

# App Config
APP_BASE_URL=http://localhost:8000
```

### Frontend (.env)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_BASE_URL=http://localhost:8000
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Key Architectural Decisions

### Citation Requirement
Every AI-generated summary bullet and chat response **must** include source citations with timestamps. The UI displays "View source" links that jump to the exact location in the transcript.

### RAG Grounding
The chat feature refuses to answer questions beyond available sources. Responses are strictly grounded in ingested transcripts with inline citations: `[quote "...", ts 00:12:34]`

### Provider Interface
Transcript ingestion uses a pluggable provider interface, making it easy to swap from Finnhub to Quartr or other providers without changing core logic.

### Timezone Handling
All timestamps are stored in UTC in the database. The API returns both UTC and Europe/Berlin times. The UI displays Europe/Berlin by default.

## Development Scripts

```bash
# Backend
make dev          # Start backend dev server
make migrate      # Run database migrations
make seed         # Seed database with sample data
make test         # Run backend tests

# Frontend
npm run dev       # Start frontend dev server
npm run build     # Production build
npm run test      # Run frontend tests
```

## Non-Features (Intentionally Excluded)

- ❌ No Slack/WhatsApp integrations
- ❌ No email/SMS alerting system
- ❌ No real-time notifications

## License

MIT
