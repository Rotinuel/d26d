"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { PageLoader } from "@/components/ui/Spinner";
import { naira, formatDate } from "@/lib/utils";

export default function AdminVendors() {
  const { toast } = useToast();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [actioning, setActioning] = useState(null);

  useEffect(() => { fetchVendors(); }, []);

  async function fetchVendors() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/vendors/list");
      if (res.ok) setVendors((await res.json()).vendors);
    } catch { toast("Failed to load vendors", "error"); }
    finally { setLoading(false); }
  }

  async function action(id, type) {
    setActioning(id + type);
    try {
      const res = await fetch(`/api/admin/vendors/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendor_id: id }),
      });
      const data = await res.json();
      if (res.ok) {
        toast(`Vendor ${type}d successfully`, "success");
        setVendors((prev) => prev.map((v) => v.id === id ? { ...v, status: type === "approve" ? "approved" : "rejected" } : v));
      } else throw new Error(data.error);
    } catch (err) { toast(err.message, "error"); }
    finally { setActioning(null); }
  }

  if (loading) return <PageLoader />;

  const filtered = filter === "all" ? vendors : vendors.filter((v) => v.status === filter);
  const counts = vendors.reduce((acc, v) => { acc[v.status] = (acc[v.status] || 0) + 1; return acc; }, {});

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Vendor Applications</h1>
          <p className="text-muted text-sm mt-1">{vendors.length} total applications</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => window.open("/api/admin/reports?type=vendors")}>
          ⬇ Export CSV
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[["all", "All", vendors.length], ["pending", "Pending", counts.pending || 0],
          ["approved", "Approved", counts.approved || 0], ["rejected", "Rejected", counts.rejected || 0]].map(([val, label, count]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              filter === val ? "border-gold bg-gold/10 text-gold" : "border-border text-muted hover:text-text-base"}`}>
            {label} <span className="ml-1 opacity-70">({count})</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="text-center py-16"><p className="text-muted">No vendors found</p></Card>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((v) => (
            <Card key={v.id}>
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-base">{v.biz_name}</h3>
                    <Badge color="#FF6348">{v.category}</Badge>
                    <Badge status={v.status}>{v.status}</Badge>
                  </div>
                  <p className="text-muted text-sm">{v.email} · {v.phone}</p>
                  {v.rc_number && <p className="text-xs text-muted mt-0.5">RC: {v.rc_number}</p>}
                  {v.description && <p className="text-sm text-muted mt-2 line-clamp-2">{v.description}</p>}
                  {/* Bookings */}
                  {v.bookings?.length > 0 && (
                    <div className="mt-3 flex gap-2 flex-wrap">
                      {v.bookings.map((b) => (
                        <span key={b.id} className="text-xs bg-surface border border-border rounded-lg px-2 py-1">
                          {b.slot_name} · <span className="text-gold">{naira(b.price)}</span> ·{" "}
                          <Badge status={b.status} className="text-[10px] px-1.5 py-0">{b.status}</Badge>
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-muted mt-2">Applied {formatDate(v.created_at)}</p>
                </div>
                {v.status === "pending" && (
                  <div className="flex gap-2 shrink-0">
                    <Button size="sm" variant="success"
                      loading={actioning === v.id + "approve"}
                      onClick={() => action(v.id, "approve")}>
                      ✓ Approve
                    </Button>
                    <Button size="sm" variant="danger"
                      loading={actioning === v.id + "reject"}
                      onClick={() => action(v.id, "reject")}>
                      ✕ Reject
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
