import { useCalls } from "../context/CallsContext";
import { deleteCall } from "../api/calls.api";

const statusStyle = {
  completed: "text-emerald-400",
  processing: "text-amber-400",
  failed: "text-red-400",
};

const dotStyle = {
  completed: "bg-emerald-400",
  processing: "bg-amber-400 animate-pulse",
  failed: "bg-red-400",
};

const CallList = () => {
  const { calls, fetchCalls } = useCalls();

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    await deleteCall(id);
    fetchCalls();
  };

  if (!calls.length) return (
    <div className="flex flex-col items-center justify-center py-8 gap-2 opacity-40">
      <svg className="w-8 h-8 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 010 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
      </svg>
      <p className="text-xs text-white/30">No calls yet</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-1">
      {calls.map((call) => (
        <div
          key={call._id}
          className="group flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
        >
          <div className="w-7 h-7 rounded-md bg-white/5 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 010 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
            </svg>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs text-white/80 truncate">{call.fileName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyle[call.status] ?? "bg-gray-400"}`} />
              <span className={`text-[10px] ${statusStyle[call.status] ?? "text-gray-400"}`}>
                {call.status}
              </span>
            </div>
          </div>

          <button
            onClick={(e) => handleDelete(call._id, e)}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md cursor-pointer hover:bg-red-400/15 transition-all"
          >
            <svg className="w-3.5 h-3.5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default CallList;