import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getUserFromRequest, requireRole } from "@/lib/auth";
import { sendVendorApproval } from "@/lib/email";

export async function POST(request) {
  const user = getUserFromRequest(request);
  const err = requireRole(user, "admin");
  if (err) return NextResponse.json({ error: err.error }, { status: err.status });

  try {
    const { vendor_id, notes } = await request.json();
    if (!vendor_id) return NextResponse.json({ error: "vendor_id required" }, { status: 400 });

    const db = supabaseAdmin();
    const { data: vendor, error } = await db
      .from("vendors")
      .update({ status: "approved", reviewed_by: user.email, reviewed_at: new Date().toISOString(), notes })
      .eq("id", vendor_id)
      .select()
      .single();

    if (error) throw error;

    // Also confirm any pending bookings for this vendor
    await db.from("vendor_bookings")
      .update({ status: "confirmed" })
      .eq("vendor_id", vendor_id)
      .eq("status", "pending");

    // Send email
    const { data: booking } = await db
      .from("vendor_bookings").select("slot_name").eq("vendor_id", vendor_id).single();
    await sendVendorApproval({ email: vendor.email, bizName: vendor.biz_name, slotName: booking?.slot_name, approved: true });

    return NextResponse.json({ success: true, vendor });
  } catch (err) {
    console.error("[VENDOR APPROVE]", err);
    return NextResponse.json({ error: "Approval failed" }, { status: 500 });
  }
}
