import { useState } from "react";
import { askQuestion } from "../api/chat.api";
import { useCalls } from "../context/CallsContext";

const ChatInput = ({ callId, onNewMessage }) => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const { calls } = useCalls();

  const handleAsk = async () => {
    if (!question.trim() || loading) return;

    let hasProcessing = calls.some((c) => c.status === "processing");

    //  No calls uploaded
    if (!calls.length) {
      onNewMessage({
        role: "ai",
        text: "📂 No calls found. Please upload an audio file first, then ask your question.",
      });
      setQuestion("");
      return;
    }

    // CASE 1: One calls selected
    if (callId) {
      const selectedCall = calls.find((c) => c._id === callId);

      if (selectedCall?.status === "processing") {
        onNewMessage({
          role: "ai",
          text: "⏳ This call is still being processed. Please wait until it’s completed.",
        });
        setQuestion("");
        return;
      }
    }

    //  CASE 2: All calls selected
    if (!callId) {
      const hasProcessing = calls.some((c) => c.status === "processing");
      const processingCount = calls.filter(
        (c) => c.status === "processing",
      ).length;
      if (hasProcessing) {
        onNewMessage({
          role: "ai",
          text: `⏳ ${processingCount} calls are still processing. Please wait until all are ready to get accurate answers.`,
        });
        setQuestion("");
        return;
      }
    }

    const userMsg = { role: "user", text: question };
    onNewMessage(userMsg);
    setQuestion("");
    setLoading(true);
    const loadingMsg = {
      role: "ai",
      text: "⏳ Generating response...",
      isLoading: true,
    };
    onNewMessage(loadingMsg);
    try {
      const res = await askQuestion({
        question,
        callId: callId || undefined,
      });

      const data = res.data;

      if (data.type === "multi_call") {
        onNewMessage({
          role: "ai",
          type: "multi_call",
          results: data.results, // 👈 full structured data
          replaceLast: true,
        });
      } else {
        onNewMessage({
          role: "ai",
          text: data.answer || "⚠️ No answer found in transcript.",
          replaceLast: true,
          sources: data.sources || [],
        });
      }
    } catch {
      onNewMessage({
        role: "ai",
        text: "❌ Oops! Something went wrong. Please try again.",
        replaceLast: true,
      });
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
          <svg
            className="w-4 h-4 text-white ml-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        )}
      </button>
    </div>
  );
};
export default ChatInput;
