from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: str
    database_url: str
    
    openai_api_key: str
    
    use_pgvector: bool = True
    pgvector_dim: int = 3072
    
    finnhub_api_key: str = ""
    quartr_api_key: str = ""
    
    app_base_url: str = "http://localhost:8000"
    environment: str = "development"
    
    poll_interval_seconds: int = 60
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()
