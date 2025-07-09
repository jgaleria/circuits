// Chat types for frontend

export interface ChatSession {
  id: string;
  user_id: string | null;
  title: string;
  model: string;
  created_at: string;
  updated_at: string;
  total_tokens: number;
  total_cost: number;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  user_id: string | null;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  tokens: number;
  cost: number;
}

export interface ChatSessionWithMessages extends ChatSession {
  messages: ChatMessage[];
}

export interface ChatSessionCreate {
  title: string;
  model: ModelId;
}

export interface ChatSessionUpdate {
  title?: string;
  model?: ModelId;
}

export interface ChatRequest {
  message: string;
  session_id: string;
  model: ModelId;
}

export interface ChatResponse {
  session_id: string;
  message_id: string;
  content: string;
  tokens: number;
  cost: number;
}

export interface UsageSummary {
  total_tokens: number;
  total_cost: number;
}

export const AVAILABLE_MODELS = [
  'gpt-3.5-turbo',
  'gpt-4',
  'gpt-4-turbo',
] as const;

export type ModelId = typeof AVAILABLE_MODELS[number]; 