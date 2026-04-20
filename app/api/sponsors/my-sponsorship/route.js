import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = supabaseAdmin();
    const { data: sponsorship } = await db
      .from("sponsors")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json({ sponsorship: sponsorship || null });
  } catch {
    return NextResponse.json({ sponsorship: null });
  }
}

export async function PATCH(request) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { logo_url, brand_color, tagline } = await request.json();
    const db = supabaseAdmin();

    const { data: sponsorship } = await db
      .from("sponsors").select("id").eq("user_id", user.id).single();
    if (!sponsorship) return NextResponse.json({ error: "Sponsorship not found" }, { status: 404 });

    await db.from("sponsors")
      .update({ logo_url, brand_color, tagline, updated_at: new Date().toISOString() })
      .eq("id", sponsorship.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[SPONSOR PATCH]", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
