import { useState } from "react";
import { askQuestion } from "../api/chat.api";

const ChatInput = ({ callId, onNewMessage }) => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim() || loading) return;

    const userMsg = { role: "user", text: question };
    onNewMessage(userMsg);
    setQuestion("");
    setLoading(true);

    try {
      const res = await askQuestion({ question, callId: callId || undefined });
      onNewMessage({ role: "ai", text: res.data.answer });
    } catch {
      onNewMessage({ role: "ai", text: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="px-4 py-3 border-t bg-white flex items-center gap-3">
      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        placeholder="Ask something about your calls…"
        className="flex-1 border border-gray-200 bg-gray-50 text-gray-800 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-400 focus:bg-white disabled:opacity-50 transition-all placeholder:text-gray-400"
      />
      <button
        onClick={handleAsk}
        disabled={loading || !question.trim()}
        className="w-9 h-9 rounded-full bg-blue-500 hover:bg-blue-600 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer transition-all shrink-0"
      >
        {loading ? (
          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="w-4 h-4 text-white ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        )}
      </button>
    </div>
  );
};

export default ChatInput;