import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/state/AuthContext";

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await register(email, password); // uses AuthContext.register
      nav("/dashboard"); // go to lessons after register
    } catch (ex: any) {
      setErr(ex.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 420 }}>
      <h2 style={{ marginTop: 0 }}>Create educator account</h2>
      <p className="muted" style={{ marginTop: -6 }}>
        Use this to add or manage your lessons.
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
        <button
          type="submit"
          disabled={loading || !email || !password}
        >
          {loading ? "..." : "Register"}
        </button>
      </form>
    </div>
  );
};
export default RegisterPage;