"use client";
import { useEffect, useState } from "react";

export default function FlipDigit({ value }) {
  const [display, setDisplay] = useState(value);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (value !== display) {
      setFlipped(true);

      const mid = setTimeout(() => {
        setDisplay(value); // change number at halfway
      }, 150);

      const end = setTimeout(() => {
        setFlipped(false);
      }, 300);

      return () => {
        clearTimeout(mid);
        clearTimeout(end);
      };
    }
  }, [value]);

  return (
    <div className="w-[56px] h-[72px] perspective">
      <div
        className={`relative w-full h-full rounded-xl border border-gold/30 bg-black text-gold flex items-center justify-center text-4xl font-bold transition-transform duration-300 ${
          flipped ? "flip-number" : ""
        }`}
      >
        {display}
      </div>
    </div>
  );
}