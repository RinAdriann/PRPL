import React, { useState } from "react";
import { useAuth } from "@/state/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("teacher@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await login(email, password);
    if (!ok) setError("Access Denied");
    else navigate("/educator/dashboard");
  }

  return (
    <div className="container" style={{ maxWidth: 420, margin: "0 auto" }}>
      <h2>Educator Login</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
        <button className="btn" type="submit">Login</button>
        {error && <div style={{ color: "tomato" }}>{error}</div>}
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: 12, borderRadius: 8, border: "2px solid #cfd8dc", fontSize: 16, outline: "none"
};
