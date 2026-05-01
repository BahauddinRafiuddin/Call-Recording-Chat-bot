import { useState } from "react";
import { askQuestion } from "../api/chat.api";

const ChatBox = ({ callId }) => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);

  const handleAsk = async () => {
    const res = await askQuestion({
      question,
      callId,
    });

    setMessages([
      ...messages,
      { role: "user", text: question },
      { role: "ai", text: res.data.answer },
    ]);

    setQuestion("");
  };

  return (
    <div>
      <div className="mb-4">
        {messages.map((msg, i) => (
          <div key={i}>
            <strong>{msg.role}:</strong>{msg.text}
          </div>
        ))}
      </div>

      <input
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="border p-2 w-full"
      />

      <button
        onClick={handleAsk}
        className="mt-2 bg-blue-500 text-white px-4 py-1"
      >
        Ask
      </button>
    </div>
  );
};

export default ChatBox;