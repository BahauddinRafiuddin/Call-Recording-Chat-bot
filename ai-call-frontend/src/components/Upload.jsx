import { useState, useRef } from "react";
import { uploadCall } from "../api/calls.api";
import { useCalls } from "../context/CallsContext";

const Upload = () => {
  const { fetchCalls } = useCalls();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  const handleUpload = async () => {
    if (!file || loading) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      await uploadCall(formData);
      setFile(null);
      fetchCalls();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const dropped = e.dataTransfer.files[0];
          if (dropped) setFile(dropped);
        }}
        className={`border border-dashed rounded-lg p-4 text-center cursor-pointer transition-all
          ${dragging
            ? "border-indigo-400 bg-indigo-500/10"
            : "border-white/15 hover:border-white/30 hover:bg-white/5"
          }`}
      >
        <svg className="w-5 h-5 mx-auto mb-1.5 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
          <polyline points="17 8 12 3 7 8"/>
          <line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
        {file ? (
          <p className="text-xs text-indigo-300 truncate px-2">{file.name}</p>
        ) : (
          <>
            <p className="text-xs text-white/40">Drop audio file or click to browse</p>
            <p className="text-[10px] text-white/20 mt-0.5">.mp3 · .wav · .m4a</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      {file && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium py-2 rounded-lg cursor-pointer transition-all"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Uploading…
            </span>
          ) : (
            "Upload recording"
          )}
        </button>
      )}
    </div>
  );
};

export default Upload;