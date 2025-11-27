import { NavLink } from "react-router-dom";

export default function Navbar({ healthOk, role, onLogout }) {
  const navClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");
  return (
    <header className="nav">
      <div className="brand"><span className="logo">EV</span><span>EduVillage</span></div>
      <nav className="nav-links">
        <NavLink to="/" className={navClass} end>Dashboard</NavLink>
        <NavLink to="/lessons" className={navClass}>Lessons</NavLink>
        <NavLink to="/progress" className={navClass}>Progress</NavLink>
        <NavLink to="/login" className={navClass}>Login</NavLink>
        <NavLink to="/register" className={navClass}>Register</NavLink>
      </nav>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <span className="pill">{role}</span>
        <div className={`status ${healthOk ? "ok" : "bad"}`}>{healthOk ? "Online" : "Offline"}</div>
        <button className="btn mini" onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}