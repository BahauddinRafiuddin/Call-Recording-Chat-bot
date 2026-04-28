import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

const ChatMessages = ({ messages }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4 bg-gray-50">
      {messages.map((msg, i) => (
        <MessageItem key={i} msg={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

const MessageItem = ({ msg }) => {
  const [showSources, setShowSources] = useState(false);

  // LOADER
  if (msg.isLoading) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-semibold text-white shrink-0">
          AI
        </div>
        <div className="bg-white border border-gray-200 px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm text-gray-500 flex items-center gap-2.5 shadow-sm">
          <span className="w-3.5 h-3.5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          Generating response...
        </div>
      </div>
    );
  }

  //  MULTI-CALL
  if (msg.type === "multi_call") {
    return (
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-semibold text-white shrink-0 mt-0.5">
          AI
        </div>
        <div className="flex-1 max-w-[80%] bg-white border border-gray-200 rounded-2xl rounded-tl-sm shadow-sm overflow-hidden">
          {/* Multi-call header */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-slate-800">
            <svg className="w-3.5 h-3.5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 01-2.18 2A19.86 19.86 0 013.1 4.18 2 2 0 015.09 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.81a2 2 0 01-.45 2.11L9.09 9.91a16 16 0 006.99 7l1.27-1.27a2 2 0 012.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0122 16.92z" />
            </svg>
            <span className="text-xs font-medium text-slate-300 uppercase tracking-wider">
              {msg.results.length} Call{msg.results.length !== 1 ? "s" : ""} Analyzed
            </span>
          </div>
          {/* Cards */}
          <div className="p-3 flex flex-col gap-2.5">
            {msg.results.map((item, index) => (
              <MultiCallBlock key={index} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // NORMAL (SINGLE CALL + USER)
  return (
    <div className={`flex items-end gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-semibold shrink-0
        ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-slate-800 text-white"}`}>
        {msg.role === "user" ? "U" : "AI"}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed shadow-sm
        ${msg.role === "user"
          ? "bg-blue-500 text-white rounded-2xl rounded-br-sm"
          : "bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-sm"
        }`}>
        {msg.role === "user" ? (
          <p className="m-0">{msg.text}</p>
        ) : (
          <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:my-1">
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        )}

        {/*  SINGLE CALL SOURCES */}
        {msg.role === "ai" && msg.sources?.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-gray-100">
            <button
              onClick={() => setShowSources((prev) => !prev)}
              className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-700 transition-colors"
            >
              <svg
                className={`w-2.5 h-2.5 transition-transform ${showSources ? "rotate-180" : ""}`}
                viewBox="0 0 10 10" fill="currentColor"
              >
                <path d="M5 7L1 3h8z" />
              </svg>
              {showSources ? "Hide sources" : "View sources"}
            </button>
            {showSources && (
              <div className="mt-2 flex flex-col gap-1.5">
                {msg.sources.map((src, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1" />
                    {src}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// MULTI CALL BLOCK (PER CALL UI)
const MultiCallBlock = ({ item, index }) => {
  const [showSources, setShowSources] = useState(false);

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-gray-50 border-b border-gray-100">
        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
          <svg className="w-3 h-3 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 01-2.18 2A19.86 19.86 0 013.1 4.18 2 2 0 015.09 2h3a2 2 0 012 1.72c.13.96.37 1.9.72 2.81a2 2 0 01-.45 2.11L9.09 9.91a16 16 0 006.99 7l1.27-1.27a2 2 0 012.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0122 16.92z" />
          </svg>
        </div>
        <span className="text-xs font-semibold text-gray-700 tracking-wide">
          {item.fileName || `Call ${index + 1}`}
        </span>
      </div>

      {/* Body */}
      <div className="px-3.5 py-3">
        <div className="prose prose-sm max-w-none text-gray-700 prose-p:my-0.5 prose-strong:text-gray-900">
          <ReactMarkdown>{item.answer}</ReactMarkdown>
        </div>

        {item.sources?.length > 0 && (
          <div className="mt-2.5">
            <button
              onClick={() => setShowSources((p) => !p)}
              className="flex items-center gap-1.5 text-xs text-blue-500 hover:text-blue-700 transition-colors bg-transparent border-none p-0 cursor-pointer"
            >
              <svg
                className={`w-2.5 h-2.5 transition-transform ${showSources ? "rotate-180" : ""}`}
                viewBox="0 0 10 10" fill="currentColor"
              >
                <path d="M5 7L1 3h8z" />
              </svg>
              {showSources ? "Hide sources" : "View sources"}
            </button>

            {showSources && (
              <div className="mt-2 flex flex-col gap-1.5">
                {item.sources.map((src, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1" />
                    {src.slice(0, 120)}...
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessages;