import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { getHealth } from "./api.js";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Lessons from "./pages/Lessons.jsx";
import Progress from "./pages/Progress.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { AuthProvider, useAuth } from "./state/auth.jsx";

function AppShell() {
  const [health, setHealth] = useState(null);
  const { role, logout } = useAuth();

  useEffect(() => {
    getHealth().then(setHealth).catch(() => setHealth(null));
  }, []);

  return (
    <div className="page">
      <Navbar healthOk={!!health} role={role} onLogout={logout} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/lessons" element={<Lessons />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <footer className="footer"><span>© {new Date().getFullYear()} EduVillage</span></footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}