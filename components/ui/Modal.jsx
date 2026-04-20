"use client";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export default function Modal({ open, onClose, title, children, size = "md" }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={cn(
          "w-full bg-card border border-border rounded-2xl p-6 max-h-[90vh] overflow-y-auto animate-fade-up",
          sizes[size]
        )}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display text-xl text-gold">{title}</h3>
          <button
            onClick={onClose}
            className="text-muted hover:text-text-base transition-colors text-2xl leading-none w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
