from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Uptime Monitor API"
    DATABASE_URL: str = "sqlite:///./uptime_monitor.db"
    PING_INTERVAL_SECONDS: int = 60
    REQUEST_TIMEOUT_SECONDS: int = 5

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

