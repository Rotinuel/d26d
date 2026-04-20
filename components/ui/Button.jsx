"use client";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-gold text-bg font-bold hover:bg-gold-dark",
  secondary: "bg-card text-text-base border border-border hover:border-gold/50",
  ghost: "bg-transparent border border-gold text-gold hover:bg-gold/10",
  danger: "bg-red-500 text-white hover:bg-red-600",
  success: "bg-emerald text-white hover:bg-emerald/90",
  outline: "bg-transparent border border-border text-muted hover:text-text-base hover:border-border",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-7 py-3.5 text-base rounded-xl",
  xl: "px-9 py-4 text-lg rounded-2xl",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  disabled = false,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 cursor-pointer select-none",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Processing...
        </>
      ) : (
        children
      )}
    </button>
  );
}
