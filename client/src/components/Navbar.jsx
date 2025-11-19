import React from "react";

const Navbar = ({ onLogout }) => {
  return (
    <nav className="glass flex justify-between items-center px-8 py-4 m-4 rounded-xl shadow-lg">
      <h1 className="text-2xl font-semibold text-white drop-shadow-md">
        🧸 Kindergarten Portal
      </h1>
      <button
        onClick={onLogout}
        className="bg-white/20 hover:bg-white/30 text-white px-5 py-2 rounded-lg transition-all duration-300"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;
