"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/Spinner";
import { naira, formatDate } from "@/lib/utils";

export default function AdminTickets() {
  const { toast } = useToast();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => { fetchTickets(); }, []);

  async function fetchTickets() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tickets");
      if (res.ok) setTickets((await res.json()).tickets);
    } catch { toast("Failed to load tickets", "error"); }
    finally { setLoading(false); }
  }

  if (loading) return <PageLoader />;

  const tierFilters = ["all", "single", "full", "vip", "family"];
  const counts = tickets.reduce((acc, t) => { acc[t.tier] = (acc[t.tier] || 0) + 1; return acc; }, {});

  const filtered = tickets.filter((t) => {
    const matchFilter = filter === "all" || t.tier === filter;
    const matchSearch =
      !search ||
      t.attendee_name?.toLowerCase().includes(search.toLowerCase()) ||
      t.attendee_email?.toLowerCase().includes(search.toLowerCase()) ||
      t.paystack_ref?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalRevenue = tickets.reduce((sum, t) => sum + (t.price / 100) * (t.quantity || 1), 0);

  return (
    <div className="p-6 max-w-6xl">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Ticket Sales</h1>
          <p className="text-muted text-sm mt-1">
            {tickets.length} tickets sold · Total:{" "}
            <span className="text-gold font-semibold">{naira(totalRevenue)}</span>
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => toast("CSV export started", "success")}>
          ⬇ Export CSV
        </Button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          placeholder="Search by name, email or reference..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface border border-border text-text-base placeholder-muted rounded-xl px-4 py-3 text-sm outline-none focus:border-gold/60 transition-colors"
        />
      </div>

      {/* Tier filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tierFilters.map((f) => {
          const labels = { all: "All", single: "Single Day", full: "Full Festival", vip: "VIP", family: "Family Bundle" };
          const count = f === "all" ? tickets.length : counts[f] || 0;
          return (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                filter === f ? "border-gold bg-gold/10 text-gold" : "border-border text-muted hover:text-text-base"}`}>
              {labels[f]} <span className="opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <Card className="!p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border">
              <tr>
                {["Reference", "Attendee", "Tier", "Day(s)", "Qty", "Amount", "Status", "Date"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs text-muted uppercase tracking-wide font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-muted">No tickets found</td></tr>
              ) : (
                filtered.map((t, i) => (
                  <tr key={t.id} className={i < filtered.length - 1 ? "border-b border-border" : ""}>
                    <td className="px-4 py-3 font-mono text-xs text-muted whitespace-nowrap">{t.paystack_ref}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold">{t.attendee_name || t.users?.name}</p>
                      <p className="text-xs text-muted">{t.attendee_email || t.users?.email}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Badge color={
                        t.tier === "vip" ? "#FF6348" : t.tier === "full" ? "#F0B429" :
                        t.tier === "family" ? "#10B981" : "#6B6B85"
                      }>{t.tier_name}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted whitespace-nowrap">{t.day}</td>
                    <td className="px-4 py-3 text-sm text-center font-mono">{t.quantity || 1}</td>
                    <td className="px-4 py-3 font-bold text-gold whitespace-nowrap font-mono text-sm">
                      {naira((t.price / 100) * (t.quantity || 1))}
                    </td>
                    <td className="px-4 py-3"><Badge status={t.status}>{t.status}</Badge></td>
                    <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">{formatDate(t.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
