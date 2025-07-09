from fastapi import APIRouter, HTTPException, status, Depends, Request, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field, constr
from typing import Optional, List, Dict, Any, Annotated
from datetime import datetime
import os
import openai
import re
from app.services.supabase_client import get_supabase_client
from app.middleware.auth import get_current_user

# --- Utility Functions and Constants ---
MODEL_COSTS = {
    "gpt-3.5-turbo": {"input": 0.0005, "output": 0.0015},  # per 1K tokens
    "gpt-4": {"input": 0.03, "output": 0.06},
    "gpt-4-turbo": {"input": 0.01, "output": 0.03},
}

def calculate_cost(model: str, input_tokens: int, output_tokens: int) -> float:
    cost_info = MODEL_COSTS.get(model, MODEL_COSTS["gpt-3.5-turbo"])
    return (
        (input_tokens / 1000) * cost_info["input"] +
        (output_tokens / 1000) * cost_info["output"]
    )

def estimate_tokens(text: str) -> int:
    # Simple token estimation: 1 token ≈ 4 chars (for English)
    return max(1, len(text) // 4)

# --- Pydantic Models ---
class ChatSessionCreate(BaseModel):
    title: str = Field(..., max_length=100)
    model: Annotated[str, constr(pattern=r"^gpt-(3\.5-turbo|4|4-turbo)$")]

class ChatSessionUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=100)
    model: Optional[Annotated[str, constr(pattern=r"^gpt-(3\.5-turbo|4|4-turbo)$")]]

class ChatRequest(BaseModel):
    message: str
    session_id: str
    model: Annotated[str, constr(pattern=r"^gpt-(3\.5-turbo|4|4-turbo)$")]

class ChatResponse(BaseModel):
    session_id: str
    message_id: str
    content: str
    tokens: int
    cost: float

class ChatSession(BaseModel):
    id: str
    user_id: Optional[str]
    title: str
    model: str
    created_at: datetime
    updated_at: datetime
    total_tokens: int
    total_cost: float

class ChatMessage(BaseModel):
    id: str
    session_id: str
    user_id: Optional[str] = None
    role: str
    content: str
    created_at: datetime
    tokens: int
    cost: float

class ChatSessionWithMessages(ChatSession):
    messages: List[ChatMessage] = []

# --- Authentication Dependency ---
security = HTTPBearer()

async def get_optional_current_user(credentials: Optional[HTTPAuthorizationCredentials] = Security(security)) -> Optional[dict]:
    if credentials is None:
        return None
    try:
        return await get_current_user(credentials)
    except Exception:
        return None

# --- Router Setup ---
router = APIRouter(prefix="/chat", tags=["chat"])

# --- Endpoints ---
@router.post("/sessions", response_model=ChatSession)
async def create_session(
    data: ChatSessionCreate,
    request: Request,
    user: Optional[dict] = Depends(get_optional_current_user)
):
    supabase = get_supabase_client()
    user_id = user.id if user else None
    now = datetime.utcnow().isoformat()
    session_data = {
        "user_id": user_id,
        "title": data.title,
        "model": data.model,
        "created_at": now,
        "updated_at": now,
        "total_tokens": 0,
        "total_cost": 0.0
    }
    try:
        response = supabase.table("chat_sessions").insert(session_data).execute()
        if response.data and len(response.data) > 0:
            session = response.data[0]
            return ChatSession(**session)
        else:
            raise HTTPException(status_code=500, detail="Failed to create chat session")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating chat session: {e}")

@router.get("/sessions", response_model=List[ChatSession])
async def get_sessions(
    request: Request,
    user: Optional[dict] = Depends(get_optional_current_user)
):
    supabase = get_supabase_client()
    try:
        query = supabase.table("chat_sessions").select("*").order("updated_at", desc=True)
        if user:
            query = query.eq("user_id", user.id)
        else:
            query = query.is_("user_id", None)
        response = query.execute()
        if response.data:
            return [ChatSession(**s) for s in response.data]
        else:
            return []
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching chat sessions: {e}")

@router.get("/sessions/{session_id}", response_model=ChatSessionWithMessages)
async def get_session(
    session_id: str,
    request: Request,
    user: Optional[dict] = Depends(get_optional_current_user)
):
    supabase = get_supabase_client()
    try:
        # Fetch session
        session_query = supabase.table("chat_sessions").select("*").eq("id", session_id)
        if user:
            session_query = session_query.eq("user_id", user.id)
        else:
            session_query = session_query.is_("user_id", None)
        session_resp = session_query.single().execute()
        if not session_resp.data:
            raise HTTPException(status_code=404, detail="Session not found")
        session = session_resp.data
        # Fetch messages
        messages_query = supabase.table("chat_messages").select("*").eq("session_id", session_id).order("created_at")
        messages_resp = messages_query.execute()
        messages = [ChatMessage(**m) for m in messages_resp.data] if messages_resp.data else []
        return ChatSessionWithMessages(**session, messages=messages)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching session: {e}")

