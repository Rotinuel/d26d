"use client";
import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { cn } from "@/lib/utils";

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((message, type = "success", duration = 4000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration);
  }, []);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: add }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-xl animate-fade-up max-w-sm",
              t.type === "success" && "bg-card border-emerald/40 text-emerald",
              t.type === "error"   && "bg-card border-red-400/40 text-red-400",
              t.type === "info"    && "bg-card border-gold/40 text-gold",
              t.type === "warning" && "bg-card border-orange-400/40 text-orange-400"
            )}
          >
            <span className="text-lg mt-0.5">
              {t.type === "success" ? "✓" : t.type === "error" ? "✕" : t.type === "warning" ? "⚠" : "ℹ"}
            </span>
            <p className="text-sm text-text-base flex-1">{t.message}</p>
            <button onClick={() => remove(t.id)} className="text-muted hover:text-text-base text-lg leading-none">×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
