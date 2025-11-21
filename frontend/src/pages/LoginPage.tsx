import React, { useState } from "react";
import { useAuth } from "@/state/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const { login, guestLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate("/educator/dashboard");
    } catch (ex: any) {
      setErr(ex.message);
    } finally {
      setLoading(false);
    }
  }

  async function guest() {
    setErr(null);
    setLoading(true);
    try {
      await guestLogin();
      navigate("/educator/dashboard");
    } catch (ex: any) {
      setErr(ex.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 420 }}>
      <h2 style={{ marginTop: 0 }}>Login</h2>
      <p className="muted" style={{ marginTop: -6 }}>
        Educators get management privileges. Guests can track personal progress
        only.
      </p>
      {err && (
        <div className="alert" style={{ marginBottom: 14 }}>
          {err}
        </div>
      )}
      <form
        onSubmit={submit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading || !email || !password}>
          {loading ? "..." : "Login"}
        </button>
      </form>
      <div
        style={{
          marginTop: 16,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <button
          onClick={guest}
          disabled={loading}
          style={{ background: "#555" }}
        >
          {loading ? "..." : "Login as Guest"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;