import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getUserFromRequest, requireRole } from "@/lib/auth";

export async function GET(request) {
  const user = getUserFromRequest(request);
  const err = requireRole(user, "admin");
  if (err) return NextResponse.json({ error: err.error }, { status: err.status });

  try {
    const db = supabaseAdmin();
    const { data: tickets, error } = await db
      .from("tickets")
      .select("*, users(name, email)")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ tickets: tickets || [] });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}
