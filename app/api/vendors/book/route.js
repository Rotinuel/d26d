import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getUserFromRequest } from "@/lib/auth";
import { verifyPaystackTransaction } from "@/lib/paystack";
import { toKobo } from "@/lib/utils";

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { reference, slot_type_id, slot_name, price } = await request.json();
    if (!reference || !slot_type_id || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = supabaseAdmin();

    // Get vendor record
    const { data: vendor } = await db.from("vendors").select("id, status").eq("user_id", user.id).single();
    if (!vendor) return NextResponse.json({ error: "Vendor account not found" }, { status: 404 });
    if (vendor.status === "rejected") return NextResponse.json({ error: "Vendor application was rejected" }, { status: 403 });

    // Check for duplicate reference
    const { data: existing } = await db.from("vendor_bookings").select("id").eq("paystack_ref", reference).single();
    if (existing) return NextResponse.json({ error: "Payment reference already used" }, { status: 409 });

    // Verify payment with Paystack
    const verification = await verifyPaystackTransaction(reference);
    if (!verification.data || verification.data.status !== "success") {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    if (verification.data.amount < toKobo(price)) {
      return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 });
    }

    // Create booking
    const { data: booking, error } = await db.from("vendor_bookings").insert({
      vendor_id: vendor.id, slot_type_id, slot_name, price: toKobo(price),
      paystack_ref: reference, status: "pending",
    }).select().single();

    if (error) throw error;

    // Increment booked count on slot_type
    await db.rpc("increment_slot_booked", { slot_id: slot_type_id });

    return NextResponse.json({ booking, success: true }, { status: 201 });
  } catch (err) {
    console.error("[VENDOR BOOK]", err);
    return NextResponse.json({ error: "Slot booking failed" }, { status: 500 });
  }
}
