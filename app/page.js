import Link from "next/link";
import Countdown from "@/components/sections/Countdown";
import TicketCard from "@/components/sections/TicketCard";
import ScheduleTabs from "@/components/sections/ScheduleTabs";
import { TICKET_TIERS, SCHEDULE, EVENT_TYPE_COLORS, SPONSOR_PACKAGES, EVENT, naira } from "@/lib/constants";

export const metadata = {
  title: "Olambe Detty December 2026 — Dec 23–26, Ogun State",
};

export default function HomePage() {
  return (
    <div>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 py-24 overflow-hidden">
        {/* Background orbs */}
        <div className="orb w-[600px] h-[600px] bg-gold/8 top-[-100px] left-[-150px]" />
        <div className="orb w-[400px] h-[400px] bg-coral/8 bottom-[-50px] right-[-100px]" />
        <div className="absolute inset-0 bg-pattern opacity-40" />

        <div className="relative z-10 flex flex-col items-center gap-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 text-gold text-xs font-semibold tracking-wide animate-fade-up">
            🇳🇬 Olambe, Ogun State · Dec 23–26, 2026
          </div>

          <h1 className="font-display text-[clamp(44px,9vw,96px)] font-black leading-[1.0] animate-fade-up [animation-delay:100ms]">
            Olambe Detty<br />
            <span className="text-gradient">December</span>
          </h1>

          <p className="text-muted text-lg max-w-xl leading-relaxed animate-fade-up [animation-delay:200ms]">
            The most anticipated December celebration. Four electric nights of music, culture, food, comedy, and memories you'll never forget.
          </p>

          <div className="animate-fade-up [animation-delay:300ms] w-full max-w-4xl">
            <Countdown />
          </div>

          <div className="flex flex-wrap gap-3 justify-center animate-fade-up [animation-delay:400ms]">
            <Link href="#tickets">
              <button className="bg-gold text-bg font-bold px-8 py-4 rounded-xl text-base hover:bg-gold-dark transition-colors">
                🎟️ Get Tickets
              </button>
            </Link>
            <Link href="/vendor/apply">
              <button className="bg-card border border-border text-text-base font-semibold px-8 py-4 rounded-xl text-base hover:border-gold/50 transition-colors">
                🏪 Vendor Slots
              </button>
            </Link>
            <Link href="/sponsor/packages">
              <button className="bg-transparent border border-gold text-gold font-semibold px-8 py-4 rounded-xl text-base hover:bg-gold/10 transition-colors">
                🤝 Sponsor Us
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
      <section className="bg-gold py-5">
        <div className="max-w-5xl mx-auto px-4 flex justify-center gap-8 sm:gap-16 flex-wrap">
          {[
            ["4 Days", "of celebration"],
            ["5 Stages", "of entertainment"],
            ["50+ Vendors", "food & retail"],
            ["3,000+", "expected attendees"],
          ].map(([n, l]) => (
            <div key={n} className="text-center">
              <div className="font-display text-2xl sm:text-3xl font-black text-bg">{n}</div>
              <div className="text-[11px] text-bg/70 font-semibold uppercase tracking-wider">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TICKETS ───────────────────────────────────────────────────────── */}
      <section id="tickets" className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-gold text-xs font-bold uppercase tracking-widest mb-3">General Sales — Limited Availability</p>
          <h2 className="font-display text-5xl font-bold mb-4">
            Choose Your <span className="text-gold">Pass</span>
          </h2>
          <p className="text-muted max-w-lg mx-auto">
            All tickets include access to all 5 stages, the vendor market, and official event programming.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TICKET_TIERS.map((tier) => (
            <TicketCard key={tier.id} tier={tier} />
          ))}
        </div>
        <p className="text-center text-xs text-muted mt-6">
          Payments secured by <span className="text-gold font-semibold">Paystack</span> · Visa · Mastercard · Verve · Bank Transfer · USSD
        </p>
      </section>

      {/* ── SCHEDULE ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-surface border-y border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold text-xs font-bold uppercase tracking-widest mb-3">Dec 23–26, 2026</p>
            <h2 className="font-display text-5xl font-bold mb-4">
              Event <span className="text-gold">Schedule</span>
            </h2>
          </div>
          <ScheduleTabs />
        </div>
      </section>

      {/* ── VENDOR CTA ────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vendor card */}
          <div className="bg-card border border-border rounded-3xl p-10 flex flex-col gap-6">
            <span className="text-5xl">🏪</span>
            <div>
              <h3 className="font-display text-3xl font-bold mb-3">Become a Vendor</h3>
              <p className="text-muted leading-relaxed">
                Showcase your business to 3,000+ attendees over 4 days. Food vendors, fashion, beauty, tech, retail — all welcome.
              </p>
            </div>
            <div className="flex flex-col gap-2 text-sm text-muted">
              <span>📐 Slots from 3×3m to 4×4m corner booths</span>
              <span>⚡ Power connections included</span>
              <span>💰 From {naira(30000)} per day</span>
            </div>
            <Link href="/vendor/apply">
              <button className="bg-coral text-white font-bold px-6 py-3 rounded-xl hover:bg-coral/90 transition-colors w-full sm:w-auto">
                Apply for a Slot →
              </button>
            </Link>
          </div>

          {/* Sponsor card */}
          <div className="bg-card border border-gold/30 rounded-3xl p-10 flex flex-col gap-6 glow-gold">
            <span className="text-5xl">🤝</span>
            <div>
              <h3 className="font-display text-3xl font-bold mb-3">Sponsor the Event</h3>
              <p className="text-muted leading-relaxed">
                Put your brand in front of Nigeria's most energetic December crowd. Packages from Bronze to Title Sponsor.
              </p>
            </div>
            <div className="flex flex-col gap-2 text-sm text-muted">
              <span>📺 Stage mentions, banners, social media</span>
              <span>🎫 VIP passes included in all packages</span>
              <span>💰 From {naira(250000)}</span>
            </div>
            <Link href="/sponsor/packages">
              <button className="bg-gold text-bg font-bold px-6 py-3 rounded-xl hover:bg-gold-dark transition-colors w-full sm:w-auto">
                View Packages →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SPONSORS SHOWCASE ─────────────────────────────────────────────── */}
      <section className="py-16 px-4 border-t border-border bg-surface">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-muted mb-8">Official Sponsors</p>
          <div className="flex items-center justify-center gap-10 flex-wrap opacity-50">
            {["MTN Nigeria", "Access Bank", "Dangote Foundation", "Flutterwave"].map((s) => (
              <span key={s} className="font-display font-bold text-xl text-muted">{s}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT / FAQ ─────────────────────────────────────────────────── */}
      <section className="py-20 px-4 max-w-3xl mx-auto text-center">
        <h2 className="font-display text-4xl font-bold mb-4">Have Questions?</h2>
        <p className="text-muted mb-8">
          Our team is available via WhatsApp, email, and phone every day from 9am – 6pm WAT.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href={`mailto:${EVENT.email}`}>
            <button className="bg-card border border-border text-text-base font-semibold px-6 py-3 rounded-xl hover:border-gold/50 transition-colors">
              ✉️ {EVENT.email}
            </button>
          </a>
          <a href={`https://wa.me/${EVENT.whatsapp.replace(/\D/g,"")}`} target="_blank">
            <button className="bg-card border border-border text-text-base font-semibold px-6 py-3 rounded-xl hover:border-gold/50 transition-colors">
              💬 WhatsApp Us
            </button>
          </a>
        </div>
      </section>
    </div>
  );
}

// ── Schedule Tabs (Client Component) ─────────────────────────────────────────
"use client";
import { useState } from "react";

function ScheduleTabs() {
  const days = Object.keys(SCHEDULE);
  const [active, setActive] = useState(days[0]);
  const day = SCHEDULE[active];

  return (
    <div>
      <div className="flex gap-2 mb-8 flex-wrap">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setActive(d)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
              active === d
                ? "border-gold bg-gold/10 text-gold"
                : "border-border text-muted hover:border-border/80 hover:text-text-base"
            }`}
          >
            {d}
            <span className="ml-2 text-xs opacity-60">{SCHEDULE[d].theme.split(" ").slice(1).join(" ")}</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {day.events.map((ev, i) => (
          <div
            key={i}
            className="flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-4"
          >
            <span className="font-mono text-sm text-muted w-20 shrink-0">{ev.time}</span>
            <span className="flex-1 text-sm">{ev.act}</span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
              style={{
                color: EVENT_TYPE_COLORS[ev.type],
                background: EVENT_TYPE_COLORS[ev.type] + "18",
                border: `1px solid ${EVENT_TYPE_COLORS[ev.type]}40`,
              }}
            >
              {ev.type}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
