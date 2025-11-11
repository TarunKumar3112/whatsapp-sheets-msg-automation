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

    eventSource.onerror = (err) => {
      console.error("❌ SSE error:", err);
      setLogs((prev) => [...prev, "❌ Connection error."]);
      setIsSending(false);
      eventSource.close();
    };
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <Navbar onLogout={handleLogout} />
      <div className="dashboard-content">
        <h2>🎓 Kindergarten Teacher Dashboard</h2>
        <p>Click below to send WhatsApp updates to parents.</p>

        <button className="send-btn" onClick={sendMessages} disabled={isSending}>
          {isSending ? "📨 Sending..." : "🚀 Send Messages"}
        </button>

        <div className="log-box">
          {logs.length === 0 ? (
            <p className="muted">🕒 No logs yet. Click “Send Messages” to start.</p>
          ) : (
            logs.map((log, i) => <p key={i}>{log}</p>)
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
