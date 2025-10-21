import React, { createContext, useContext, useEffect, useState } from "react";
import api, { setAuthToken } from "@/services/api";

type AuthCtx = {
  token?: string;
  educatorId?: number;
  name?: string;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx>({} as any);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | undefined>(localStorage.getItem("edu_token") || undefined);
  const [educatorId, setEducatorId] = useState<number | undefined>(localStorage.getItem("edu_id") ? Number(localStorage.getItem("edu_id")) : undefined);
  const [name, setName] = useState<string | undefined>(localStorage.getItem("edu_name") || undefined);

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  async function login(email: string, password: string) {
    try {
      const res = await api.post("/educator/login", { email, password });
      setToken(res.data.token);
      setEducatorId(res.data.educatorId);
      setName(res.data.name);
      localStorage.setItem("edu_token", res.data.token);
      localStorage.setItem("edu_id", String(res.data.educatorId));
      localStorage.setItem("edu_name", res.data.name);
      return true;
    } catch {
      return false;
    }
  }
  function logout() {
    setToken(undefined);
    setEducatorId(undefined);
    setName(undefined);
    localStorage.removeItem("edu_token");
    localStorage.removeItem("edu_id");
    localStorage.removeItem("edu_name");
    setAuthToken(undefined);
  }
  return <Ctx.Provider value={{ token, educatorId, name, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  return useContext(Ctx);
}
