import { ChatMessage as ChatMessageType } from "../../lib/types/chat";
import { ClipboardCopy } from "lucide-react";
import { useState } from "react";

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"} group`}
      aria-live="polite"
    >
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 shadow-md whitespace-pre-line break-words relative ${
          isUser
            ? "bg-blue-600 text-white ml-auto" // user: right, blue
            : "bg-muted text-foreground mr-auto" // assistant: left, gray
        }`}
      >
        <div className="text-xs opacity-60 mb-1 flex items-center gap-2">
          <span>{isUser ? "You" : "Agent"}</span>
          <span>{new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          <button
            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleCopy}
            aria-label="Copy message"
            tabIndex={0}
          >
            <ClipboardCopy size={16} />
          </button>
          {copied && <span className="ml-1 text-green-400">Copied!</span>}
        </div>
        <div className="text-sm" style={{ whiteSpace: "pre-wrap" }}>{message.content}</div>
      </div>
    </div>
  );
} 