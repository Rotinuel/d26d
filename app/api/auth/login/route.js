import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

<<<<<<< HEAD
    const db = supabaseAdmin();
=======
    let db;
    try {
      db = supabaseAdmin();
    } catch {
      return NextResponse.json(
        { error: "Database not configured. Please set up your .env.local file." },
        { status: 503 }
      );
    }
>>>>>>> e1d658b01c6caaf9506d7b7dfaf871069195ae70
    const { data: user, error } = await db
      .from("users")
      .select("id, name, email, phone, password_hash, role")
      .eq("email", email.toLowerCase())
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = signToken({ id: user.id, name: user.name, email: user.email, role: user.role });

    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    });

    response.cookies.set("oddc_token", token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production",
      sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/",
    });

    return response;
  } catch (err) {
    console.error("[LOGIN]", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
