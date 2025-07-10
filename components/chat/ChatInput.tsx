import { useState, useRef } from "react";

interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  loading: boolean;
}

const CHAR_LIMIT = 1000;

export default function ChatInput({ onSend, loading }: ChatInputProps) {
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
    <div className="flex flex-col gap-1">
      <div className="relative">
        <textarea
          ref={textareaRef}
          className="w-full rounded-md border border-border bg-background px-3 py-2 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[40px] max-h-32 transition"
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
        className="mt-1 self-end bg-blue-600 text-white px-4 py-1 rounded-md shadow hover:bg-blue-700 transition disabled:opacity-50"
        onClick={handleSend}
        disabled={loading || !value.trim()}
        aria-label="Send message"
      >
        {loading ? "Sending..." : "Send"}
      </button>
    </div>
  );
} 