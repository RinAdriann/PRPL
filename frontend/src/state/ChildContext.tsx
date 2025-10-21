import React, { createContext, useContext, useState } from "react";

// In a kiosk scenario, child can be pre-selected. Seed uses childId = 1.
type ChildCtx = {
  childId: number;
  setChildId: (id: number) => void;
};

const Ctx = createContext<ChildCtx>({} as any);

export function ChildProvider({ children }: { children: React.ReactNode }) {
  const [childId, setChildId] = useState<number>(Number(localStorage.getItem("child_id") || 1));

  function update(id: number) {
    setChildId(id);
    localStorage.setItem("child_id", String(id));
  }
  return <Ctx.Provider value={{ childId, setChildId: update }}>{children}</Ctx.Provider>;
}

export function useChild() { return useContext(Ctx); }
