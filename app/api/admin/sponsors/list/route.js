import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getUserFromRequest, requireRole } from "@/lib/auth";

export async function GET(request) {
  const user = getUserFromRequest(request);
  const err = requireRole(user, "admin");
  if (err) return NextResponse.json({ error: err.error }, { status: err.status });

  try {
    const db = supabaseAdmin();
    const { data: sponsors, error } = await db
      .from("sponsors")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ sponsors: sponsors || [] });
  } catch {
    return NextResponse.json({ error: "Failed to fetch sponsors" }, { status: 500 });
  }
}
