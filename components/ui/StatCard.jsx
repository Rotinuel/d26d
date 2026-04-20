import { cn } from "@/lib/utils";

export default function StatCard({ label, value, sub, icon, color = "text-gold", className = "" }) {
  return (
    <div className={cn("bg-card border border-border rounded-2xl p-5 flex items-start justify-between gap-4", className)}>
      <div>
        <p className="text-xs text-muted uppercase tracking-widest mb-2">{label}</p>
        <p className={cn("font-mono text-2xl font-bold", color)}>{value}</p>
        {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
      </div>
      {icon && <span className="text-3xl opacity-80">{icon}</span>}
    </div>
  );
}
