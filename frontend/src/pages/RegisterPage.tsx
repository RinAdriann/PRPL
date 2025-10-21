import React, { useState } from "react";
import api from "@/services/api";
import { useAuth } from "@/state/AuthContext";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post("/educator/register", { name, email, password });
      // after register, immediately log in client-side using returned token via login flow
      // simpler: just stash token via login helper by calling backend /login
      if (res.data?.token) {
        // mimic AuthContext.login success
        await login(email, password);
        navigate("/educator/dashboard");
      } else {
        setError("Registration failed");
      }
    } catch (e: any) {
      setError("Registration failed");
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420, margin: "0 auto" }}>
      <h2>Create Educator Account</h2>
      <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
        <input placeholder="Full name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
        <button className="btn" type="submit">Sign Up</button>
        {error && <div style={{ color: "tomato" }}>{error}</div>}
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: 12, borderRadius: 8, border: "2px solid #cfd8dc", fontSize: 16, outline: "none"
};