@router.post("/sessions/{session_id}/messages", response_model=ChatResponse)
async def send_message(
    session_id: str,
    data: ChatRequest,
    request: Request,
    user: Optional[dict] = Depends(get_optional_current_user)
):
    supabase = get_supabase_client()
    try:
        # Validate session access
        session_query = supabase.table("chat_sessions").select("*").eq("id", session_id)
        if user:
            session_query = session_query.eq("user_id", user.id)
        else:
            session_query = session_query.is_("user_id", None)
        session_resp = session_query.single().execute()
        if not session_resp.data:
            raise HTTPException(status_code=404, detail="Session not found or access denied")
        session = session_resp.data
        # Save user message
        user_msg = {
            "session_id": session_id,
            "role": "user",
            "content": data.message,
            "tokens": estimate_tokens(data.message),
            "cost": 0.0,  # Will update after OpenAI call
            "user_id": user.id if user else None
        }
        user_msg_resp = supabase.table("chat_messages").insert(user_msg).execute()
        if not user_msg_resp.data or len(user_msg_resp.data) == 0:
            raise HTTPException(status_code=500, detail="Failed to save user message")
        user_msg_id = user_msg_resp.data[0]["id"]
        # Get conversation history (all messages for this session)
        messages_resp = supabase.table("chat_messages").select("*").eq("session_id", session_id).order("created_at").execute()
        messages = messages_resp.data if messages_resp.data else []
        openai_messages = [
            {"role": m["role"], "content": m["content"]}
            for m in messages
        ]
        # Add the new user message to the context
        openai_messages.append({"role": "user", "content": data.message})
        # Call OpenAI
        openai.api_key = os.environ["OPENAI_API_KEY"]
        try:
            response = openai.chat.completions.create(
                model=session["model"],
                messages=openai_messages,
                max_tokens=1024,
                temperature=0.7
            )
            ai_content = response.choices[0].message.content
            usage = response.usage
            input_tokens = usage.prompt_tokens
            output_tokens = usage.completion_tokens
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"OpenAI error: {e}")
        # Save AI message
        ai_msg = {
            "session_id": session_id,
            "role": "assistant",
            "content": ai_content,
            "tokens": output_tokens,
            "cost": calculate_cost(session["model"], input_tokens, output_tokens),
        }
        ai_msg_resp = supabase.table("chat_messages").insert(ai_msg).execute()
        if not ai_msg_resp.data or len(ai_msg_resp.data) == 0:
            raise HTTPException(status_code=500, detail="Failed to save AI message")
        ai_msg_id = ai_msg_resp.data[0]["id"]
        # Update session totals
        total_tokens = (session["total_tokens"] or 0) + input_tokens + output_tokens
        total_cost = float(session["total_cost"] or 0) + calculate_cost(session["model"], input_tokens, output_tokens)
        supabase.table("chat_sessions").update({
            "total_tokens": total_tokens,
            "total_cost": total_cost,
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", session_id).execute()
        return ChatResponse(
            session_id=session_id,
            message_id=ai_msg_id,
            content=ai_content,
            tokens=output_tokens,
            cost=calculate_cost(session["model"], input_tokens, output_tokens)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error sending message: {e}")

@router.put("/sessions/{session_id}", response_model=ChatSession)
async def update_session(
    session_id: str,
    data: ChatSessionUpdate,
    request: Request,
    user: Optional[dict] = Depends(get_optional_current_user)
):
    supabase = get_supabase_client()
    try:
        # Validate session ownership
        session_query = supabase.table("chat_sessions").select("*").eq("id", session_id)
        if user:
            session_query = session_query.eq("user_id", user.id)
        else:
            session_query = session_query.is_("user_id", None)
        session_resp = session_query.single().execute()
        if not session_resp.data:
            raise HTTPException(status_code=404, detail="Session not found or access denied")
        update_data = {k: v for k, v in data.model_dump(exclude_unset=True).items() if v is not None}
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        update_data["updated_at"] = datetime.utcnow().isoformat()
        update_resp = supabase.table("chat_sessions").update(update_data).eq("id", session_id).execute()
        if not update_resp.data or len(update_resp.data) == 0:
            raise HTTPException(status_code=500, detail="Failed to update session")
        return ChatSession(**update_resp.data[0])
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating session: {e}")

@router.delete("/sessions/{session_id}")
async def delete_session(
    session_id: str,
    request: Request,
    user: Optional[dict] = Depends(get_optional_current_user)
):
    supabase = get_supabase_client()
    try:
        # Validate session ownership
        session_query = supabase.table("chat_sessions").select("*").eq("id", session_id)
        if user:
            session_query = session_query.eq("user_id", user.id)
        else:
            session_query = session_query.is_("user_id", None)
        session_resp = session_query.single().execute()
        if not session_resp.data:
            raise HTTPException(status_code=404, detail="Session not found or access denied")
        # Delete session (cascade deletes messages)
        del_resp = supabase.table("chat_sessions").delete().eq("id", session_id).execute()
        if del_resp.status_code not in (200, 204):
            raise HTTPException(status_code=500, detail="Failed to delete session")
        return {"message": "Session deleted"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting session: {e}")

@router.get("/usage/summary")
async def get_usage_summary(
    request: Request,
    user: Optional[dict] = Depends(get_optional_current_user)
):
    supabase = get_supabase_client()
    try:
        query = supabase.table("chat_sessions").select("total_tokens", "total_cost")
        if user:
            query = query.eq("user_id", user.id)
        else:
            query = query.is_("user_id", None)
        response = query.execute()
        total_tokens = sum(s["total_tokens"] or 0 for s in response.data) if response.data else 0
        total_cost = sum(float(s["total_cost"] or 0) for s in response.data) if response.data else 0.0
        return {"total_tokens": total_tokens, "total_cost": total_cost}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching usage summary: {e}") 