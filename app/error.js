"use client";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("[App Error]", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p className="text-5xl mb-4">⚠️</p>
      <h2 className="font-display text-3xl font-bold mb-3">Something went wrong</h2>
      <p className="text-muted max-w-md mb-8">
        {error?.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={reset}
        className="bg-gold text-bg font-bold px-8 py-3 rounded-xl hover:bg-gold-dark transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
