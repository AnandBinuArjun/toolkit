"use client";

import { useEffect, useState } from "react";
import { WifiOff, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

declare global {
  interface Window {
    workbox: any;
  }
}

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [isPwaReady, setIsPwaReady] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    setIsOffline(!navigator.onLine);

    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox;
      wb.addEventListener("installed", (event: any) => {
        if (!event.isUpdate) {
          setIsPwaReady(true);
          setTimeout(() => setIsPwaReady(false), 5000);
        }
      });
    } else if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Just check if SW is active
      navigator.serviceWorker.ready.then((reg) => {
        if (reg.active?.state === "activated") {
          // It's ready, we could show it, but typically better to show on first install only.
        }
      });
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {(isOffline || isPwaReady) && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-full bg-bg-panel border border-border-line shadow-[0_0_40px_rgba(0,0,0,0.1)] backdrop-blur-md"
        >
          {isOffline ? (
            <>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-danger/10 text-accent-danger">
                <WifiOff size={16} />
              </div>
              <span className="text-sm font-medium text-text-primary">
                You are offline. Tools work locally!
              </span>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent-primary/10 text-accent-primary">
                <Zap size={16} />
              </div>
              <span className="text-sm font-medium text-text-primary">
                App is ready for offline use.
              </span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
