import httpx
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from app.providers.base import TranscriptProvider, TranscriptData
from app.config import get_settings
import logging

logger = logging.getLogger(__name__)
settings = get_settings()


class FinnhubProvider(TranscriptProvider):
    def __init__(self):
        self.api_key = settings.finnhub_api_key
        self.base_url = "https://finnhub.io/api/v1"
    
    async def get_upcoming_events(self, tickers: List[str]) -> List[Dict[str, Any]]:
        """Fetch upcoming earnings calendar from Finnhub"""
        events = []
        
        if not self.api_key:
            logger.warning("Finnhub API key not set")
            return events
        
        from_date = datetime.now().strftime("%Y-%m-%d")
        to_date = (datetime.now() + timedelta(days=30)).strftime("%Y-%m-%d")
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/calendar/earnings",
                    params={"from": from_date, "to": to_date, "token": self.api_key}
                )
                response.raise_for_status()
                data = response.json()
                
                for event in data.get("earningsCalendar", []):
                    if event["symbol"] in tickers:
                        events.append({
                            "ticker": event["symbol"],
                            "event_date": event["date"],
                            "quarter": event.get("quarter"),
                            "fiscal_year": event.get("year"),
                            "provider_event_id": f"finnhub_{event['symbol']}_{event['date']}"
                        })
            except Exception as e:
                logger.error(f"Error fetching Finnhub events: {e}")
        
        return events
    
    async def fetch_transcript(self, event_id: str) -> Optional[TranscriptData]:
        """
        Fetch earnings call transcript from Finnhub.
        Note: Finnhub's free tier may not include transcripts.
        This is a placeholder implementation.
        """
        logger.info(f"Fetching transcript for event: {event_id}")
        return None
    
    async def check_new_transcripts(self, tickers: List[str]) -> List[TranscriptData]:
        """
        Check for new transcripts.
        Returns empty list as Finnhub free tier doesn't support transcripts well.
        """
        return []
