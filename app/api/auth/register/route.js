import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { hashPassword, signToken } from "@/lib/auth";
import { sendVendorApplicationConfirmation } from "@/lib/email";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, password, role = "attendee", biz_name, category, rc_number, description, logo_url } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const db = supabaseAdmin();

    // Check existing user
    const { data: existing } = await db.from("users").select("id").eq("email", email.toLowerCase()).single();
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Create user
    const { data: user, error: userError } = await db
      .from("users")
      .insert({ name, email: email.toLowerCase(), phone, password_hash, role })
      .select()
      .single();

    if (userError) throw userError;

    // If vendor — create vendor record
    if (role === "vendor") {
      if (!biz_name || !description) {
        return NextResponse.json({ error: "Business name and description required for vendor registration" }, { status: 400 });
      }
      const { error: vendorError } = await db.from("vendors").insert({
        user_id: user.id, biz_name, email: email.toLowerCase(), phone, category, rc_number, description, logo_url, status: "pending",
      });
      if (vendorError) throw vendorError;

      // Send confirmation email
      await sendVendorApplicationConfirmation({ email, bizName: biz_name });
    }

    // Sign token
    const token = signToken({ id: user.id, name: user.name, email: user.email, role: user.role });

    const response = NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
    }, { status: 201 });

    response.cookies.set("oddc_token", token, {
      httpOnly: true, secure: process.env.NODE_ENV === "production",
      sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/",
    });

    return response;
  } catch (err) {
    console.error("[REGISTER]", err);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
