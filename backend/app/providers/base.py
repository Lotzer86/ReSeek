from abc import ABC, abstractmethod
from typing import Optional, List, Dict, Any
from datetime import datetime


class TranscriptData:
    def __init__(
        self,
        ticker: str,
        company_name: str,
        event_date: datetime,
        quarter: Optional[str],
        fiscal_year: Optional[int],
        transcript_text: str,
        audio_url: Optional[str] = None,
        provider_event_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ):
        self.ticker = ticker
        self.company_name = company_name
        self.event_date = event_date
        self.quarter = quarter
        self.fiscal_year = fiscal_year
        self.transcript_text = transcript_text
        self.audio_url = audio_url
        self.provider_event_id = provider_event_id
        self.metadata = metadata or {}


class TranscriptProvider(ABC):
    @abstractmethod
    async def get_upcoming_events(self, tickers: List[str]) -> List[Dict[str, Any]]:
        """
        Fetch upcoming earnings events for given tickers.
        Returns list of event metadata.
        """
        pass
    
    @abstractmethod
    async def fetch_transcript(self, event_id: str) -> Optional[TranscriptData]:
        """
        Fetch transcript for a specific event.
        Returns TranscriptData or None if not available.
        """
        pass
    
    @abstractmethod
    async def check_new_transcripts(self, tickers: List[str]) -> List[TranscriptData]:
        """
        Check for new transcripts for watched tickers.
        Called by the polling scheduler.
        """
        pass
