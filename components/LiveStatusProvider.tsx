import React, { createContext, useContext, useEffect, useState } from "react";

const LiveStatusContext = createContext<boolean>(false);

export function LiveStatusProvider({ children }: { children: React.ReactNode }) {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/live-status");
        const data = await res.json();
        setIsLive(data.live);
      } catch {
        setIsLive(false);
      }
    }

    checkStatus();
    const interval = setInterval(checkStatus, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <LiveStatusContext.Provider value={isLive}>
      {children}
    </LiveStatusContext.Provider>
  );
}

export function useLiveStatus(): boolean {
  return useContext(LiveStatusContext);
}
