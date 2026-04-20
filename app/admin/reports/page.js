"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import StatCard from "@/components/ui/StatCard";
import { PageLoader } from "@/components/ui/Spinner";
import { naira } from "@/lib/constants";

export default function AdminReports() {
  const { toast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchStats(); }, []);

  async function fetchStats() {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) setStats(await res.json());
    } catch { toast("Failed to load report data", "error"); }
    finally { setLoading(false); }
  }

  async function exportReport(type) {
    toast(`Preparing ${type} report…`, "info");
    try {
      const res = await fetch(`/api/admin/reports?type=${type}`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `oddc-${type}-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast(`${type} report downloaded ✅`, "success");
    } catch {
      toast("Export failed. Try again.", "error");
    }
  }

  if (loading) return <PageLoader />;

  const s = stats || {};
  const gross = (s.ticketRevenue || 0) + (s.vendorRevenue || 0) + (s.sponsorRevenue || 0);
  const paystackFee = Math.min(gross * 0.015, 200000 * (s.ticketCount || 1));
  const vat = gross * 0.075;
  const net = gross - paystackFee - vat;

  const reportCards = [
    { icon: "🎟️", title: "Ticket Sales Report", desc: "All attendees, tiers, payment refs, dates", type: "tickets" },
    { icon: "👥", title: "Attendee List",        desc: "Contact info, ticket tier, QR code data",   type: "attendees" },
    { icon: "🏪", title: "Vendor Summary",        desc: "Confirmed vendors, slots, contact details", type: "vendors" },
    { icon: "🤝", title: "Sponsor Report",        desc: "Packages, brand assets, approval status",  type: "sponsors" },
    { icon: "✅", title: "Check-In Log",          desc: "Per-day entry log with timestamps",         type: "checkins" },
    { icon: "💰", title: "Full Revenue Report",   desc: "Gross, fees, VAT, net by stream",           type: "revenue" },
  ];

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted text-sm mt-1">Download data exports and review event financials</p>
      </div>

      {/* Financial summary */}
      <Card className="mb-8">
        <h2 className="font-display text-xl font-bold mb-6">Financial Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-surface rounded-xl p-4">
            <p className="text-xs text-muted uppercase tracking-wide mb-2">Ticket Revenue</p>
            <p className="font-mono text-lg font-bold text-gold">{naira(s.ticketRevenue || 0)}</p>
          </div>
          <div className="bg-surface rounded-xl p-4">
            <p className="text-xs text-muted uppercase tracking-wide mb-2">Vendor Fees</p>
            <p className="font-mono text-lg font-bold text-coral">{naira(s.vendorRevenue || 0)}</p>
          </div>
          <div className="bg-surface rounded-xl p-4">
            <p className="text-xs text-muted uppercase tracking-wide mb-2">Sponsorships</p>
            <p className="font-mono text-lg font-bold text-violet">{naira(s.sponsorRevenue || 0)}</p>
          </div>
          <div className="bg-surface rounded-xl p-4">
            <p className="text-xs text-muted uppercase tracking-wide mb-2">Gross Revenue</p>
            <p className="font-mono text-lg font-bold text-emerald">{naira(gross)}</p>
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <h3 className="text-sm font-semibold text-muted mb-3 uppercase tracking-wide">Deductions</h3>
          <div className="space-y-2 mb-5">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Paystack Processing Fees (1.5%, capped ₦2,000/txn)</span>
              <span className="text-red-400 font-mono">−{naira(paystackFee)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">VAT (7.5%)</span>
              <span className="text-red-400 font-mono">−{naira(vat)}</span>
            </div>
          </div>
          <div className="flex justify-between font-bold text-lg border-t border-border pt-3">
            <span>Estimated Net Revenue</span>
            <span className="text-emerald font-mono">{naira(net)}</span>
          </div>
        </div>
      </Card>

      {/* Ticket & event stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Tickets" value={s.ticketCount || 0} icon="🎟️" color="text-gold" />
        <StatCard label="Capacity %" value={`${Math.round(((s.ticketCount || 0) / (s.ticketCapacity || 500)) * 100)}%`} icon="📊" color="text-coral" />
        <StatCard label="Vendors Confirmed" value={s.vendorsApproved || 0} icon="🏪" color="text-emerald" />
        <StatCard label="Sponsors Active" value={s.sponsorsApproved || 0} icon="🤝" color="text-violet" />
      </div>

      {/* Export cards */}
      <h2 className="font-display text-xl font-bold mb-5">Export Reports</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportCards.map((r) => (
          <div key={r.type}
            className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 hover:border-gold/40 transition-all hover:-translate-y-0.5 cursor-pointer"
            onClick={() => exportReport(r.type)}
          >
            <span className="text-4xl">{r.icon}</span>
            <div>
              <p className="font-semibold mb-1">{r.title}</p>
              <p className="text-muted text-sm">{r.desc}</p>
            </div>
            <div className="flex items-center gap-2 text-gold text-sm font-semibold">
              <span>⬇</span> Download CSV
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted mt-6">
        * Financial figures are estimates. Final reconciliation should be done with your Paystack dashboard.
        VAT obligations should be confirmed with your accountant.
      </p>
    </div>
  );
}
