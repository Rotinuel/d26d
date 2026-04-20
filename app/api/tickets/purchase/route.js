import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getUserFromRequest } from "@/lib/auth";
import { verifyPaystackTransaction } from "@/lib/paystack";
import { sendTicketConfirmation } from "@/lib/email";
import { generateQRData, toKobo } from "@/lib/utils";

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { reference, tier, tier_name, day, price, quantity = 1 } = await request.json();
    if (!reference || !tier || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = supabaseAdmin();

    // Check for duplicate reference
    const { data: existing } = await db.from("tickets").select("id").eq("paystack_ref", reference).single();
    if (existing) return NextResponse.json({ error: "This payment reference has already been used" }, { status: 409 });

    // Verify with Paystack
    const verification = await verifyPaystackTransaction(reference);
    if (!verification.data || verification.data.status !== "success") {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    const expectedAmount = toKobo(price * quantity);
    if (verification.data.amount < expectedAmount) {
      return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 });
    }

    // Get user details
    const { data: userData } = await db.from("users").select("name, email").eq("id", user.id).single();

    // Create ticket record
    const qr_data = generateQRData(`${user.id}_${reference}`, reference);
    const { data: ticket, error } = await db.from("tickets").insert({
      user_id: user.id,
      tier,
      tier_name,
      day,
      price: toKobo(price),
      quantity,
      paystack_ref: reference,
      qr_data,
      status: "valid",
    }).select().single();

    if (error) throw error;

    // Send confirmation email
    await sendTicketConfirmation({
      email: userData.email,
      name: userData.name,
      tickets: [{ tier_name, day, price: toKobo(price) }],
      total: price * quantity,
      ref: reference,
    });

    return NextResponse.json({ ticket, success: true }, { status: 201 });
  } catch (err) {
    console.error("[TICKET PURCHASE]", err);
    return NextResponse.json({ error: "Ticket issuance failed" }, { status: 500 });
  }
}
