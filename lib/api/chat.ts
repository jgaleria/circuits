import { apiClient } from './client';
import {
  ChatSession,
  ChatSessionWithMessages,
  ChatSessionCreate,
  ChatSessionUpdate,
  ChatRequest,
  ChatResponse,
  UsageSummary,
} from '../types/chat';

export async function createChatSession(data: ChatSessionCreate): Promise<ChatSession> {
  return apiClient.post<ChatSession>('/chat/sessions', data);
}

export async function getChatSessions(): Promise<ChatSession[]> {
  return apiClient.get<ChatSession[]>('/chat/sessions');
}

export async function getChatSession(sessionId: string): Promise<ChatSessionWithMessages> {
  return apiClient.get<ChatSessionWithMessages>(`/chat/sessions/${sessionId}`);
}

export async function sendMessage(sessionId: string, data: ChatRequest): Promise<ChatResponse> {
  return apiClient.post<ChatResponse>(`/chat/sessions/${sessionId}/messages`, data);
}

export async function updateChatSession(sessionId: string, data: ChatSessionUpdate): Promise<ChatSession> {
  return apiClient.put<ChatSession>(`/chat/sessions/${sessionId}`, data);
}

export async function deleteChatSession(sessionId: string): Promise<{ message: string }> {
  return apiClient.request<{ message: string }>(`/chat/sessions/${sessionId}`, { method: 'DELETE' });
}

export async function getUsageSummary(): Promise<UsageSummary> {
  return apiClient.get<UsageSummary>('/chat/usage/summary');
} 