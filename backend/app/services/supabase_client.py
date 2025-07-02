from supabase import create_client, Client
from app.config import settings
import logging

logger = logging.getLogger(__name__)

def get_supabase_client() -> Client:
    try:
        if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
            raise ValueError("Missing Supabase configuration")
        supabase: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_ROLE_KEY
        )
        logger.info("Supabase client created successfully")
        return supabase
    except Exception as e:
        logger.error(f"Failed to create Supabase client: {e}")
        raise 