import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getUserFromRequest, requireRole } from "@/lib/auth";

export async function POST(request) {
  const user = getUserFromRequest(request);
  const err = requireRole(user, "admin");
  if (err) return NextResponse.json({ error: err.error }, { status: err.status });

  try {
    const { reference, day } = await request.json();
    if (!reference || !day) {
      return NextResponse.json({ error: "Reference and day are required" }, { status: 400 });
    }

    const db = supabaseAdmin();

    // Look up ticket by paystack_ref OR by qr_data containing the reference
    const { data: ticket, error } = await db
      .from("tickets")
      .select("*, users(name, email, phone)")
      .or(`paystack_ref.eq.${reference},qr_data.ilike.%${reference}%`)
      .single();

    if (error || !ticket) {
      return NextResponse.json({ valid: false, error: "Ticket not found. Invalid reference." }, { status: 404 });
    }

    // Check ticket status
    if (ticket.status === "cancelled") {
      return NextResponse.json({ valid: false, error: "This ticket has been cancelled." });
    }
    if (ticket.status === "refunded") {
      return NextResponse.json({ valid: false, error: "This ticket has been refunded." });
    }

    // Check if ticket covers this day
    const ticketCoversDay =
      ticket.day === "Dec 23–26" ||
      ticket.day === day ||
      ticket.day.includes(day.replace("Dec ", ""));

    if (!ticketCoversDay) {
      return NextResponse.json({
        valid: false,
        error: `This ticket is only valid for ${ticket.day}, not ${day}.`,
        ticket,
      });
    }

    // Check for duplicate scan on same day (single-entry per day)
    const { data: existingCheckin } = await db
      .from("checkins")
      .select("id")
      .eq("ticket_id", ticket.id)
      .eq("day", day)
      .single();

    if (existingCheckin) {
      return NextResponse.json({
        valid: false,
        error: `Already checked in on ${day}. Duplicate entry denied.`,
        ticket,
      });
    }

    // Record the check-in
    await db.from("checkins").insert({
      ticket_id: ticket.id,
      day,
      gate: "Main Gate",
      scanned_by: user.email,
    });

    // Mark ticket as used if single-day pass
    if (ticket.tier === "single") {
      await db.from("tickets").update({ status: "used", checked_in_at: new Date().toISOString(), checked_in_by: user.email }).eq("id", ticket.id);
    }

    return NextResponse.json({
      valid: true,
      message: `Welcome, ${ticket.users?.name || "Guest"}! Enjoy ${day} 🎉`,
      ticket,
    });
  } catch (err) {
    console.error("[CHECKIN SCAN]", err);
    return NextResponse.json({ valid: false, error: "Scan failed. Try again." }, { status: 500 });
  }
}
