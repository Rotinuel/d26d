import { cn } from "@/lib/utils";

export default function Card({ children, className = "", hover = false, gold = false }) {
  return (
    <div
      className={cn(
        "bg-card border rounded-2xl p-6",
        gold ? "border-gold/40" : "border-border",
        hover && "transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(240,180,41,0.1)]",
        className
      )}
    >
      {children}
    </div>
  );
}
