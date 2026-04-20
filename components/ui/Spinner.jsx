import { cn } from "@/lib/utils";

export default function Spinner({ size = "md", className = "" }) {
  const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" };
  return (
    <div className={cn("border-2 border-border border-t-gold rounded-full animate-spin", sizes[size], className)} />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Spinner size="lg" />
      <p className="text-muted text-sm animate-shimmer">Loading…</p>
    </div>
  );
}
