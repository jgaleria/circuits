import React, { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { ChatMessage as ChatMessageType } from "../../lib/types/chat";

/**
 * ChatInterface displays the chat messages and input area for a chat session.
 * @param messages - Array of chat messages
 * @param loading - Loading state for chat
 * @param error - Error message if any
 * @param onSend - Function to send a message
 * @param activeSessionId - The current session ID
 * @param model - The selected model
 * @param fetchSession - Function to refresh session data
 */
interface ChatInterfaceProps {
  messages: ChatMessageType[];
  loading: boolean;
  error: string | null;
  onSend: (data: { message: string; session_id: string; model: string }) => Promise<void>;
  activeSessionId: string | null;
  model: string;
  fetchSession: () => Promise<void>;
}

export default function ChatInterface({
  messages,
  loading,
  error,
  onSend,
  activeSessionId,
  model,
  fetchSession,
}: ChatInterfaceProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full bg-background px-2 sm:px-0">
      <div className="flex-1 overflow-y-auto py-4 space-y-2">
        {messages.map((msg: ChatMessageType) => (
          <ChatMessage key={msg.id + msg.created_at} message={msg} />
        ))}
        <div ref={bottomRef} />
        {loading && (
          <div className="flex justify-center text-muted-foreground animate-pulse">AI is thinking...</div>
        )}
      </div>
      <div className="border-t border-border p-2">
        <ChatInput
          onSend={async (message) => {
            if (activeSessionId) {
              await onSend({ message, session_id: activeSessionId, model });
              fetchSession();
            } else {
              alert("No session selected. Please select or create a chat session.");
            }
          }}
          loading={loading}
        />
        {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
      </div>
    </div>
  );
} 