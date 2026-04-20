import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getUserFromRequest, requireRole } from "@/lib/auth";

export async function POST(request) {
  const user = getUserFromRequest(request);
  const err = requireRole(user, "admin");
  if (err) return NextResponse.json({ error: err.error }, { status: err.status });

  try {
    const { sponsor_id } = await request.json();
    if (!sponsor_id) return NextResponse.json({ error: "sponsor_id required" }, { status: 400 });

    const db = supabaseAdmin();
    const { data: sponsor, error } = await db
      .from("sponsors")
      .update({
        status: "approved",
        reviewed_by: user.email,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", sponsor_id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, sponsor });
  } catch (err) {
    console.error("[SPONSOR APPROVE]", err);
    return NextResponse.json({ error: "Approval failed" }, { status: 500 });
  }
}
