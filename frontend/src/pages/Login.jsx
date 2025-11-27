import { useState } from "react";
import { login } from "../api.js";
import { useAuth } from "../state/auth.jsx";

export default function Login() {
  const { setSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const doLogin = async () => {
    setMsg("");
    try {
      const res = await login({ email, password });
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("role", res.user.role || "student");
      setSession({ token: res.token, user: res.user, role: res.user.role || "student" });
      setMsg("Logged in");
    } catch (e) { setMsg(e.message); }
  };

  return (
    <main className="container">
      <div className="card">
        <div className="card-head"><div><h3>Login</h3><p className="muted">Enter your credentials</p></div></div>
        <div className="card-body">
          {msg && <p className="muted">{msg}</p>}
          <div className="form-grid">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="btn primary" onClick={doLogin}>Login</button>
          </div>
        </div>
      </div>
    </main>
  );
}