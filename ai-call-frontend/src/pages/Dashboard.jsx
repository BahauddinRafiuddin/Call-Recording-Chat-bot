import { useState } from "react";
import { CallsProvider } from "../context/CallsContext";
import ChatWorkspace from "../components/ChatWorkspace";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <CallsProvider>
      <div className="flex h-screen bg-gray-100 overflow-hidden relative">

        {/* Mobile overlay — tap outside to close */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed inset-y-0 left-0 z-30 md:static md:z-auto
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}>
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Main */}
        <ChatWorkspace onMenuClick={() => setSidebarOpen(true)} />

      </div>
    </CallsProvider>
  );
};

export default Dashboard;