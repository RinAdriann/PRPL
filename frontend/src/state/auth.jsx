import { createContext, useContext, useEffect, useState } from "react";
import { apiPost } from "../api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const roleStr = localStorage.getItem("role") || "guest";
    return token ? { token, user: userStr ? JSON.parse(userStr) : null, role: roleStr } : { token: null, user: null, role: roleStr };
  });

  useEffect(() => {
    // default to guest on first load
    if (!localStorage.getItem("role")) localStorage.setItem("role", "guest");
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.setItem("role", "guest");
    setSession({ token: null, user: null, role: "guest" });
  };

  const value = {
    role: session.role || "guest",
    user: session.user,
    token: session.token,
    setSession,
    logout
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  return useContext(AuthCtx);
}

export async function login(email, password) {
  const data = await apiPost("/auth/login", { email, password });
  localStorage.setItem("token", data.token);
  return data.user;
}

export async function register(email, password, role) {
  const data = await apiPost("/auth/register", { email, password, role });
  localStorage.setItem("token", data.token);
  return data.user;
}

export function logout() {
  localStorage.removeItem("token");
}