import { useEffect, useRef } from "react";

const ChatMessages = ({ messages }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
        >
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0
            ${msg.role === "user" ? "bg-blue-500 text-white" : "bg-slate-800 text-white"}`}>
            {msg.role === "user" ? "U" : "AI"}
          </div>

          <div className={`max-w-[72%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed
            ${msg.role === "user"
              ? "bg-blue-500 text-white rounded-br-sm"
              : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm"
            }`}>
            {msg.text}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;