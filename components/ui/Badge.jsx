import { cn, statusColor } from "@/lib/utils";

export default function Badge({ children, color, status, className = "" }) {
  if (status) {
    return (
      <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border", statusColor[status] || statusColor.pending, className)}>
        {children}
      </span>
    );
  }

  return (
    <span
      className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border", className)}
      style={color ? { color, background: color + "18", borderColor: color + "40" } : {}}
    >
      {children}
    </span>
  );
}
