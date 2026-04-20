"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/Spinner";
import { SPONSOR_PACKAGES, naira } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export default function AdminSponsors() {
  const { toast } = useToast();
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [actioning, setActioning] = useState(null);

  useEffect(() => { fetchSponsors(); }, []);

  async function fetchSponsors() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sponsors/list");
      if (res.ok) setSponsors((await res.json()).sponsors);
    } catch { toast("Failed to load sponsors", "error"); }
    finally { setLoading(false); }
  }

  async function action(id, type) {
    setActioning(id + type);
    try {
      const res = await fetch(`/api/admin/sponsors/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sponsor_id: id }),
      });
      const data = await res.json();
      if (res.ok) {
        toast(`Sponsor ${type}d`, "success");
        setSponsors((prev) => prev.map((s) => s.id === id
          ? { ...s, status: type === "approve" ? "approved" : "rejected" } : s));
      } else throw new Error(data.error);
    } catch (err) { toast(err.message, "error"); }
    finally { setActioning(null); }
  }

  if (loading) return <PageLoader />;

  const counts = sponsors.reduce((acc, s) => { acc[s.status] = (acc[s.status] || 0) + 1; return acc; }, {});
  const filtered = filter === "all" ? sponsors : sponsors.filter((s) => s.status === filter);
  const totalValue = sponsors.filter((s) => s.price && s.status === "approved").reduce((sum, s) => sum + s.price / 100, 0);

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Sponsors</h1>
          <p className="text-muted text-sm mt-1">
            {sponsors.length} applications ·{" "}
            <span className="text-gold font-semibold">{naira(totalValue)}</span> confirmed value
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => toast("CSV export started", "success")}>
          ⬇ Export CSV
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[["all", "All", sponsors.length], ["pending", "Pending", counts.pending || 0],
          ["approved", "Approved", counts.approved || 0], ["rejected", "Rejected", counts.rejected || 0]].map(([val, label, count]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              filter === val ? "border-gold bg-gold/10 text-gold" : "border-border text-muted hover:text-text-base"}`}>
            {label} <span className="opacity-60">({count})</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="text-center py-16"><p className="text-muted">No sponsors found</p></Card>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((s) => {
            const pkg = SPONSOR_PACKAGES.find((p) => p.id === s.package);
            return (
              <Card key={s.id}>
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-base">{s.company}</h3>
                      {pkg && <Badge color={pkg.color}>{pkg.emoji} {pkg.name}</Badge>}
                      <Badge status={s.status}>{s.status}</Badge>
                    </div>
                    <p className="text-muted text-sm">Contact: {s.contact_name} · {s.email}</p>
                    {s.phone && <p className="text-muted text-sm">{s.phone}</p>}
                    {s.website && (
                      <a href={s.website} target="_blank" className="text-gold text-xs hover:underline mt-0.5 block">
                        🌐 {s.website}
                      </a>
                    )}

                    {/* Brand assets preview */}
                    {(s.logo_url || s.tagline || s.brand_color) && (
                      <div className="mt-3 flex items-center gap-3 flex-wrap">
                        {s.logo_url && (
                          <img src={s.logo_url} alt="Logo" className="h-8 rounded border border-border bg-white px-1 object-contain" />
                        )}
                        {s.tagline && <span className="text-xs italic text-muted">"{s.tagline}"</span>}
                        {s.brand_color && (
                          <span className="flex items-center gap-1 text-xs text-muted">
                            <span className="w-4 h-4 rounded-full border border-border" style={{ background: s.brand_color }} />
                            {s.brand_color}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-2 flex items-center gap-3">
                      <span className="font-mono text-gold font-bold">
                        {s.price ? naira(s.price / 100) : "Custom Deal"}
                      </span>
                      {s.paystack_ref && (
                        <span className="font-mono text-xs text-muted">{s.paystack_ref}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted mt-1">Applied {formatDate(s.created_at)}</p>
                  </div>

                  {s.status === "pending" && (
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" variant="success"
                        loading={actioning === s.id + "approve"}
                        onClick={() => action(s.id, "approve")}>
                        ✓ Approve
                      </Button>
                      <Button size="sm" variant="danger"
                        loading={actioning === s.id + "reject"}
                        onClick={() => action(s.id, "reject")}>
                        ✕ Reject
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
