# ReSeek - AI-Powered Earnings Call Assistant

## Overview
ReSeek is a professional analyst dashboard for earnings call analysis, featuring RAG-based chat with strict source grounding, AI-powered summarization with mandatory citations, Q&A mapping with deflection scoring, and NASDAQ 100 watchlist management.

## Project Structure
- **Backend**: FastAPI (Python 3.11) - `/backend`
- **Frontend**: React (Vite + TypeScript) - `/frontend`
- **Database**: SQLite (development) with SQLAlchemy ORM

## Recent Changes

### Latest Update (October 28, 2025)
- **Watchlist Feature**: Added full NASDAQ 100 stock picker with add/remove functionality
  - Backend: Created NASDAQ 100 data source with 100 stocks
  - Backend: Added `/api/watchlist/stocks/nasdaq100` endpoint
  - Frontend: Built StockPicker modal component with search and selection
  - Frontend: Updated WatchlistPanel with add/remove buttons
  - Users can now select from NASDAQ 100 stocks to build their watchlist

### Design System (October 28, 2025)
- **Color Scheme**: Switched from pure black to professional dark slate theme
  - Background: Dark slate blue (#0F172A)
  - Surface: Slate (#1E293B)
  - Cards: Slate gray (#334155)
  - Text: Bright white (#F1F5F9)
  - Brand: Emerald green (#10B981)
- **Typography**: Inter font family for professional readability
- **Layout**: 3-column dashboard with left sidebar navigation
- **Components**: Shadows, borders, and hover effects for depth

### UI Redesign (October 28, 2025)
- Installed Tailwind CSS v3 for modern styling
- Created professional analyst dashboard with:
  - Left sidebar: Dashboard, Watchlist, Events, Transcripts, Settings
  - 3-column layout: Activity Feed | Latest Events | Recent Mentions/Watchlist
  - Company detail pages with tabs and Quick Facts sidebar
- Removed old CSS files, migrated to Tailwind-based styling

### Bug Fixes
- Fixed routing issue preventing users from viewing summaries
- Updated API integration to use correct backend endpoints
- Fixed all heading colors to be visible (#F1F5F9)

## Architecture

### Database Schema
- **Events**: Earnings call events with metadata
- **Transcripts**: Raw text using `raw_text` field
- **Summaries**: AI-generated summaries with JSON fields (quicktake, extractive_quotes, guidance_table, delta_analysis)
- **QAItems**: Q&A pairs with deflection scores
- **Watchlists**: User watchlists
- **WatchlistItems**: Stocks in watchlists

### API Routes
- `/api/events/` - Event management
- `/api/events/{id}` - Full event details
- `/api/events/{id}/transcript` - Transcript retrieval
- `/api/watchlist/{user_id}` - User watchlist
- `/api/watchlist/{user_id}/items` - Add to watchlist
- `/api/watchlist/items/{item_id}` - Remove from watchlist
- `/api/watchlist/stocks/nasdaq100` - Get NASDAQ 100 stocks

### Key Features
1. **RAG-based Chat**: Every AI answer includes inline citations with timestamps
2. **AI Summarization**: Quicktake highlights with mandatory citations
3. **Q&A Mapping**: Analyst questions with deflection scoring
4. **Watchlist Management**: NASDAQ 100 stock selection and tracking

## User Preferences
- Use FastAPI backend (not Node.js)
- SQLite for development database
- No Slack/WhatsApp integrations
- Professional analyst dashboard design
- All AI answers must include citations with "View source" links

## Environment Variables
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `SESSION_SECRET`: Session management secret
- `DATABASE_URL`: SQLite database URL (development)

## Development Notes
- Frontend runs on port 5000 (Vite dev server)
- Backend runs on port 8000 (Uvicorn)
- Color scheme designed for long-term viewing comfort
- Company-specific colors: Purple (AAPL), Blue (MSFT), Red (GOOGL), Orange (AMZN)
