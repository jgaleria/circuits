import { useState, useCallback } from 'react';
import {
  createChatSession,
  getChatSessions,
  updateChatSession,
  deleteChatSession,
} from '../api/chat';
import { ChatSession, ChatSessionCreate, ChatSessionUpdate } from '../types/chat';

export function useChatSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getChatSessions();
      // Filter duplicates by id
      const uniqueSessions = Array.from(new Map(data.map(s => [s.id, s])).values());
      setSessions(uniqueSessions);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  }, []);

  const addSession = useCallback(async (session: ChatSessionCreate) => {
    setLoading(true);
    setError(null);
    try {
      const newSession = await createChatSession(session);
      setSessions((prev) => {
        if (prev.some((s) => s.id === newSession.id)) return prev;
        return [newSession, ...prev];
      });
      return newSession;
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to create session');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const editSession = useCallback(async (id: string, updates: ChatSessionUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateChatSession(id, updates);
      setSessions((prev) => prev.map((s) => (s.id === id ? updated : s)));
      return updated;
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to update session');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeSession = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteChatSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to delete session');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    addSession,
    editSession,
    removeSession,
  };
} 