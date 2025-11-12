import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import "../styles.css";

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  // --------------------------------------------------
  // FUNCTION: SEND DAILY REPORTS
  // --------------------------------------------------
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

  // --------------------------------------------------
  // FUNCTION: SEND WEEKLY MENU
  // --------------------------------------------------
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

    eventSource.onerror = (err) => {
      console.error("❌ SSE error:", err);
      setLogs((prev) => [...prev, "❌ Connection error."]);
      setIsSending(false);
      eventSource.close();
    };
  };

  // --------------------------------------------------
  // FUNCTION: CLEAR LOGS
  // --------------------------------------------------
  const clearLogs = () => {
    setLogs([]);
  };

  // --------------------------------------------------
  // FUNCTION: LOGOUT
  // --------------------------------------------------
  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/");
  };

  // --------------------------------------------------
  // RENDER DASHBOARD
  // --------------------------------------------------
  return (
    <div className="dashboard-container">
      <Navbar onLogout={handleLogout} />
      <div className="dashboard-content">
        <h2>🎓 Kindergarten Teacher Dashboard</h2>
        <p>Click below to send WhatsApp updates to parents.</p>

        <div className="button-section">
          <button
            className="send-btn"
            onClick={sendMessages}
            disabled={isSending}
          >
            {isSending ? "📨 Sending Daily Reports..." : "🚀 Send Daily Reports"}
          </button>

          <button
            className="send-btn"
            onClick={sendWeeklyMenu}
            disabled={isSending}
          >
            {isSending ? "🍱 Sending Weekly Menu..." : "📆 Send Weekly Menu"}
          </button>

          <button className="clear-btn" onClick={clearLogs}>
            🧹 Clear Logs
          </button>
        </div>

        <div className="log-box">
          {logs.length === 0 ? (
            <p className="muted">🕒 No logs yet. Click a button to start.</p>
          ) : (
            logs.map((log, i) => {
              let colorClass = "";
              if (log.includes("✅")) colorClass = "green";
              else if (log.includes("⚠️")) colorClass = "yellow";
              else if (log.includes("❌")) colorClass = "red";
              return (
                <p key={i} className={colorClass}>
                  {log}
                </p>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
