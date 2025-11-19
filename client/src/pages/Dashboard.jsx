import React, { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const navigate = useNavigate();
  const eventSourceRef = useRef(null);

  const closeStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsSending(false);
    setActiveAction(null);
  };

  const startStream = (endpoint, actionLabel) => {
    if (isSending) {
      closeStream();
    }
    setLogs([]);
    setIsSending(true);
    setActiveAction(actionLabel);

    const streamUrl = `${API_BASE_URL}${endpoint}`;
    const eventSource = new EventSource(streamUrl);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      if (event.data === "[DONE]") {
        closeStream();
        return;
      }
      setLogs((prev) => [...prev, event.data]);
    };

    eventSource.onerror = () => {
      setLogs((prev) => [...prev, "❌ Connection error. Please retry."]);
      closeStream();
    };
  };

  const sendMessages = () => startStream("/send", "Daily Reports");
  const sendWeeklyMenu = () => startStream("/send-menu", "Weekly Menu");

  const clearLogs = () => setLogs([]);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    closeStream();
    navigate("/");
  };

  useEffect(() => () => closeStream(), []);

  const successCount = useMemo(
    () => logs.filter((log) => log.trim().startsWith("✅")).length,
    [logs]
  );
  const warningCount = useMemo(
    () => logs.filter((log) => log.includes("⚠️") || log.includes("❌")).length,
    [logs]
  );

  const summaryCards = [
    {
      title: "Successful events",
      value: successCount,
      subtitle: "Confirmed WhatsApp deliveries",
      accent: "from-emerald-400/80 to-emerald-500/40",
    },
    {
      title: "Warnings & skips",
      value: warningCount,
      subtitle: "Rows needing attention",
      accent: "from-amber-400/80 to-amber-500/30",
    },
    {
      title: "Current action",
      value: activeAction ? `${activeAction}` : "Idle",
      subtitle: isSending ? "Streaming live updates" : "Awaiting instruction",
      accent: "from-sky-400/70 to-indigo-500/30",
    },
  ];

  const highlights = [
    {
      title: "Realtime delivery log",
      body: "Watch every WhatsApp message reported back as it happens, complete with success or warning indicators.",
    },
    {
      title: "Quick weekly blasts",
      body: "Send menu reminders to every parent with a single button press. Parents receive rich, formatted messages.",
    },
    {
      title: "SSE powered",
      body: "Server-sent events keep the dashboard up to date without manual refreshes or guesswork.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pb-16 text-white">
      <div className="gradient-blob" />
      <div className="grid-pattern" />
      <Navbar onLogout={handleLogout} />

      <div className="mx-auto mt-6 max-w-6xl space-y-10 px-4">
        <header className="glass relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10 shadow-2xl">
          <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-sky-500/30 to-transparent md:block" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.5em] text-white/60">Command center</p>
              <h2 className="text-4xl font-semibold leading-tight">
                Dispatch daily stories & weekly menus without leaving this tab
              </h2>
              <p className="text-white/70">
                Every interaction with parents is logged live below. Trigger the automation you need and
                watch the delivery stream unfold.
              </p>
            </div>
            <div className="grid gap-3 text-sm text-white/70 md:text-right">
              <p className="font-semibold text-white">Status</p>
              <p className="text-lg">
                {isSending ? `Processing ${activeAction?.toLowerCase()}` : "Standing by"}
              </p>
              <p>API base: {API_BASE_URL}</p>
            </div>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          {summaryCards.map((card) => (
            <div
              key={card.title}
              className={`glass rounded-2xl border border-white/10 bg-gradient-to-br ${card.accent} p-6 shadow-xl`}
            >
              <p className="text-sm uppercase tracking-[0.4em] text-white/60">{card.title}</p>
              <p className="mt-4 text-3xl font-semibold">{card.value}</p>
              <p className="mt-2 text-sm text-white/70">{card.subtitle}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="glass col-span-2 rounded-3xl border border-white/10 bg-slate-900/40 p-8">
            <h3 className="text-2xl font-semibold">Automation controls</h3>
            <p className="mt-2 text-white/70">Choose an action and observe the output in real time.</p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <button
                onClick={sendMessages}
                disabled={isSending}
                className="btn-modern"
              >
                {isSending && activeAction === "Daily Reports" ? "Streaming daily report..." : "Send daily reports"}
              </button>
              <button
                onClick={sendWeeklyMenu}
                disabled={isSending}
                className="btn-modern"
              >
                {isSending && activeAction === "Weekly Menu" ? "Streaming weekly menu..." : "Send weekly menu"}
              </button>
              <button onClick={clearLogs} className="btn-ghost">
                Clear log feed
              </button>
              <button onClick={closeStream} className="btn-ghost">
                Stop current stream
              </button>
            </div>

            <div className="mt-10 space-y-4">
              <h4 className="text-lg font-semibold">Live delivery feed</h4>
              <div className="max-h-64 overflow-y-auto rounded-2xl border border-white/10 bg-black/30 p-4 text-sm">
                {logs.length === 0 ? (
                  <p className="text-white/60">🕒 Awaiting activity. Trigger an automation to see logs.</p>
                ) : (
                  <ol className="space-y-3">
                    {logs.map((log, index) => (
                      <li key={`${log}-${index}`} className="flex gap-3 text-white/80">
                        <span className="text-white/40">{String(index + 1).padStart(2, "0")}</span>
                        <p className="whitespace-pre-line">{log}</p>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </div>

          <div className="glass rounded-3xl border border-white/10 bg-white/5 p-8">
            <h3 className="text-2xl font-semibold">Why teachers love it</h3>
            <div className="mt-6 space-y-6 text-sm text-white/70">
              {highlights.map((item) => (
                <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-base font-semibold text-white">{item.title}</p>
                  <p className="mt-2 leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
