import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "teacher" && password === "1234") {
      localStorage.setItem("loggedIn", "true");
      navigate("/dashboard");
    } else {
      setError("❌ Invalid username or password!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-400 to-indigo-600">
      <div className="glass p-10 w-96 text-center">
        <h2 className="text-2xl font-semibold mb-6">🧑‍🏫 Teacher Login</h2>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-white/30 hover:bg-white/50 text-white font-semibold py-2 rounded-lg transition-all duration-300"
        >
          Login
        </button>

        {error && <p className="mt-4 text-red-300">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
