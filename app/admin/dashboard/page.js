"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import StatCard from "@/components/ui/StatCard";
import Card from "@/components/ui/Card";
import { PageLoader } from "@/components/ui/Spinner";
import { naira } from "@/lib/constants";

export default function AdminOverview() {
  const { toast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  async function fetchStats() {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) setStats(await res.json());
    } catch {
      toast("Failed to load stats", "error");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <PageLoader />;

  const s = stats || {
    totalRevenue: 0, ticketCount: 0, ticketCapacity: 500,
    vendorsPending: 0, vendorsApproved: 0,
    sponsorsPending: 0, sponsorsApproved: 0,
    checkins: { dec23: 0, dec24: 0, dec25: 0, dec26: 0 },
    byTier: { single: 0, full: 0, vip: 0, family: 0 },
  };

  const tierColors = { single: "#6B6B85", full: "#F0B429", vip: "#FF6348", family: "#10B981" };

  return (
    <div className="p-6 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold">Dashboard Overview</h1>
<<<<<<< HEAD
          <p className="text-muted text-sm mt-1">Live · Olambe Detty December Carnival 2026</p>
=======
          <p className="text-muted text-sm mt-1">Live · Olambe Detty December Carnival 2025</p>
>>>>>>> e1d658b01c6caaf9506d7b7dfaf871069195ae70
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald rounded-full animate-pulse" />
          <span className="text-xs text-emerald font-semibold">LIVE</span>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue" value={naira(s.totalRevenue)} sub="Across all streams" icon="💰" color="text-emerald" />
        <StatCard label="Tickets Sold" value={`${s.ticketCount} / ${s.ticketCapacity}`}
          sub={`${Math.round((s.ticketCount / s.ticketCapacity) * 100)}% capacity`} icon="🎟️" color="text-gold" />
        <StatCard label="Vendors" value={`${s.vendorsApproved} confirmed`} sub={`${s.vendorsPending} pending`} icon="🏪" color="text-coral" />
        <StatCard label="Sponsors" value={`${s.sponsorsApproved} active`} sub={`${s.sponsorsPending} pending`} icon="🤝" color="text-violet" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Ticket breakdown */}
        <Card>
          <h3 className="font-display text-xl font-bold mb-5">Ticket Breakdown</h3>
          {Object.entries(s.byTier).map(([tier, count]) => {
            const pct = s.ticketCount > 0 ? (count / s.ticketCount) * 100 : 0;
            const label = { single: "Single Day", full: "Full Festival", vip: "VIP", family: "Family Bundle" }[tier];
            return (
              <div key={tier} className="mb-4">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted">{label}</span>
                  <span style={{ color: tierColors[tier] }}>{count} sold</span>
                </div>
                <div className="bg-surface rounded-full h-2">
                  <div className="h-2 rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: tierColors[tier] }} />
                </div>
              </div>
            );
          })}
        </Card>

        {/* Checkin by day */}
        <Card>
          <h3 className="font-display text-xl font-bold mb-5">Gate Check-ins (Live)</h3>
          {[["Dec 23", s.checkins.dec23], ["Dec 24", s.checkins.dec24], ["Dec 25", s.checkins.dec25], ["Dec 26", s.checkins.dec26]].map(([day, count]) => (
            <div key={day} className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted w-14">{day}</span>
                <div className="bg-surface rounded-full h-2 w-40">
                  <div className="h-2 rounded-full bg-gold transition-all duration-700"
                    style={{ width: `${Math.min(100, (count / 800) * 100)}%` }} />
                </div>
              </div>
              <span className="font-mono text-gold font-bold">{count}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Revenue breakdown */}
      <Card>
        <h3 className="font-display text-xl font-bold mb-5">Revenue Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            ["Ticket Sales", s.ticketRevenue || 0, "text-gold"],
            ["Vendor Fees", s.vendorRevenue || 0, "text-coral"],
            ["Sponsorships", s.sponsorRevenue || 0, "text-violet"],
            ["Net (after fees)", s.netRevenue || 0, "text-emerald"],
          ].map(([label, amount, color]) => (
            <div key={label} className="bg-surface rounded-xl p-4">
              <p className="text-xs text-muted uppercase tracking-wide mb-2">{label}</p>
              <p className={`font-mono text-lg font-bold ${color}`}>{naira(amount)}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-4">
          * Net calculated after Paystack 1.5% fee (capped at ₦2,000) and VAT 7.5%
        </p>
      </Card>
    </div>
  );
}
