import { useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { ChatMessage as ChatMessageType, ChatSessionWithMessages } from "../../lib/types/chat";

interface ChatInterfaceProps {
  messages: ChatMessageType[];
  loading: boolean;
  error: string | null;
  onSend: (data: { message: string; session_id: string; model: string }) => Promise<void>;
  session: ChatSessionWithMessages | null;
  fetchSession: () => Promise<void>;
}

export default function ChatInterface({
  messages,
  loading,
  error,
  onSend,
  session,
  fetchSession,
}: ChatInterfaceProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full bg-background px-2 sm:px-0">
      <div className="flex-1 overflow-y-auto py-4 space-y-2">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
        {loading && (
          <div className="flex justify-center text-muted-foreground animate-pulse">AI is thinking...</div>
        )}
      </div>
      <div className="border-t border-border p-2">
        <ChatInput
          onSend={async (message) => {
            if (session) {
              await onSend({ message, session_id: session.id, model: session.model });
              fetchSession();
            }
          }}
          loading={loading}
        />
        {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
      </div>
    </div>
  );
} 