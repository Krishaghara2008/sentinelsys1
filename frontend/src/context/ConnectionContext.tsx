import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../api/client";
import type { HealthCheck } from "../types";

interface ConnectionContextValue {
  connected: boolean;
  health: HealthCheck | null;
  checking: boolean;
}

const ConnectionContext = createContext<ConnectionContextValue>({
  connected: false,
  health: null,
  checking: true,
});

export function ConnectionProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [health, setHealth] = useState<HealthCheck | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await api.health();
        if (!cancelled) {
          setHealth(res);
          setConnected(true);
        }
      } catch {
        if (!cancelled) {
          setConnected(false);
          setHealth(null);
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    poll();
    const interval = setInterval(poll, 15000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <ConnectionContext.Provider value={{ connected, health, checking }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  return useContext(ConnectionContext);
}
