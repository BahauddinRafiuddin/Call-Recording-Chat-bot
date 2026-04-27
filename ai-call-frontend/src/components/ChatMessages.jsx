import { useEffect, useRef, useState } from "react";

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
    <div
      className={`flex items-end gap-2 ${
        msg.role === "user" ? "flex-row-reverse" : ""
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0
        ${
          msg.role === "user"
            ? "bg-blue-500 text-white"
            : "bg-slate-800 text-white"
        }`}
      >
        {msg.role === "user" ? "U" : "AI"}
      </div>

      {/* Message Bubble */}
      <div
        className={`max-w-[72%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
        ${
          msg.role === "user"
            ? "bg-blue-500 text-white rounded-br-sm"
            : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm"
        }`}
      >
        {msg.text}

        {/* 🔥 SOURCE TOGGLE (ONLY FOR AI MESSAGES) */}
        {msg.role === "ai" && msg.sources?.length > 0 && (
          <div className="mt-2">
            <button
              onClick={() => setShowSources((prev) => !prev)}
              className="text-xs text-blue-600 hover:underline mt-1 cursor-pointer"
            >
              {showSources ? "Hide Sources ▲" : "View Sources ▼"}
            </button>

            {/* 🔥 SOURCE LIST */}
            {showSources && (
              <div className="mt-2 bg-gray-50 border border-gray-200 rounded-md p-2 text-xs text-gray-700 space-y-1">
                {msg.sources.map((src, idx) => (
                  <p key={idx}>• {src}</p>
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
