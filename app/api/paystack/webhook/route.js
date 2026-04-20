import { NextResponse } from "next/server";
import { validateWebhookSignature } from "@/lib/paystack";
import { supabaseAdmin } from "@/lib/supabase";
import { generateQRData, toKobo } from "@/lib/utils";
import { sendTicketConfirmation } from "@/lib/email";

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    // Validate webhook signature
    if (!validateWebhookSignature(body, signature)) {
      console.warn("[WEBHOOK] Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    const { event: eventType, data } = event;

    console.log("[WEBHOOK] Received:", eventType, data?.reference);

    if (eventType === "charge.success") {
      const { reference, metadata, amount, customer } = data;
      const db = supabaseAdmin();

      // Check if already processed
      const { data: existingTicket } = await db
        .from("tickets").select("id").eq("paystack_ref", reference).single();
      const { data: existingBooking } = await db
        .from("vendor_bookings").select("id").eq("paystack_ref", reference).single();
      const { data: existingSponsorship } = await db
        .from("sponsors").select("id").eq("paystack_ref", reference).single();

      if (existingTicket || existingBooking || existingSponsorship) {
        console.log("[WEBHOOK] Already processed:", reference);
        return NextResponse.json({ received: true });
      }

      // Process based on metadata type
      if (metadata?.tier) {
        // Ticket purchase
        const { data: user } = await db
          .from("users").select("id, name, email").eq("email", customer.email.toLowerCase()).single();

        if (user) {
          const qr_data = generateQRData(`${user.id}_${reference}`, reference);
          await db.from("tickets").insert({
            user_id: user.id,
            tier: metadata.tier,
            tier_name: metadata.tier_name,
            day: metadata.day,
            price: amount,
            quantity: metadata.quantity || 1,
            paystack_ref: reference,
            qr_data,
            status: "valid",
          });

          await sendTicketConfirmation({
            email: user.email,
            name: user.name,
            tickets: [{ tier_name: metadata.tier_name, day: metadata.day, price: amount }],
            total: amount / 100,
            ref: reference,
          });
        }
      } else if (metadata?.slot_id) {
        // Vendor slot booking — update status to pending confirmed
        await db.from("vendor_bookings")
          .update({ status: "pending" })
          .eq("paystack_ref", reference);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[WEBHOOK ERROR]", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
