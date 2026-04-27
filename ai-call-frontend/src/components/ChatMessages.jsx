import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

const ChatMessages = ({ messages }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3">
      {messages.map((msg, i) => (
        <MessageItem key={i} msg={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

const MessageItem = ({ msg }) => {
  const [showSources, setShowSources] = useState(false);

  return (
    <div className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>

      {/* Avatar */}
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0
        ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-slate-800 text-white"}`}>
        {msg.role === "user" ? "U" : "AI"}
      </div>

      {/* Bubble */}
      <div className={`max-w-[72%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
        ${msg.role === "user"
          ? "bg-blue-500 text-white rounded-br-sm"
          : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm"
        }`}>

        {msg.role === "user" ? (
          // User messages — plain text, no markdown needed
          <p>{msg.text}</p>
        ) : (
          // AI messages — full markdown rendering
          <div className="prose prose-sm max-w-none
            prose-p:my-1 prose-p:leading-relaxed
            prose-strong:font-semibold prose-strong:text-gray-900
            prose-ol:my-1.5 prose-ol:pl-4 prose-ol:space-y-1
            prose-ul:my-1.5 prose-ul:pl-4 prose-ul:space-y-1
            prose-li:my-0 prose-li:leading-relaxed
            prose-headings:font-semibold prose-headings:text-gray-900
            prose-h1:text-base prose-h2:text-sm prose-h3:text-sm
            prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
            prose-blockquote:border-l-2 prose-blockquote:border-gray-300 prose-blockquote:pl-3 prose-blockquote:text-gray-600
          ">
            <ReactMarkdown>{msg.text}</ReactMarkdown>
          </div>
        )}

        {/* Sources toggle */}
        {msg.role === "ai" && msg.sources?.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-100">
            <button
              onClick={() => setShowSources((prev) => !prev)}
              className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 cursor-pointer transition-colors"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7"/>
              </svg>
              {showSources ? "Hide sources ▲" : "View sources ▼"}
            </button>

            {showSources && (
              <div className="mt-2 flex flex-col gap-1">
                {msg.sources.map((src, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5">
                    <span className="text-gray-400 mt-0.5">•</span>
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

export default ChatMessages;