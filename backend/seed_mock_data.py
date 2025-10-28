import asyncio
from datetime import datetime, timedelta
from app.database import SessionLocal
from app.models.models import User, Event, Transcript, TranscriptChunk, Summary, QAItem, Watchlist, WatchlistItem
from app.providers.mock import MockProvider

async def seed_database():
    print("=" * 70)
    print("🌱 Seeding ReSeek Database with Mock Data")
    print("=" * 70)
    
    db = SessionLocal()
    provider = MockProvider()
    
    try:
        # Create a test user
        print("\n1. Creating test user...")
        user = User(id="demo_user", email="demo@reseek.com")
        db.add(user)
        db.commit()
        print(f"   ✓ Created user: {user.email}")
        
        # Create watchlist
        print("\n2. Creating watchlist...")
        watchlist = Watchlist(user_id=user.id, name="Tech Giants")
        db.add(watchlist)
        db.commit()
        
        # Companies to track
        companies = [
            {"ticker": "AAPL", "name": "Apple Inc."},
            {"ticker": "MSFT", "name": "Microsoft Corporation"},
            {"ticker": "GOOGL", "name": "Alphabet Inc."},
            {"ticker": "AMZN", "name": "Amazon.com Inc."},
        ]
        
        print("\n3. Adding companies to watchlist...")
        for company in companies:
            item = WatchlistItem(
                watchlist_id=watchlist.id,
                ticker=company["ticker"],
                company_name=company["name"]
            )
            db.add(item)
            print(f"   ✓ Added {company['ticker']} - {company['name']}")
        db.commit()
        
        print("\n4. Generating mock earnings calls (completed)...")
        events_created = []
        
        for i, company in enumerate(companies):
            print(f"\n   Processing {company['ticker']}...")
            
            # Generate transcript data
            transcript_id = f"mock_{company['ticker']}_{datetime.now().strftime('%Y%m%d')}"
            transcript_data = await provider.fetch_transcript(transcript_id)
            
            # Create completed event
            event_date = datetime.now() - timedelta(days=i*7)  # Stagger events
            event = Event(
                ticker=company["ticker"],
                company_name=company["name"],
                event_type="EARNINGS_CALL",
                event_status="COMPLETED",
                event_date=event_date,
                quarter="Q3",
                fiscal_year=2024,
                provider="mock",
                provider_event_id=transcript_id
            )
            db.add(event)
            db.commit()
            events_created.append(event)
            print(f"      ✓ Created earnings call event (ID: {event.id})")
            
            # Create transcript
            transcript = Transcript(
                event_id=event.id,
                raw_text=transcript_data.transcript_text
            )
            db.add(transcript)
            db.commit()
            print(f"      ✓ Saved transcript ({len(transcript_data.transcript_text)} chars)")
            
            # Create transcript chunks
            print(f"      → Creating chunks...")
            # Simple chunking by paragraph
            paragraphs = [p.strip() for p in transcript_data.transcript_text.split('\n\n') if p.strip()]
            
            for idx, para in enumerate(paragraphs[:5]):  # Limit to 5 chunks for demo
                chunk = TranscriptChunk(
                    transcript_id=transcript.id,
                    chunk_index=idx,
                    text=para,
                    start_time=f"00:{idx*2:02d}:00",
                    end_time=f"00:{idx*2+2:02d}:00",
                    speaker="CEO" if idx % 2 == 0 else "CFO",
                    token_count=len(para.split()),
                    embedding=None  # Skip embeddings for SQLite demo
                )
                db.add(chunk)
            db.commit()
            print(f"      ✓ Created {min(5, len(paragraphs))} transcript chunks")
            
            # Generate summary
            print(f"      → Generating summary...")
            
            quicktake = {
                "highlights": [
                    {"text": "Strong revenue growth of 12% YoY, driven by robust product demand", "citation": {"timestamp": "00:01:30", "chunk_index": 0}},
                    {"text": "Operating margin expanded to 28%, up 200 basis points from prior year", "citation": {"timestamp": "00:05:15", "chunk_index": 0}},
                    {"text": "Announced new product initiatives launching in Q4 2024", "citation": {"timestamp": "00:12:45", "chunk_index": 0}},
                    {"text": "Raised full-year guidance based on solid business momentum", "citation": {"timestamp": "00:25:30", "chunk_index": 0}}
                ],
                "sentiment": "positive"
            }
            
            extractive_quotes = [
                {"quote": "Revenue grew 12% year-over-year, driven by strong demand across all product lines", "speaker": "CEO", "timestamp": "00:01:30"},
                {"quote": "We're seeing tremendous opportunities in AI and cloud infrastructure", "speaker": "CEO", "timestamp": "00:12:45"},
                {"quote": "Operating margin expanded to 28%, reflecting our operational discipline", "speaker": "CFO", "timestamp": "00:05:15"}
            ]
            
            guidance_table = {
                "FY2024": {
                    "revenue": "12-15% growth",
                    "operating_margin": "27-29%",
                    "eps": "$5.20-5.40"
                }
            }
            
            delta_analysis = {
                "vs_prior_quarter": {"revenue": "+3%", "margin": "+50bps"},
                "vs_prior_year": {"revenue": "+12%", "margin": "+200bps"}
            }
            
            summary = Summary(
                event_id=event.id,
                quicktake=quicktake,
                extractive_quotes=extractive_quotes,
                guidance_table=guidance_table,
                delta_analysis=delta_analysis
            )
            db.add(summary)
            db.commit()
            print(f"      ✓ Generated summary with {len(quicktake['highlights'])} highlights")
            
            # Generate Q&A items
            print(f"      → Creating Q&A mappings...")
            qa_items_data = [
                {
                    "question_text": "What drove the revenue growth this quarter?",
                    "answer_text": "Revenue growth was primarily driven by strong demand across all product categories, particularly in our cloud and enterprise segments.",
                    "deflection_score": 15,
                    "question_timestamp": "00:28:45",
                    "answer_timestamp": "00:29:05",
                    "analyst_name": "Sarah Johnson",
                    "analyst_firm": "Goldman Sachs"
                },
                {
                    "question_text": "Can you provide more color on the margin expansion?",
                    "answer_text": "The margin expansion reflects improved operational efficiency and favorable product mix. We've been very disciplined on cost management.",
                    "deflection_score": 10,
                    "question_timestamp": "00:32:10",
                    "answer_timestamp": "00:32:35",
                    "analyst_name": "Michael Chen",
                    "analyst_firm": "Morgan Stanley"
                },
                {
                    "question_text": "What are the key risks to your guidance?",
                    "answer_text": "While we're confident in our outlook, we remain mindful of macroeconomic uncertainties and competitive dynamics in certain markets.",
                    "deflection_score": 45,
                    "question_timestamp": "00:41:20",
                    "answer_timestamp": "00:42:00",
                    "analyst_name": "Jennifer Wu",
                    "analyst_firm": "JP Morgan"
                }
            ]
            
            for idx, qa_data in enumerate(qa_items_data):
                qa_item = QAItem(
                    event_id=event.id,
                    question_index=idx,
                    question_text=qa_data["question_text"],
                    answer_text=qa_data["answer_text"],
                    deflection_score=qa_data["deflection_score"],
                    question_timestamp=qa_data["question_timestamp"],
                    answer_timestamp=qa_data["answer_timestamp"],
                    analyst_name=qa_data["analyst_name"],
                    analyst_firm=qa_data["analyst_firm"],
                    topic="Financials"
                )
                db.add(qa_item)
            db.commit()
            print(f"      ✓ Created {len(qa_items_data)} Q&A items")
        
        # Add upcoming events
        print("\n5. Generating upcoming earnings calls...")
        upcoming_companies = [
            {"ticker": "NVDA", "name": "NVIDIA Corporation", "days_ahead": 3},
            {"ticker": "TSLA", "name": "Tesla Inc.", "days_ahead": 5},
            {"ticker": "META", "name": "Meta Platforms Inc.", "days_ahead": 7},
            {"ticker": "NFLX", "name": "Netflix Inc.", "days_ahead": 10},
            {"ticker": "AMD", "name": "Advanced Micro Devices Inc.", "days_ahead": 12},
            {"ticker": "INTC", "name": "Intel Corporation", "days_ahead": 14},
            {"ticker": "ADBE", "name": "Adobe Inc.", "days_ahead": 17},
            {"ticker": "CSCO", "name": "Cisco Systems Inc.", "days_ahead": 21},
        ]
        
        upcoming_events_created = []
        for upcoming in upcoming_companies:
            event_date = datetime.now() + timedelta(days=upcoming["days_ahead"])
            upcoming_event = Event(
                ticker=upcoming["ticker"],
                company_name=upcoming["name"],
                event_type="EARNINGS_CALL",
                event_status="UPCOMING",
                event_date=event_date,
                quarter="Q4",
                fiscal_year=2024,
                provider="mock",
                provider_event_id=f"upcoming_{upcoming['ticker']}_{event_date.strftime('%Y%m%d')}"
            )
            db.add(upcoming_event)
            db.commit()
            upcoming_events_created.append(upcoming_event)
            print(f"   ✓ {upcoming['ticker']} - {event_date.strftime('%b %d, %Y')} (in {upcoming['days_ahead']} days)")
            
        print("\n" + "=" * 70)
        print("✅ Database seeding complete!")
        print("=" * 70)
        print(f"\nCreated:")
        print(f"  • 1 test user (demo@reseek.com)")
        print(f"  • 1 watchlist with {len(companies)} companies")
        print(f"  • {len(events_created)} completed earnings calls")
        print(f"  • {len(events_created)} transcripts with chunks")
        print(f"  • {len(events_created)} AI-generated summaries")
        print(f"  • {len(events_created) * 3} Q&A mappings")
        print(f"  • {len(upcoming_events_created)} upcoming earnings calls")
        print(f"\n🚀 Refresh your dashboard to see the data!")
        print("=" * 70)
        
    except Exception as e:
        print(f"\n❌ Error seeding database: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
