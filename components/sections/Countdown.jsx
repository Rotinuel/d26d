"use client";
<<<<<<< HEAD
import FlipDigit from "@/components/ui/FlipDigit";
=======
>>>>>>> e1d658b01c6caaf9506d7b7dfaf871069195ae70
import { useState, useEffect } from "react";
import { EVENT } from "@/lib/constants";

export default function Countdown() {
<<<<<<< HEAD
  const [time, setTime] = useState({ mo: 0, d: 0, h: 0, m: 0, s: 0 });
=======
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
>>>>>>> e1d658b01c6caaf9506d7b7dfaf871069195ae70
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const target = new Date(EVENT.startDate);
<<<<<<< HEAD

    const tick = () => {
      const now = new Date();

      if (now >= target){
        return setTime({ mo: 0, d: 0, h: 0, m: 0, s: 0 });
      } 
      let months = 
        (target.getFullYear() - now.getFullYear()) * 12 +
        (target.getMonth() - now.getMonth());

        let tempDate = new Date(now);
        tempDate.setMonth(tempDate.getMonth() + months);

        // If we've overshot, reduce month count
  if (tempDate > target) {
    months--;
    tempDate = new Date(now);
    tempDate.setMonth(tempDate.getMonth() + months);
  }

      const diff = target - tempDate;

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);


      setTime({
        mo: months,
        d: days,
        h: hours,
        m: mins,
        s: secs,
      });
    };
    tick();
  const id = setInterval(tick, 1000);

  return () => clearInterval(id);
=======
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) return setTime({ d: 0, h: 0, m: 0, s: 0 });
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
>>>>>>> e1d658b01c6caaf9506d7b7dfaf871069195ae70
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-4 sm:gap-8 justify-center flex-wrap">
<<<<<<< HEAD
      {[["Months", time.mo],["Days", time.d], ["Hours", time.h], ["Mins", time.m], ["Secs", time.s]].map(([label, val]) => (
        <div key={label} className="text-center min-w-[64px]">
          <div className="font-mono text-5xl sm:text-6xl font-bold text-gold leading-none tabular-nums">
            <div className="flex gap-1 justify-center">
  {String(val)
    .padStart(2, "0")
    .split("")
    .map((digit, i) => (
      <FlipDigit key={i} value={digit} />
    ))}
</div>
=======
      {[["Days", time.d], ["Hours", time.h], ["Mins", time.m], ["Secs", time.s]].map(([label, val]) => (
        <div key={label} className="text-center min-w-[64px]">
          <div className="font-mono text-5xl sm:text-6xl font-bold text-gold leading-none tabular-nums">
            {String(val).padStart(2, "0")}
>>>>>>> e1d658b01c6caaf9506d7b7dfaf871069195ae70
          </div>
          <div className="text-[10px] tracking-[0.25em] uppercase text-muted mt-2">{label}</div>
        </div>
      ))}
    </div>
  );
}
