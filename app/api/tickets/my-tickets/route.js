import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(request) {
  const user = getUserFromRequest(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const db = supabaseAdmin();
    const { data: tickets, error } = await db
      .from("tickets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ tickets: tickets || [] });
  } catch (err) {
    console.error("[MY TICKETS]", err);
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}
