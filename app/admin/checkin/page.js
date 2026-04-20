"use client";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/Toast";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { SCHEDULE } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export default function AdminCheckin() {
  const { toast } = useToast();
  const [refInput, setRefInput] = useState("");
  const [activeDay, setActiveDay] = useState("Dec 23");
  const [result, setResult] = useState(null);
  const [checking, setChecking] = useState(false);
  const [recentScans, setRecentScans] = useState([]);
  const [dailyCounts, setDailyCounts] = useState({ "Dec 23": 0, "Dec 24": 0, "Dec 25": 0, "Dec 26": 0 });
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  async function handleScan(e) {
    e.preventDefault();
    const ref = refInput.trim();
    if (!ref) return;
    setChecking(true);
    setResult(null);

    try {
      const res = await fetch("/api/admin/checkin/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference: ref, day: activeDay }),
      });
      const data = await res.json();

      if (res.ok && data.valid) {
        setResult({ success: true, ticket: data.ticket, message: data.message });
        setRecentScans((prev) => [{ ref, ticket: data.ticket, time: new Date(), day: activeDay, success: true }, ...prev.slice(0, 19)]);
        setDailyCounts((prev) => ({ ...prev, [activeDay]: prev[activeDay] + 1 }));
        toast(`✅ Entry granted — ${data.ticket?.users?.name || "Guest"}`, "success");
      } else {
        setResult({ success: false, message: data.error || "Invalid ticket" });
        setRecentScans((prev) => [{ ref, time: new Date(), day: activeDay, success: false, error: data.error }, ...prev.slice(0, 19)]);
        toast(data.error || "Invalid ticket", "error");
      }
    } catch {
      toast("Scan failed — check connection", "error");
    } finally {
      setChecking(false);
      setRefInput("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold">Gate Check-In</h1>
        <p className="text-muted text-sm mt-1">Scan QR codes or enter ticket references manually</p>
      </div>

      {/* Day selector */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {Object.keys(SCHEDULE).map((d) => (
          <button key={d} onClick={() => setActiveDay(d)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold border transition-all ${
              activeDay === d ? "border-gold bg-gold/10 text-gold" : "border-border text-muted hover:text-text-base"}`}>
            {d}
            <span className="ml-2 font-mono text-xs opacity-70">({dailyCounts[d]})</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner panel */}
        <div className="space-y-5">
          {/* Manual input */}
          <Card>
            <h3 className="font-semibold mb-4">Manual Reference Entry</h3>
            <form onSubmit={handleScan} className="flex gap-3">
              <input
                ref={inputRef}
                value={refInput}
                onChange={(e) => setRefInput(e.target.value)}
                placeholder="Ticket ref e.g. TKT_1234_ABCDE"
                className="flex-1 bg-surface border border-border text-text-base placeholder-muted rounded-xl px-4 py-3 text-sm outline-none focus:border-gold/60 font-mono"
                autoComplete="off"
                autoCapitalize="characters"
              />
              <Button type="submit" loading={checking}>Scan</Button>
            </form>
            <p className="text-xs text-muted mt-2">
              Tip: Connect a barcode/QR scanner — it auto-types into this field and submits on Enter.
            </p>
          </Card>

          {/* Scan result */}
          {result && (
            <div className={`rounded-2xl border p-5 ${
              result.success
                ? "border-emerald/40 bg-emerald/10"
                : "border-red-400/40 bg-red-400/10"
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-4xl">{result.success ? "✅" : "❌"}</span>
                <div>
                  <p className={`font-bold text-lg ${result.success ? "text-emerald" : "text-red-400"}`}>
                    {result.success ? "Entry Granted" : "Entry Denied"}
                  </p>
                  <p className="text-sm text-muted">{result.message}</p>
                </div>
              </div>
              {result.ticket && (
                <div className="bg-bg/40 rounded-xl p-4 text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted">Name</span>
                    <span className="font-semibold">{result.ticket.users?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Tier</span>
                    <span>{result.ticket.tier_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Day</span>
                    <span>{result.ticket.day}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Qty</span>
                    <span className="text-gold font-bold">×{result.ticket.quantity || 1}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* QR scanner placeholder */}
          <Card className="!bg-surface text-center py-8">
            <p className="text-4xl mb-3">📱</p>
            <p className="font-semibold mb-1">Camera QR Scanner</p>
            <p className="text-muted text-xs max-w-xs mx-auto">
              In production, integrate <code className="text-gold">html5-qrcode</code> or{" "}
              <code className="text-gold">@zxing/browser</code> here to enable
              camera-based scanning on mobile devices.
            </p>
            <Button variant="secondary" size="sm" className="mt-4"
              onClick={() => toast("Camera scanner integration: npm install html5-qrcode", "info")}>
              Setup Camera Scanner
            </Button>
          </Card>
        </div>

        {/* Right: counts + recent scans */}
        <div className="space-y-5">
          {/* Daily counts */}
          <Card>
            <h3 className="font-semibold mb-4">Check-in Counts</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(dailyCounts).map(([day, count]) => (
                <div key={day} className={`rounded-xl p-4 border text-center ${
                  activeDay === day ? "border-gold bg-gold/10" : "border-border bg-surface"
                }`}>
                  <p className="text-xs text-muted mb-1">{day}</p>
                  <p className={`font-mono text-3xl font-bold ${activeDay === day ? "text-gold" : "text-text-base"}`}>
                    {count}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent scans */}
          <Card>
            <h3 className="font-semibold mb-4">Recent Scans</h3>
            {recentScans.length === 0 ? (
              <p className="text-muted text-sm text-center py-6">No scans yet</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-80 overflow-y-auto">
                {recentScans.map((scan, i) => (
                  <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${
                    scan.success ? "bg-emerald/10" : "bg-red-400/10"
                  }`}>
                    <span>{scan.success ? "✅" : "❌"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-xs text-muted truncate">{scan.ref}</p>
                      {scan.ticket && <p className="text-xs font-semibold">{scan.ticket.users?.name}</p>}
                      {!scan.success && <p className="text-xs text-red-400">{scan.error}</p>}
                    </div>
                    <span className="text-xs text-muted shrink-0">
                      {scan.time.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
