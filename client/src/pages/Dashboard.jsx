import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  const sendMessages = () => {
    setLogs([]);
    setIsSending(true);
    const eventSource = new EventSource("http://localhost:3000/send");

    eventSource.onmessage = (event) => {
      if (event.data === "[DONE]") {
        eventSource.close();
        setIsSending(false);
        return;
      }
      setLogs((prev) => [...prev, event.data]);
    };

    eventSource.onerror = () => {
      setLogs((prev) => [...prev, "❌ Connection error."]);
      setIsSending(false);
      eventSource.close();
    };
  };

  const sendWeeklyMenu = () => {
    setLogs([]);
    setIsSending(true);
    const eventSource = new EventSource("http://localhost:3000/send-menu");

    eventSource.onmessage = (event) => {
      if (event.data === "[DONE]") {
        eventSource.close();
        setIsSending(false);
        return;
      }
      setLogs((prev) => [...prev, event.data]);
    };

    eventSource.onerror = () => {
      setLogs((prev) => [...prev, "❌ Connection error."]);
      setIsSending(false);
      eventSource.close();
    };
  };

  const clearLogs = () => setLogs([]);
  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400 text-white">
      <Navbar onLogout={handleLogout} />
      <div className="p-10 flex flex-col items-center">
        <div className="glass p-8 w-full max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-4">🎓 Teacher Dashboard</h2>
          <p className="text-white/90 mb-8">
            Send daily and weekly WhatsApp updates to parents.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              className="bg-white/30 hover:bg-white/50 px-6 py-3 rounded-lg font-semibold transition-all"
              onClick={sendMessages}
              disabled={isSending}
            >
              {isSending ? "📨 Sending Daily Reports..." : "🚀 Send Daily Reports"}
            </button>

            <button
              className="bg-white/30 hover:bg-white/50 px-6 py-3 rounded-lg font-semibold transition-all"
              onClick={sendWeeklyMenu}
              disabled={isSending}
            >
              {isSending ? "🍱 Sending Weekly Menu..." : "📆 Send Weekly Menu"}
            </button>

            <button
              className="bg-white/20 hover:bg-white/40 px-6 py-3 rounded-lg transition-all"
              onClick={clearLogs}
            >
              🧹 Clear Logs
            </button>
          </div>

          <div className="glass p-4 max-h-60 overflow-y-auto text-left">
            {logs.length === 0 ? (
              <p className="text-white/70">🕒 No logs yet. Click a button to start.</p>
            ) : (
              logs.map((log, i) => (
                <p key={i} className="whitespace-pre-line">
                  {log}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
