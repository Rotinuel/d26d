"use client";
import { useEffect, useCallback } from "react";

export function usePaystack() {
  useEffect(() => {
    // Load Paystack inline JS
    if (!document.getElementById("paystack-js")) {
      const script = document.createElement("script");
      script.id = "paystack-js";
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const pay = useCallback(({ email, amount, reference, metadata = {}, onSuccess, onClose }) => {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined" || !window.PaystackPop) {
        // Fallback: redirect mode
        reject(new Error("Paystack not loaded"));
        return;
      }

      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email,
        amount: Math.round(amount * 100), // kobo
        currency: "NGN",
        ref: reference,
        metadata,
        channels: ["card", "bank", "ussd", "bank_transfer", "mobile_money", "qr"],
        callback: (response) => {
          onSuccess?.(response);
          resolve(response);
        },
        onClose: () => {
          onClose?.();
          reject(new Error("Payment closed"));
        },
      });

      handler.openIframe();
    });
  }, []);

  return { pay };
}
