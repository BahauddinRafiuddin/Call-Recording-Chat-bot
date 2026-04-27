import { useCalls } from "../context/CallsContext";

const dotStyle = {
  completed: "bg-emerald-400",
  processing: "bg-amber-400 animate-pulse",
  failed: "bg-red-400",
};

const ChatHeader = ({ selected, onSelect }) => {
  const { calls } = useCalls();

  return (
    <div className="px-4 py-3 border-b bg-white flex flex-wrap gap-2 items-center">
      <span className="text-xs text-gray-400 mr-1">Scope:</span>

      <button
        onClick={() => onSelect("")}
        className={`px-3 py-1.5 rounded-full text-xs border transition-all cursor-pointer
          ${selected === ""
            ? "border-blue-500 bg-blue-50 text-blue-600"
            : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:text-gray-700"
          }`}
      >
        All calls
      </button>

      {calls.map((call) => (
        <button
          key={call._id}
          onClick={() => call.status === "completed" && onSelect(call._id)}
          disabled={call.status !== "completed"}
          title={
            call.status === "processing"
              ? "Still processing…"
              : call.status === "failed"
              ? "Transcription failed"
              : call.fileName
          }
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all
            ${call.status !== "completed"
              ? "opacity-50 cursor-not-allowed border-gray-200 bg-gray-50 text-gray-400"
              : selected === call._id
                ? "cursor-pointer border-blue-500 bg-blue-50 text-blue-600"
                : "cursor-pointer border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyle[call.status] ?? "bg-gray-400"}`} />
          <span className="truncate max-w-30">{call.fileName}</span>
        </button>
      ))}
    </div>
  );
};

export default ChatHeader;