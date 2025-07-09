"use client";
import { useEffect, useState } from "react";
import { useChatSessions } from "../../lib/hooks/useChatSessions";
import { useChat } from "../../lib/hooks/useChat";
import ChatInterface from "../../components/chat/ChatInterface";
import ChatHeader from "../../components/chat/ChatHeader";
import ModelSelector from "../../components/chat/ModelSelector";
import MainLayout from "../../components/main-layout";
import ChatSidebar from "../../components/chat/ChatSidebar";

export default function AgentPage() {
  const {
    sessions,
    loading: sessionsLoading,
    error: sessionsError,
    fetchSessions,
    addSession,
    removeSession,
  } = useChatSessions();
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  // On mount, fetch sessions
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    if (!sessionsLoading && sessions.length > 0 && !activeSessionId) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions, sessionsLoading, activeSessionId]);

  const {
    session,
    messages,
    loading: chatLoading,
    error: chatError,
    sending,
    fetchSession,
    sendMessage,
    totalTokens,
    totalCost,
    setSessionModel,
  } = useChat(activeSessionId || "");

  const openNewChatModal = () => {
    setNewTitle("");
    setShowModal(true);
  };

  const handleModalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTitle.trim()) return;
    const newSession = await addSession({ title: newTitle.trim(), model: "gpt-3.5-turbo" });
    setActiveSessionId(newSession.id);
    setShowModal(false);
  };

  return (
    <MainLayout>
      {/* Modal for new chat title */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form
            className="bg-zinc-900 rounded-lg shadow-lg p-6 flex flex-col gap-4 min-w-[300px]"
            onSubmit={handleModalSubmit}
          >
            <label className="text-white font-semibold text-lg">New Chat Title</label>
            <input
              className="rounded px-3 py-2 border border-zinc-700 bg-zinc-800 text-white focus:outline-none"
              autoFocus
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Enter chat title..."
              maxLength={100}
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className="px-4 py-2 rounded bg-zinc-700 text-white hover:bg-zinc-600"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                disabled={!newTitle.trim()}
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="flex flex-row h-[calc(100vh-4rem-6rem)] w-full bg-background rounded-xl shadow-lg overflow-hidden">
        {/* Sidebar (now part of main content, not fixed) */}
        <ChatSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          setActiveSessionId={setActiveSessionId}
          loading={sessionsLoading}
          error={sessionsError}
          onNewChat={openNewChatModal}
          onDeleteSession={removeSession}
          layout="embedded"
        />
        {/* Main chat area */}
        <div className="flex-1 flex flex-col items-center justify-center overflow-hidden">
          <div className="w-full max-w-2xl flex flex-col h-full">
            <ChatHeader
              totalTokens={totalTokens}
              totalCost={totalCost}
              session={session}
              setSessionModel={setSessionModel}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
              {sessions.length === 0 && !sessionsLoading ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-4">
                  <div className="text-lg text-muted-foreground">No chats yet. Start a new conversation!</div>
                  <button
                    className="bg-blue-600 text-white px-6 py-2 rounded-md shadow hover:bg-blue-700 transition"
                    onClick={openNewChatModal}
                  >
                    Start a New Chat
                  </button>
                </div>
              ) : activeSessionId ? (
                <ChatInterface
                  messages={messages}
                  loading={chatLoading || sending}
                  error={chatError}
                  onSend={async ({ message }) => {
                    if (session) {
                      await sendMessage({
                        message,
                        session_id: session.id,
                        model: session.model,
                      });
                    }
                  }}
                  session={session}
                  fetchSession={fetchSession}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 