import asyncio
import sys
from app.providers.mock import MockProvider
from app.database import SessionLocal
from app.models.models import User, Event

async def test_mock_provider():
    print("=" * 60)
    print("Testing ReSeek with Mock Data")
    print("=" * 60)
    
    provider = MockProvider()
    
    print("\n1. Testing mock provider...")
    try:
        transcript_data = await provider.fetch_transcript("mock_AAPL_20241028")
        print(f"✓ Fetched transcript for {transcript_data.ticker}")
        print(f"  Company: {transcript_data.company_name}")
        print(f"  Event Date: {transcript_data.event_date}")
        print(f"  Text length: {len(transcript_data.transcript_text)} characters")
        print(f"  Preview: {transcript_data.transcript_text[:200]}...")
    except Exception as e:
        print(f"✗ Error fetching transcript: {e}")
        return
    
    print("\n2. Testing database connection...")
    try:
        db = SessionLocal()
        
        test_user = User(id="test_user_123", email="test@example.com")
        db.add(test_user)
        db.commit()
        print("✓ Database write successful (created test user)")
        
        user = db.query(User).filter(User.email == "test@example.com").first()
        print(f"✓ Database read successful (found user: {user.email})")
        
        event_count = db.query(Event).count()
        print(f"✓ Events table accessible ({event_count} events)")
        
        db.close()
    except Exception as e:
        print(f"✗ Database error: {e}")
        return
    
    print("\n3. All tests passed! ✓")
    print("\nYou can now:")
    print("  - View API docs: http://localhost:8000/docs")
    print("  - Test frontend: http://localhost:5000")
    print("  - Create watchlists and chat with AI")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(test_mock_provider())
