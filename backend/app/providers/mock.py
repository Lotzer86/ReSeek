from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from app.providers.base import TranscriptProvider, TranscriptData
import random


class MockProvider(TranscriptProvider):
    """Mock provider for testing and development"""
    
    SAMPLE_COMPANIES = [
        ("AAPL", "Apple Inc."),
        ("MSFT", "Microsoft Corporation"),
        ("GOOGL", "Alphabet Inc."),
        ("AMZN", "Amazon.com Inc."),
        ("TSLA", "Tesla Inc."),
        ("NVDA", "NVIDIA Corporation"),
        ("META", "Meta Platforms Inc."),
    ]
    
    SAMPLE_TRANSCRIPT = """
    Operator: Good afternoon, and welcome to the Q3 2024 Earnings Conference Call.
    
    [00:01:15] John Smith, CEO: Thank you for joining us today. I'm pleased to report strong results for Q3 2024. Revenue grew 25% year-over-year to $50.2 billion, exceeding our guidance of $48-49 billion. Our cloud business continues to be a major growth driver, with 35% growth this quarter.
    
    [00:03:42] Sarah Johnson, CFO: Let me walk through the financials. Gross margin expanded 200 basis points to 68%, driven by operational efficiencies and favorable product mix. Operating income was $15.8 billion, up 30% year-over-year. We generated $12.5 billion in free cash flow this quarter.
    
    [00:05:20] John Smith, CEO: Looking ahead to Q4, we expect revenue in the range of $52-54 billion, representing 20-25% growth. We're raising our full-year guidance for revenue to $195-197 billion and EPS to $8.50-8.60.
    
    [00:07:00] Operator: We'll now begin the Q&A session.
    
    [00:07:30] Michael Chen, Goldman Sachs: Thanks for taking my question. Can you provide more color on the cloud gross margins? Are you seeing any pricing pressure?
    
    [00:08:15] Sarah Johnson, CFO: Great question, Michael. Cloud margins improved significantly this quarter, up to 70% from 66% last quarter. We're not seeing meaningful pricing pressure. The improvement is driven by better utilization of our infrastructure and economies of scale.
    
    [00:09:45] Emily Rodriguez, Morgan Stanley: Hi, thanks. On the AI investments, how should we think about the ROI timeline? And are you seeing enterprise adoption accelerate?
    
    [00:10:30] John Smith, CEO: Emily, we're very excited about our AI initiatives. Enterprise adoption is accelerating faster than we anticipated. We've already signed deals with over 500 Fortune 2000 companies. In terms of ROI, we expect these investments to contribute meaningfully to revenue starting in the second half of next year.
    
    [00:12:15] David Lee, JPMorgan: Question on operating expenses. They were up 18% year-over-year. How should we think about opex growth going forward?
    
    [00:13:00] Sarah Johnson, CFO: David, we're investing heavily in R&D, particularly in AI and cloud infrastructure. We expect opex to grow in line with revenue, around 20-22% for the full year. We remain focused on operating leverage.
    
    [00:15:00] John Smith, CEO: Before we close, I want to emphasize our commitment to sustainable growth and shareholder value. We're executing well across all our businesses and are confident in our long-term strategy. Thank you all for joining today.
    """
    
    async def get_upcoming_events(self, tickers: List[str]) -> List[Dict[str, Any]]:
        """Generate mock upcoming events"""
        events = []
        base_date = datetime.now() + timedelta(days=1)
        
        for i, ticker in enumerate(tickers[:5]):
            company_name = next((name for t, name in self.SAMPLE_COMPANIES if t == ticker), f"{ticker} Corp")
            event_date = base_date + timedelta(days=i * 7)
            
            events.append({
                "ticker": ticker,
                "company_name": company_name,
                "event_date": event_date.isoformat(),
                "quarter": "Q3",
                "fiscal_year": 2024,
                "provider_event_id": f"mock_{ticker}_{event_date.strftime('%Y%m%d')}"
            })
        
        return events
    
    async def fetch_transcript(self, event_id: str) -> Optional[TranscriptData]:
        """Return mock transcript data"""
        parts = event_id.split("_")
        if len(parts) < 2:
            return None
        
        ticker = parts[1] if len(parts) > 1 else "MOCK"
        company_name = next((name for t, name in self.SAMPLE_COMPANIES if t == ticker), f"{ticker} Corp")
        
        return TranscriptData(
            ticker=ticker,
            company_name=company_name,
            event_date=datetime.now(),
            quarter="Q3",
            fiscal_year=2024,
            transcript_text=self.SAMPLE_TRANSCRIPT,
            audio_url="https://example.com/audio.mp3",
            provider_event_id=event_id,
            metadata={"source": "mock"}
        )
    
    async def check_new_transcripts(self, tickers: List[str]) -> List[TranscriptData]:
        """Randomly generate new transcripts for testing"""
        transcripts = []
        
        if random.random() < 0.1:
            ticker = random.choice(tickers) if tickers else "AAPL"
            company_name = next((name for t, name in self.SAMPLE_COMPANIES if t == ticker), f"{ticker} Corp")
            
            transcripts.append(TranscriptData(
                ticker=ticker,
                company_name=company_name,
                event_date=datetime.now(),
                quarter=f"Q{random.randint(1, 4)}",
                fiscal_year=2024,
                transcript_text=self.SAMPLE_TRANSCRIPT,
                audio_url="https://example.com/audio.mp3",
                provider_event_id=f"mock_{ticker}_{datetime.now().strftime('%Y%m%d%H%M')}",
                metadata={"source": "mock"}
            ))
        
        return transcripts
