"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";

const portalLinks = {
  attendee: [{ href: "/attendee/dashboard", label: "My Tickets" }],
  vendor:   [{ href: "/vendor/dashboard",  label: "My Booth" }, { href: "/vendor/apply", label: "Apply" }],
  sponsor:  [{ href: "/sponsor/dashboard", label: "My Sponsorship" }, { href: "/sponsor/packages", label: "Packages" }],
  admin:    [
    { href: "/admin/dashboard",  label: "Overview" },
    { href: "/admin/tickets",    label: "Tickets" },
    { href: "/admin/vendors",    label: "Vendors" },
    { href: "/admin/sponsors",   label: "Sponsors" },
    { href: "/admin/checkin",    label: "Check-In" },
    { href: "/admin/reports",    label: "Reports" },
    { href: "/admin/broadcast",  label: "Broadcast" },
  ],
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = user ? portalLinks[user.role] || [] : [];

  return (
    <nav className="sticky top-0 z-40 bg-bg/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-display text-xl font-black text-text-base">
            ODDC<span className="text-gold">26</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1 flex-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "px-3 py-1.5 text-sm rounded-lg transition-colors",
                pathname === l.href
                  ? "text-gold bg-gold/10"
                  : "text-muted hover:text-text-base hover:bg-surface"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-xs text-muted">
                {user.name?.split(" ")[0]} ·{" "}
                <span className="capitalize text-gold">{user.role}</span>
              </span>
              <Button variant="secondary" size="sm" onClick={logout}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="secondary" size="sm">Sign In</Button>
              </Link>
              <Link href="/#tickets">
                <Button size="sm">Get Tickets</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-muted hover:text-text-base p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-4 flex flex-col gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "px-3 py-2 text-sm rounded-lg",
                pathname === l.href ? "text-gold bg-gold/10" : "text-muted hover:text-text-base"
              )}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            {user ? (
              <Button variant="secondary" size="sm" onClick={() => { logout(); setMobileOpen(false); }}>
                Sign Out
              </Button>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="secondary" size="sm" className="w-full">Sign In</Button>
                </Link>
                <Link href="/#tickets" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full">Get Tickets</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
