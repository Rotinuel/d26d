"use client";
import { naira } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function TicketCard({ tier }) {
  return (
    <div
      className="relative bg-card border rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)]"
      style={{ borderColor: tier.popular ? tier.color + "60" : "#252338" }}
    >
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-gold text-bg text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
            Most Popular
          </span>
        </div>
      )}

      <div>
        <div
          className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3"
          style={{ color: tier.color, background: tier.color + "18", border: `1px solid ${tier.color}40` }}
        >
          {tier.days}
        </div>
        <h3 className="font-display text-xl font-bold text-text-base mb-1">{tier.name}</h3>
        <p className="text-muted text-sm">{tier.desc}</p>
      </div>

      <div className="font-mono text-3xl font-bold" style={{ color: tier.color }}>
        {naira(tier.price)}
      </div>

      <ul className="flex flex-col gap-2 flex-1">
        {tier.perks.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-muted">
            <span className="mt-0.5 text-emerald shrink-0">✓</span>
            {p}
          </li>
        ))}
      </ul>

      <div className="text-xs text-muted">{tier.available} slots remaining</div>

      <Link href="/attendee/dashboard">
        <Button
          className="w-full"
          style={tier.popular ? {} : { background: tier.color + "18", color: tier.color }}
          variant={tier.popular ? "primary" : "ghost"}
        >
          Buy Now
        </Button>
      </Link>
    </div>
  );
}
