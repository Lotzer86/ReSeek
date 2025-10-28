# REPLIT AGENT PROMPT — UPDATED (copy/paste)

Build a production-ready MVP called **reset** (AI earnings-call assistant) as a **monorepo**: **React (Vite+TS)** frontend + **FastAPI (Python 3.11)** backend. Use **Supabase (Postgres + Auth)**, **pgvector (or Pinecone)** for embeddings, **OpenAI** for LLM. Ingest transcripts from a pluggable provider (start with **Finnhub** polling; keep a provider interface to swap Quartr later).  
**No Slack/WhatsApp integrations. No alerting.** Users must be able to **chat with the data** (RAG) per company/event. Every AI answer must cite source snippets with timestamps.

## 0) Project layout
```
/reset
  /frontend        # Vite + React + TypeScript + Tailwind + shadcn/ui
  /backend         # FastAPI + SQLAlchemy + Alembic + httpx + pydantic
  /infra           # Dockerfile(s), docker-compose.yml, Makefile
  README.md
```

## 1) Core MVP features (must implement)
- **Auth**: Supabase Auth (email magic link or email+password). Store minimal profile.
- **Watchlists**: User can follow tickers; simple CRUD.
- **Event ingestion** (provider interface): Poll Finnhub (or mock) every minute for watched tickers → create **events** (earnings_call), fetch transcript (JSON/text) + optional audio URL → store.
- **Chunking + Embeddings**: Split transcript into ~400–600 token chunks, store with embeddings in **pgvector** (or Pinecone if simpler on Replit).
- **Summarization pipeline**:
  - **Extractive pass**: pull verbatim quotes & numbers (with timestamps & chunk IDs).
  - **Abstractive pass**: produce **QuickTake** (6–8 bullets), **Guidance table** (normalized), **Delta vs prior call** (language & numeric changes).  
  - **Citations mandatory**: each bullet references at least one extractive quote (text + timestamp).
- **Q&A map**: Detect Q&A blocks → analyst name/firm (when present), topic classification, brief mgmt answer, **deflection score** (simple heuristic on hedging/non-answer).
- **AI Chat (RAG)**: Users can chat **per company/event** or **across their watchlist**. Answers must:
  - Be grounded in transcripts/summaries only.
  - Return **inline citations**: `[quote “…”, ts 00:12:34]` with a link/anchor to the transcript location.
  - Refuse to answer beyond available sources (“I don’t see that in the transcript.”).
  - Return: `answer_html`, `citations[] {quote, ts, chunk_id, event_id}`.
- **Web app**:
  - **Dashboard**: watchlist, upcoming calls (list), recent summaries.
  - **Company page**: tabs → **Summary**, **Q&A Map**, **Transcript** (search + jump to timestamp), **Chat**.
  - **Settings**: profile (name, locale), watchlist editor.  
  - **No alerts UI**; email is used only for auth.

## 2) Tech specifics
- **Frontend**: Vite + React + TypeScript, React Router, Tailwind, shadcn/ui. Simple, fast, mobile-responsive.
- **Backend**: FastAPI, SQLAlchemy, Alembic, httpx, pydantic, python-dotenv, APScheduler (minute polling).
- **Vector store**: Prefer **pgvector** in Supabase (fewer external deps). If Pinecone is easier on Replit, use it behind a repo-local interface.
- **LLM**: OpenAI (gpt-4o-mini / gpt-4.1-mini for generation; `text-embedding-3-large` for embeddings).
- **Time zone**: UI shows **Europe/Berlin**; store all timestamps in UTC and return both in API.

## 3) Environment variables (`backend/.env.example`)
```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=postgresql+psycopg://user:pass@host:5432/reset

OPENAI_API_KEY=

# Vector config: choose one path
USE_PGVECTOR=true
# If pgvector:
PGVECTOR_DIM=3072

# If Pinecone (optional):
PINECONE_API_KEY=
PINECONE_INDEX=reset-transcripts

# Transcript providers:
FINNHUB_API_KEY=
QUARTR_API_KEY=   # (placeholder, not used in MVP)

APP_BASE_URL=http://localhost:8000
```

## 4) Database schema (SQLAlchemy models + Alembic)
(Include all tables and models as described earlier: users, profiles, watchlists, watchlist_items, events, transcripts, transcript_chunks, summaries, qa_items.)

## 5) Provider interface
Define a base TranscriptProvider class and implement Finnhub + Mock providers (Quartr stub).

## 6) Processing pipeline
Implement ingest.py, summarize.py, qa_map.py as described in detail above.

## 7) AI Chat (RAG) — strict grounding
Implement /chat/query and /chat/suggest-questions endpoints with RAG logic.

## 8) FastAPI endpoints
(Include all routes from the previous specification.)

## 9) Frontend (Vite+React+TS)
(Include the React pages as listed: Login, Dashboard, Company page with tabs, Settings.)

## 10) Prompts
Include extractive.txt, abstractive.txt, chat_system.txt as described.

## 11) Tests
Minimal backend (pytest) + frontend (Playwright) tests per spec.

## 12) Developer scripts
`make dev`, `make seed`, `make test`

## 13) README
Include instructions as detailed earlier (Quickstart, Supabase setup, etc.)

**Non-negotiables**:
- No alerts.
- No Slack/WhatsApp code or env vars.
- Every summary bullet must show a View source link (timestamp anchor).
- Chat answers must include citations in the UI.

**Stretch (optional)**:
- Audio player on company page.
- Light sentiment chips on Q&A items.
