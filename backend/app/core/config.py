from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "postgresql+psycopg://postgres:123456@localhost:5432/ragdb"

    # JWT
    JWT_SECRET: str = "3e1b7b8f9d7e4a0e9c8b5f79a6d3b2c4f5e6a7d8b9c0d1e2f3a4b5c6d7e8f9a0"
    JWT_ALGO: str = "HS256"

    # Embedding model
    EMBED_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"

    # CORS
    cors_origins: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
