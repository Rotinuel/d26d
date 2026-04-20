"use client";
import { cn } from "@/lib/utils";

export default function Input({ label, error, className = "", textarea = false, ...props }) {
  const base =
    "w-full bg-surface border border-border text-text-base placeholder-muted rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-gold/70 focus:ring-1 focus:ring-gold/20";

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-muted uppercase tracking-wide">
          {label}
        </label>
      )}
      {textarea ? (
        <textarea className={cn(base, "resize-none", className)} rows={4} {...props} />
      ) : (
        <input className={cn(base, className)} {...props} />
      )}
      {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
    </div>
  );
}

export function Select({ label, error, children, className = "", ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-muted uppercase tracking-wide">
          {label}
        </label>
      )}
      <select
        className={cn(
          "w-full bg-surface border border-border text-text-base rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-gold/70",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
    </div>
  );
}
