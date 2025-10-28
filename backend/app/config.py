from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    supabase_url: str = "https://placeholder.supabase.co"
    supabase_anon_key: str = "placeholder-anon-key"
    supabase_service_role_key: str = "placeholder-service-role-key"
    database_url: str = "sqlite:///./reseek.db"
    
    openai_api_key: str
    
    use_pgvector: bool = False
    pgvector_dim: int = 3072
    
    finnhub_api_key: str = ""
    quartr_api_key: str = ""
    
    app_base_url: str = "http://localhost:8000"
    environment: str = "development"
    
    poll_interval_seconds: int = 60
    
    class Config:
        env_file = ".env"
        case_sensitive = False
        env_file_encoding = 'utf-8'


@lru_cache()
def get_settings() -> Settings:
    return Settings()
