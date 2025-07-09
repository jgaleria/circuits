import { AVAILABLE_MODELS, ModelId, ChatSessionWithMessages } from "../../lib/types/chat";

interface ModelSelectorProps {
  session: ChatSessionWithMessages | null;
  setSessionModel?: (model: ModelId) => void;
}

const MODEL_COSTS: Record<ModelId, string> = {
  "gpt-3.5-turbo": "$0.002/1K",
  "gpt-4": "$0.06/1K",
  "gpt-4-turbo": "$0.03/1K",
};

export default function ModelSelector({ session, setSessionModel }: ModelSelectorProps) {
  return (
    <select
      className="rounded px-2 py-1 border border-border bg-background text-sm focus:outline-none"
      value={session?.model || AVAILABLE_MODELS[0]}
      onChange={e => setSessionModel && setSessionModel(e.target.value as ModelId)}
      disabled={!setSessionModel}
      title={setSessionModel ? "Select model" : "Model selection unavailable"}
    >
      {AVAILABLE_MODELS.map((model) => (
        <option key={model} value={model}>
          {model} ({MODEL_COSTS[model]})
        </option>
      ))}
    </select>
  );
} 