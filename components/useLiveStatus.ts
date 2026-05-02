import { useEffect, useState } from "react";

export function useLiveStatus() {
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

  return isLive;
}
