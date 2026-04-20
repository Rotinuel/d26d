"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin/dashboard",  label: "Overview",   icon: "📊" },
  { href: "/admin/tickets",    label: "Tickets",    icon: "🎟️" },
  { href: "/admin/vendors",    label: "Vendors",    icon: "🏪" },
  { href: "/admin/sponsors",   label: "Sponsors",   icon: "🤝" },
  { href: "/admin/checkin",    label: "Check-In",   icon: "✅" },
  { href: "/admin/reports",    label: "Reports",    icon: "📈" },
  { href: "/admin/broadcast",  label: "Broadcast",  icon: "📢" },
];

export default function AdminLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      router.push("/login?redirect=/admin/dashboard");
    }
  }, [user, loading]);

  if (loading || !user) return null;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-surface border-r border-border shrink-0 sticky top-16 h-[calc(100vh-64px)]">
        <div className="p-4 border-b border-border">
          <p className="text-xs text-muted uppercase tracking-widest font-semibold">Admin Panel</p>
          <p className="text-sm font-semibold text-gold mt-0.5">{user.name.split(" ")[0]}</p>
        </div>
        <nav className="flex flex-col gap-1 p-3 flex-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                pathname === item.href
                  ? "bg-gold/10 text-gold"
                  : "text-muted hover:text-text-base hover:bg-card"
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border text-xs text-muted">
          ODDC 2025 · Admin
        </div>
      </aside>

      {/* Mobile tab bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border flex justify-around px-2 py-2">
        {NAV.slice(0, 5).map((item) => (
          <Link key={item.href} href={item.href}
            className={cn("flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs transition-colors",
              pathname === item.href ? "text-gold" : "text-muted")}>
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Main */}
      <main className="flex-1 min-w-0 pb-20 md:pb-0">{children}</main>
    </div>
  );
}
