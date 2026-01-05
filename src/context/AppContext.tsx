import React, { createContext, useContext, useMemo, useState } from "react";

type AppState = {
  activeShiftId: string | null;
  setActiveShiftId: (id: string | null) => void;
};

const Ctx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeShiftId, setActiveShiftId] = useState<string | null>(null);

  const value = useMemo(
    () => ({ activeShiftId, setActiveShiftId }),
    [activeShiftId]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAppState must be used inside AppProvider");
  return ctx;
}
