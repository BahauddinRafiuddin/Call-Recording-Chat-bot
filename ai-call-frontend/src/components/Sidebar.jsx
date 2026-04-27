import Upload from "./Upload";
import CallList from "./CallList";

const Sidebar = ({ onClose }) => (
  <div className="w-64 h-full bg-[#0F172A] text-white flex flex-col shrink-0">
    <div className="px-4 py-4 border-b border-white/8 flex items-center gap-2.5">
      <div className="w-7 h-7 bg-blue-500 rounded-md flex items-center justify-center shrink-0">
        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 010 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
        </svg>
      </div>
      <span className="text-sm font-medium flex-1">AI Call Assistant</span>

      {/* Close button — mobile only */}
      <button
        onClick={onClose}
        className="md:hidden p-1 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
      >
        <svg className="w-5 h-5 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <div className="p-4 flex flex-col gap-5 flex-1 overflow-y-auto">
      <div>
        <p className="text-[10px] font-medium text-white/30 uppercase tracking-wider mb-2">
          Upload call
        </p>
        <Upload />
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        <p className="text-[10px] font-medium text-white/30 uppercase tracking-wider mb-2">
          Recent calls
        </p>
        <div className="flex-1 overflow-y-auto">
          <CallList />
        </div>
      </div>
    </div>
  </div>
);

export default Sidebar;