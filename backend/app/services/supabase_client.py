from supabase import create_client, Client
from app.config import settings

def get_supabase_client() -> Client:
    supabase: Client = create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_SERVICE_ROLE_KEY
    )
    return supabase 