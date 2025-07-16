import React, { useState } from "react";

interface ChatSession {
  id: string;
  title: string;
  model: string;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  setActiveSessionId: (id: string) => void;
  loading: boolean;
  error: string | null;
  onNewChat: (title: string) => void;
  onDeleteSession: (id: string) => void;
  layout?: "embedded" | "overlay";
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

/**
 * ChatSidebar displays the list of chat sessions and controls for toggling/collapsing the sidebar.
 * Adds ARIA and keyboard accessibility for improved UX.
 */
const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  activeSessionId,
  setActiveSessionId,
  loading,
  error,
  onNewChat,
  onDeleteSession,
  layout = "overlay",
  setSidebarOpen,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sidebar width
  const sidebarWidth = collapsed ? "w-16" : "w-64";

  if (layout === "embedded") {
    return (
      <aside
        className={`h-full bg-[#18181b] border-r border-zinc-800 flex flex-col transition-all duration-300 font-sans ${sidebarWidth} ${collapsed ? "items-center" : ""} p-4`} style={{ minWidth: collapsed ? 64 : 256 }}>
        {/* Hamburger toggle button at the top of the sidebar */}
        <button
          className="bg-circuits-dark-blue text-white rounded-full p-2 shadow-lg focus:outline-none mb-4 flex items-center gap-2"
          onClick={() => setSidebarOpen && setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <span>&#9776;</span>
          <span className="text-sm font-semibold">Toggle</span>
        </button>
        {/* Collapse/Expand button (desktop only) */}
        <button
          className={`mt-2 mb-2 ml-2 text-zinc-400 hover:text-white hidden lg:block ${collapsed ? "" : "self-end mr-2"}`}
          onClick={() => setCollapsed((c) => !c)}
        >
          <span className="sr-only">{collapsed ? "Expand" : "Collapse"} sidebar</span>
          {collapsed ? ">" : "<"}
        </button>
        {/* New Chat */}
        <button
          className={`flex items-center gap-2 bg-circuits-dark-blue hover:bg-circuits-medium-blue text-white font-semibold rounded-lg px-4 py-2 mt-4 mb-6 border-2 border-circuits-dark-blue shadow transition ${collapsed ? "justify-center px-2" : "w-full"}`}
          onClick={() => onNewChat("New Chat")}
        >
          <span className="text-lg">＋</span>
          {!collapsed && <span>New chat</span>}
        </button>
        {/* Sessions List */}
        <div className={`flex-1 overflow-y-auto ${collapsed ? "px-1" : "px-2"} pb-2`}>
          {loading ? (
            <div className="text-zinc-400 text-center mt-8">Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center mt-8">{error}</div>
          ) : sessions.length === 0 ? (
            <div className="text-zinc-400 text-center mt-8">No chats</div>
          ) : (
            <ul className="space-y-2">
              {sessions.map((session) => (
                <li key={session.id} className={`group flex items-center rounded-md border transition ${session.id === activeSessionId ? "bg-circuits-dark-blue border-circuits-dark-blue" : "bg-zinc-800 border-transparent hover:border-circuits-dark-blue"}`}>
                  <button
                    className={`flex-1 text-left truncate px-3 py-2 rounded-md transition-colors font-sans ${
                      session.id === activeSessionId
                        ? "bg-circuits-dark-blue text-white"
                        : "text-zinc-200 hover:bg-circuits-medium-blue hover:text-white"
                    } ${collapsed ? "px-2" : ""}`}
                    onClick={() => setActiveSessionId(session.id)}
                  >
                    {collapsed ? session.title.charAt(0) : session.title}
                  </button>
                  {/* Delete button */}
                  {!collapsed && (
                    <button
                      className={`ml-2 rounded text-white ${session.id === activeSessionId ? "bg-circuits-dark-blue hover:bg-circuits-medium-blue" : "text-zinc-400 hover:text-red-500"} opacity-0 group-hover:opacity-100 transition`}
                      onClick={() => onDeleteSession(session.id)}
                      title="Delete session"
                    >
                      ×
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    );
  }

  // Overlay/mobile layout (default)
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden ${mobileOpen ? "block" : "hidden"}`}
        onClick={() => setMobileOpen(false)}
      ></div>
      {/* Sidebar */}
      <aside
        className={`fixed z-50 top-0 left-0 h-full bg-[#18181b] border-r border-zinc-800 flex flex-col transition-all duration-200 ${sidebarWidth} ${collapsed ? "items-center" : ""} ${mobileOpen ? "block" : "hidden"} lg:block`}
        style={{ minWidth: collapsed ? 64 : 256 }}
      >
        {/* Collapse/Expand button */}
        <button
          className="absolute top-4 right-4 lg:hidden text-zinc-400 hover:text-white"
          onClick={() => setMobileOpen(false)}
        >
          <span className="sr-only">Close sidebar</span>
          ×
        </button>
        <button
          className={`mt-4 mb-2 ml-4 text-zinc-400 hover:text-white hidden lg:block ${collapsed ? "" : "self-end mr-4"}`}
          onClick={() => setCollapsed((c) => !c)}
        >
          <span className="sr-only">{collapsed ? "Expand" : "Collapse"} sidebar</span>
          {collapsed ? ">" : "<"}
        </button>
        {/* New Chat */}
        <button
          className={`flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md px-4 py-2 mx-4 mt-8 mb-4 transition ${collapsed ? "justify-center px-2" : "w-full"}`}
          onClick={() => onNewChat("New Chat")}
        >
          <span className="text-lg">＋</span>
          {!collapsed && <span>New chat</span>}
        </button>
        {/* Sessions List */}
        <div className={`flex-1 overflow-y-auto ${collapsed ? "px-1" : "px-2"}`}>
          {loading ? (
            <div className="text-zinc-400 text-center mt-8">Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center mt-8">{error}</div>
          ) : sessions.length === 0 ? (
            <div className="text-zinc-400 text-center mt-8">No chats</div>
          ) : (
            <ul role="listbox" aria-label="Chat sessions">
              {sessions.map((session) => (
                <li
                  key={session.id}
                  role="option"
                  aria-selected={activeSessionId === session.id}
                  tabIndex={0}
                  onKeyDown={(e) => { if ((e.key === "Enter" || e.key === " ") && setActiveSessionId) setActiveSessionId(session.id); }}
                  className="group flex items-center"
                >
                  <button
                    className={`flex-1 text-left truncate px-3 py-2 rounded-md transition-colors ${
                      session.id === activeSessionId
                        ? "bg-zinc-700 text-white"
                        : "text-zinc-200 hover:bg-zinc-800 hover:text-white"
                    } ${collapsed ? "px-2" : ""}`}
                    onClick={() => setActiveSessionId(session.id)}
                  >
                    {collapsed ? session.title.charAt(0) : session.title}
                  </button>
                  {/* Delete button */}
                  {!collapsed && (
                    <button
                      className="ml-2 text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                      onClick={() => onDeleteSession(session.id)}
                      title="Delete session"
                    >
                      ×
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
      {/* Mobile open button */}
      <button
        className="fixed top-4 left-4 z-50 bg-zinc-800 text-zinc-200 rounded-md p-2 shadow-lg lg:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        ☰
      </button>
    </>
  );
};

export default ChatSidebar;