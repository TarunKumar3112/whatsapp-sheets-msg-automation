import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setError("");
    setIsSubmitting(true);

    setTimeout(() => {
      if (username === "teacher" && password === "1234") {
        localStorage.setItem("loggedIn", "true");
        navigate("/dashboard");
      } else {
        setError("Invalid username or password. Hint: teacher / 1234");
      }
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6 py-12 text-white">
      <div className="gradient-blob" />
      <div className="grid-pattern" />
      <div className="glass flex w-full max-w-5xl flex-col gap-10 rounded-3xl border border-white/10 bg-white/5 p-8 md:flex-row md:p-12">
        <section className="flex-1 space-y-6">
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">Welcome back</p>
          <h2 className="text-4xl font-semibold leading-tight md:text-5xl">
            Send delightful WhatsApp updates with <span className="text-sky-300">one click</span>
          </h2>
          <p className="text-white/70">
            Teachers log in once and immediately gain access to real-time dashboards, delivery
            logs, and a polished experience parents will love.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-white/75">
            {["Secure access", "Realtime logs", "AI-crafted templates"].map((item) => (
              <span key={item} className="rounded-full border border-white/20 px-4 py-2">
                {item}
              </span>
            ))}
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
            <p className="font-semibold text-white">Demo credentials</p>
            <p>Username: teacher</p>
            <p>Password: 1234</p>
          </div>
        </section>

        <section className="flex-1 rounded-2xl border border-white/10 bg-slate-900/40 p-8 shadow-2xl shadow-indigo-900/50">
          <h3 className="text-2xl font-semibold">Teacher Login</h3>
          <p className="mt-2 text-sm text-white/70">Sign in to dispatch daily reports and weekly menus.</p>
          <div className="mt-8 space-y-5">
            <label className="block text-sm text-white/70">
              Username
              <input
                type="text"
                placeholder="teacher"
                className="mt-2 w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-sky-300 focus:outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
            <label className="block text-sm text-white/70">
              Password
              <input
                type="password"
                placeholder="1234"
                className="mt-2 w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/50 focus:border-sky-300 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button
              onClick={handleLogin}
              disabled={isSubmitting}
              className="btn-modern w-full justify-center"
            >
              {isSubmitting ? "Authenticating..." : "Enter dashboard"}
            </button>
          </div>
          {error && <p className="mt-6 text-sm text-rose-300">{error}</p>}
        </section>
      </div>
    </div>
  );
};

export default Login;
