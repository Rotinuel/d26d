const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE = "https://api.paystack.co";

// Verify a transaction reference
export async function verifyPaystackTransaction(reference) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
  });
  return res.json();
}

// Initialize a transaction (server-side)
export async function initializeTransaction({ email, amount, reference, metadata, callback_url }) {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, amount, reference, metadata, callback_url }),
  });
  return res.json();
}

// Refund a transaction
export async function refundTransaction(reference, amount) {
  const res = await fetch(`${PAYSTACK_BASE}/refund`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ transaction: reference, amount }),
  });
  return res.json();
}

// Generate a unique ref
export function generateRef(prefix = "ODDC") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

// Validate Paystack webhook signature
import crypto from "crypto";
export function validateWebhookSignature(body, signature) {
  const hash = crypto
    .createHmac("sha512", PAYSTACK_SECRET)
    .update(body)
    .digest("hex");
  return hash === signature;
}
