"use client";
import { useEffect, useState } from "react";
import { useChatSessions } from "../../lib/hooks/useChatSessions";
import { useChat } from "../../lib/hooks/useChat";
import ChatInterface from "../../components/chat/ChatInterface";
import ChatHeader from "../../components/chat/ChatHeader";
import MainLayout from "../../components/main-layout";
import ChatSidebar from "../../components/chat/ChatSidebar";
import { AVAILABLE_MODELS, ModelId } from "../../lib/types/chat";

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
  const [model, setModel] = useState<ModelId>("gpt-3.5-turbo");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // On mount, fetch sessions
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    if (!sessionsLoading && sessions.length > 0 && !activeSessionId) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions, sessionsLoading]);

  useEffect(() => {
    console.log("Active session id:", activeSessionId);
  }, [activeSessionId]);

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
    await fetchSessions(); // Refresh sessions after creating a new one
    setShowModal(false);
  };

  // Ensure activeSessionId is always valid (e.g., after deleting a session)
  useEffect(() => {
    if (!sessionsLoading && sessions.length > 0) {
      const found = sessions.find((s) => s.id === activeSessionId);
      if (!found) {
        setActiveSessionId(sessions[0].id);
      }
    }
    if (!sessionsLoading && sessions.length === 0) {
      setActiveSessionId(null);
    }
  }, [sessions, sessionsLoading]);

  // Keep model in sync with the current session
  useEffect(() => {
    const currentSession = sessions.find(s => s.id === activeSessionId);
    if (currentSession && AVAILABLE_MODELS.includes(currentSession.model as ModelId)) {
      setModel(currentSession.model as ModelId);
    }
  }, [activeSessionId, sessions]);

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
      <div className="relative w-full">
        <div className="flex flex-row h-[calc(100vh-4rem-6rem)] w-full bg-background rounded-xl shadow-lg overflow-hidden">
          {/* Sidebar (pushes chat area, not overlay) */}
          <div className={`transition-all duration-300 ${sidebarOpen ? "w-64" : "w-0"} overflow-hidden`}>
            <ChatSidebar
              sessions={sessions}
              activeSessionId={activeSessionId}
              setActiveSessionId={setActiveSessionId}
              loading={sessionsLoading}
              error={sessionsError}
              onNewChat={openNewChatModal}
              onDeleteSession={removeSession}
              layout="embedded"
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            />
          </div>
          {/* Main chat area */}
          <div className={`flex-1 flex flex-col items-center justify-center overflow-hidden transition-all duration-300 ${sidebarOpen ? "pl-6" : "pl-0"}`}>
            {/* Floating hamburger button when sidebar is closed */}
            {!sidebarOpen && (
              <button
                className="fixed top-[5.5rem] left-4 z-30 bg-circuits-dark-blue text-white rounded-full p-2 shadow-lg focus:outline-none"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
              >
                <span>&#9776;</span>
              </button>
            )}
            <div className="w-full max-w-2xl flex flex-col h-full">
              <ChatHeader
                totalTokens={totalTokens}
                totalCost={totalCost}
                session={session}
                setSessionModel={async (newModel) => {
                  setModel(newModel as ModelId);
                  if (activeSessionId) {
                    await setSessionModel(newModel as ModelId);
                  }
                }}
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
                      if (activeSessionId) {
                        await sendMessage({ message, session_id: activeSessionId, model });
                        fetchSession();
                      } else {
                        alert("No session selected. Please select or create a chat session.");
                      }
                    }}
                    activeSessionId={activeSessionId}
                    model={model}
                    fetchSession={fetchSession}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 