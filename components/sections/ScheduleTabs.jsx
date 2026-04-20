"use client";

import { useState } from "react";
import { SCHEDULE, EVENT_TYPE_COLORS } from "@/lib/constants";

export default function ScheduleTabs() {
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
            <span className="ml-2 text-xs opacity-60">
              {SCHEDULE[d].theme.split(" ").slice(1).join(" ")}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {day.events.map((ev, i) => (
          <div
            key={i}
            className="flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-4"
          >
            <span className="font-mono text-sm text-muted w-20 shrink-0">
              {ev.time}
            </span>
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