import { useState, useRef } from "react";
import React from "react";

interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  loading: boolean;
}

const CHAR_LIMIT = 1000;

/**
 * ChatInput provides a textarea and send button for user input in the chat interface.
 * @param onSend - Callback to send a message
 * @param loading - Whether the input is disabled/loading
 */
const ChatInput: React.FC<ChatInputProps> = ({ onSend, loading }) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!value.trim()) return;
    if (value.length > CHAR_LIMIT) {
      setError("Message too long");
      return;
    }
    setError(null);
    console.log("ChatInput: handleSend called with:", value); // Debug log
    await onSend(value.trim());
    setValue("");
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col gap-2 font-sans mt-2">
      <div className="relative">
        <textarea
          ref={textareaRef}
          className="w-full rounded-md border border-border bg-background px-3 py-2 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-circuits-dark-blue resize-none min-h-[40px] max-h-32 transition font-sans"
          placeholder="Type your message..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={CHAR_LIMIT + 1}
          rows={1}
          disabled={loading}
        />
        <span className="absolute bottom-2 right-3 text-xs text-muted-foreground">
          {value.length}/{CHAR_LIMIT}
        </span>
      </div>
      {error && <div className="text-red-500 text-xs">{error}</div>}
      <button
        className="self-end bg-circuits-dark-blue text-white px-4 py-1 rounded-lg shadow hover:bg-circuits-medium-blue transition disabled:opacity-50 border-2 border-circuits-dark-blue mt-2"
        onClick={handleSend}
        disabled={loading || !value.trim()}
        aria-label="Send message"
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
};

export default React.memo(ChatInput); 