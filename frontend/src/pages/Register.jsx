import { useState } from "react";
import { register } from "../api.js";
import { useAuth } from "../state/auth.jsx";

export default function Register() {
  const { setSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // choose only here
  const [msg, setMsg] = useState("");

  const doRegister = async () => {
    setMsg("");
    try {
      const res = await register({ email, password, role });
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("role", res.user.role || role);
      setSession({ token: res.token, user: res.user, role: res.user.role || role });
      setMsg("Registered");
    } catch (e) { setMsg(e.message); }
  };

  return (
    <main className="container">
      <div className="card">
        <div className="card-head"><div><h3>Register</h3><p className="muted">Create a new account</p></div></div>
        <div className="card-body">
          {msg && <p className="muted">{msg}</p>}
          <div className="form-grid">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="educator">Educator</option>
            </select>
            <button className="btn primary" onClick={doRegister}>Register</button>
          </div>
        </div>
      </div>
    </main>
  );
}