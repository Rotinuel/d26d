import { clsx } from "clsx";

// Merge Tailwind classes safely
export function cn(...inputs) {
  return clsx(inputs);
}

// Format naira
export function naira(amount) {
  return `₦${Number(amount).toLocaleString("en-NG")}`;
}

// Generate QR data string for a ticket
export function generateQRData(ticketId, ref) {
  return `ODDC2025|${ticketId}|${ref}`;
}

// Generate QR code URL (using free QR API — replace with self-hosted in production)
export function qrUrl(data) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
}

// Generate unique payment reference
export function generateRef(prefix = "ODDC") {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

// Format date nicely
export function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Truncate string
export function truncate(str, n = 40) {
  return str?.length > n ? str.slice(0, n) + "…" : str;
}

// Convert naira to kobo for Paystack
export function toKobo(nairaAmount) {
  return Math.round(nairaAmount * 100);
}

// Convert kobo to naira
export function fromKobo(kobo) {
  return kobo / 100;
}

// Status color mapping
export const statusColor = {
  pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  approved: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  confirmed: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  rejected: "text-red-400 bg-red-400/10 border-red-400/30",
  valid: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
  used: "text-purple-400 bg-purple-400/10 border-purple-400/30",
  refunded: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  cancelled: "text-red-400 bg-red-400/10 border-red-400/30",
  suspended: "text-orange-400 bg-orange-400/10 border-orange-400/30",
};
