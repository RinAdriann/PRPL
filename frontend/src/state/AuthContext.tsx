import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/services/api";

interface User {
  id: string;
  email: string;
  role: string;
}
export interface AuthCtx {
  login: (email: string, password: string) => Promise<any>
  register: (email: string, password: string, role?: string) => Promise<any>
  guest: () => Promise<any>
  educatorId?: string
  educatorChildren?: any[]
  get?: (path: string) => Promise<any>
  post?: (path: string, body: any) => Promise<any>
  lessonProgress: (lessonId: string) => Promise<any>
}

const AuthContext = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  useEffect(() => {
    if (!token) setUser(null);
    else setLoading(false);
  }, [token]);

  async function login(email: string, password: string) {
    const data = await api.login(email, password);
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
  }
  async function register(email: string, password: string, role?: string) {
    const data = await api.register(email, password, role);
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
  }
  async function guestLogin() {
    const r = await api.guest();
    localStorage.setItem("token", r.token);
    setUser(r.user);
  }
  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }
  return (
    <AuthContext.Provider value={{ user, loading, login, register, guestLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
