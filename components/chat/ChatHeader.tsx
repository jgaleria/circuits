import ModelSelector from "./ModelSelector";
import { ChatSessionWithMessages } from "../../lib/types/chat";

interface ChatHeaderProps {
  totalTokens: number;
  totalCost: number;
  session: ChatSessionWithMessages | null;
  setSessionModel?: (model: string) => void;
}

export default function ChatHeader({
  totalTokens,
  totalCost,
  session,
  setSessionModel,
}: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between px-4 py-2 border-b border-border bg-background/80 backdrop-blur z-10">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-lg text-white">
          {session?.title || "New Chat"}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <ModelSelector session={session} setSessionModel={setSessionModel} />
        <div className="text-xs text-muted-foreground">
          <span className="mr-2">Tokens: {totalTokens}</span>
          <span>Cost: ${totalCost.toFixed(6)}</span>
        </div>
      </div>
    </header>
  );
} 