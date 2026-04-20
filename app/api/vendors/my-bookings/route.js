import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = supabaseAdmin();

    const { data: vendor } = await db
      .from("vendors")
      .select("*")
      .eq("user_id", user.id)
      .single();

    let bookings = [];
    if (vendor) {
      const { data } = await db
        .from("vendor_bookings")
        .select("*")
        .eq("vendor_id", vendor.id)
        .order("created_at", { ascending: false });
      bookings = data || [];
    }

    return NextResponse.json({ vendor, bookings });
  } catch (err) {
    console.error("[MY BOOKINGS]", err);
    return NextResponse.json({ error: "Failed to fetch vendor data" }, { status: 500 });
  }
}
