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
      .update({
        status: "rejected",
        reviewed_by: user.email,
        reviewed_at: new Date().toISOString(),
        notes: notes || null,
      })
      .eq("id", vendor_id)
      .select()
      .single();

    if (error) throw error;

    // Reject any pending bookings too
    await db
      .from("vendor_bookings")
      .update({ status: "rejected" })
      .eq("vendor_id", vendor_id)
      .eq("status", "pending");

    await sendVendorApproval({
      email: vendor.email,
      bizName: vendor.biz_name,
      slotName: null,
      approved: false,
    });

    return NextResponse.json({ success: true, vendor });
  } catch (err) {
    console.error("[VENDOR REJECT]", err);
    return NextResponse.json({ error: "Rejection failed" }, { status: 500 });
  }
}
