import React from "react";

const Navbar = ({ onLogout }) => {
  return (
    <nav className="glass flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-white shadow-2xl shadow-indigo-900/40 backdrop-blur-2xl">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-white/70">Kindergarten Portal</p>
        <h1 className="text-2xl font-semibold leading-tight">WhatsApp Automation Suite</h1>
      </div>
      <button
        onClick={onLogout}
        className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-400 via-sky-400 to-cyan-300 px-6 py-2 text-sm font-semibold uppercase tracking-wide text-slate-900 transition hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <span className="relative z-10 flex items-center gap-2">
          <span className="text-lg">↪</span> Logout
        </span>
        <span className="absolute inset-0 translate-y-full bg-white/30 transition group-hover:translate-y-0" />
      </button>
    </nav>
  );
};

export default Navbar;
