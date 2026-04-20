"use client";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input, { Select } from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

const AUDIENCE_OPTIONS = [
  { value: "all",       label: "Everyone",   desc: "All attendees, vendors, and sponsors", icon: "📣" },
  { value: "attendees", label: "Attendees",  desc: "All ticket holders only",              icon: "🎟️" },
  { value: "vendors",   label: "Vendors",    desc: "All confirmed vendors only",           icon: "🏪" },
  { value: "sponsors",  label: "Sponsors",   desc: "All sponsors only",                   icon: "🤝" },
];

export default function AdminBroadcast() {
  const { toast } = useToast();
  const [form, setForm] = useState({ title: "", message: "", audience: "all" });
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => { fetchHistory(); }, []);

  async function fetchHistory() {
    try {
      const res = await fetch("/api/admin/broadcast");
      if (res.ok) setHistory((await res.json()).broadcasts || []);
    } catch { /* silent */ }
    finally { setLoadingHistory(false); }
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      return toast("Please fill in subject and message", "error");
    }
    setSending(true);
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast(`Broadcast sent to ${data.recipients} recipients ✅`, "success");
        setForm({ title: "", message: "", audience: "all" });
        await fetchHistory();
      } else throw new Error(data.error);
    } catch (err) {
      toast(err.message || "Failed to send broadcast", "error");
    } finally {
      setSending(false);
    }
  }

  const charCount = form.message.length;
  const selectedAudience = AUDIENCE_OPTIONS.find((a) => a.value === form.audience);

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Broadcast</h1>
        <p className="text-muted text-sm mt-1">Send email notifications to attendees, vendors, or sponsors</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Compose */}
        <div>
          <Card>
            <h2 className="font-display text-xl font-bold mb-5">Compose Message</h2>
            <form onSubmit={handleSend} className="space-y-4">
              {/* Audience picker */}
              <div>
                <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">Send To</p>
                <div className="grid grid-cols-2 gap-2">
                  {AUDIENCE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setForm({ ...form, audience: opt.value })}
                      className={`flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all ${
                        form.audience === opt.value
                          ? "border-gold bg-gold/10 text-text-base"
                          : "border-border text-muted hover:border-border/80"
                      }`}
                    >
                      <span className="text-xl">{opt.icon}</span>
                      <span className="text-sm font-semibold">{opt.label}</span>
                      <span className="text-xs opacity-70">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Subject Line *"
                placeholder="e.g. Important Update — ODDC 2025 Gates Open"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />

              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wide block mb-1.5">
                  Message *
                </label>
                <textarea
                  rows={7}
                  placeholder="Write your message here. Keep it clear and concise. You can use line breaks for formatting."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-surface border border-border text-text-base placeholder-muted rounded-xl px-4 py-3 text-sm outline-none focus:border-gold/60 transition-colors resize-none"
                  required
                />
                <p className="text-xs text-muted mt-1 text-right">{charCount} characters</p>
              </div>

              {/* Preview box */}
              {(form.title || form.message) && (
                <div className="bg-surface rounded-xl p-4 border border-border">
                  <p className="text-xs text-muted uppercase tracking-wide mb-2">Preview</p>
                  <p className="font-semibold text-sm mb-1">{form.title || "—"}</p>
                  <p className="text-muted text-xs whitespace-pre-wrap">{form.message || "—"}</p>
                </div>
              )}

              <Button
                type="submit"
                loading={sending}
                className="w-full"
                size="lg"
              >
                📣 Send to {selectedAudience?.label}
              </Button>
            </form>
          </Card>
        </div>

        {/* History */}
        <div>
          <h2 className="font-display text-xl font-bold mb-4">Sent History</h2>
          {loadingHistory ? (
            <Card className="text-center py-8"><p className="text-muted text-sm">Loading…</p></Card>
          ) : history.length === 0 ? (
            <Card className="text-center py-8">
              <p className="text-2xl mb-2">📭</p>
              <p className="text-muted text-sm">No broadcasts sent yet</p>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              {history.map((b) => (
                <Card key={b.id} className="!p-4">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <p className="font-semibold text-sm">{b.title}</p>
                    <Badge color={
                      b.audience === "all" ? "#F0B429" :
                      b.audience === "attendees" ? "#10B981" :
                      b.audience === "vendors" ? "#FF6348" : "#8B5CF6"
                    }>
                      {b.audience}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted line-clamp-2 mb-2">{b.message}</p>
                  <div className="flex justify-between text-xs text-muted">
                    <span>📨 {b.recipients} recipients</span>
                    <span>{formatDate(b.sent_at)}</span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
