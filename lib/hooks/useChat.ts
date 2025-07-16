import { useState, useCallback, useEffect } from 'react';
import { getChatSession, sendMessage, updateChatSession } from '../api/chat';
import { ChatSessionWithMessages, ChatMessage, ChatRequest, ChatResponse, ModelId } from '../types/chat';

/**
 * useChat manages chat session state, messages, and sending logic for a chat session.
 * @param sessionId - The chat session ID
 */
export function useChat(sessionId: string) {
  const [session, setSession] = useState<ChatSessionWithMessages | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const fetchSession = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getChatSession(sessionId);
      setSession(data);
      setMessages(data.messages);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message || 'Failed to fetch session');
      else setError('Failed to fetch session');
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // Always fetch session/messages and clear messages when sessionId changes
  useEffect(() => {
    setSession(null);
    setMessages([]);
    if (sessionId) {
      fetchSession();
    }
  }, [sessionId, fetchSession]);

  const setSessionModel = useCallback(async (model: ModelId) => {
    if (!sessionId) return;
    try {
      const updated = await updateChatSession(sessionId, { model });
      setSession((prev) => prev ? { ...prev, model: updated.model } : prev);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message || 'Failed to update model');
      else setError('Failed to update model');
    }
  }, [sessionId]);

  const send = useCallback(async (req: ChatRequest) => {
    setSending(true);
    setError(null);
    try {
      console.log("useChat: sendMessage called with:", req); // Debug log
      // Always use the current model from session state
      const model = session?.model || req.model;
      const res: ChatResponse = await sendMessage(sessionId, { ...req, model: model as ModelId });
      // Optimistically add user message
      setMessages((prev) => [
        ...prev,
        {
          id: res.message_id + '-user',
          session_id: sessionId,
          user_id: session?.user_id || null,
          role: 'user',
          content: req.message,
          created_at: new Date().toISOString(),
          tokens: 0,
          cost: 0,
        },
        {
          id: res.message_id,
          session_id: sessionId,
          user_id: null,
          role: 'assistant',
          content: res.content,
          created_at: new Date().toISOString(),
          tokens: res.tokens,
          cost: res.cost,
        },
      ]);
      // Optionally, re-fetch session for accurate stats/messages
      await fetchSession();
      return res;
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message || 'Failed to send message');
      else setError('Failed to send message');
      throw err;
    } finally {
      setSending(false);
    }
  }, [sessionId, session, fetchSession]);

  return {
    session,
    messages,
    loading,
    error,
    sending,
    fetchSession,
    sendMessage: send,
    totalTokens: session?.total_tokens ?? 0,
    totalCost: session?.total_cost ?? 0,
    setSessionModel,
  };
} 