import { useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";

const ChatWorkspace = ({ onMenuClick }) => {
  const [selectedCallId, setSelectedCallId] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! Ask me anything about your call recordings. Select a specific call above or query across all of them.",
    },
  ]);

  const handleNewMessage = (msg) => {
    setMessages((prev) => {
      if (msg.replaceLast) {
        return [...prev.slice(0, -1), msg];
      }
      return [...prev, msg];
    });
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-gray-50 overflow-hidden">
      {/* Mobile topbar with hamburger */}
      <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <span className="text-sm font-medium text-gray-700">
          AI Call Assistant
        </span>
      </div>

      <ChatHeader selected={selectedCallId} onSelect={setSelectedCallId} />
      <ChatMessages messages={messages} />
      <ChatInput callId={selectedCallId} onNewMessage={handleNewMessage} />
    </div>
  );
};

export default ChatWorkspace;
