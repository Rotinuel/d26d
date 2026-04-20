import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getUserFromRequest } from "@/lib/auth";
import { hashPassword, signToken } from "@/lib/auth";
import { verifyPaystackTransaction } from "@/lib/paystack";
import { sendSponsorConfirmation } from "@/lib/email";
import { toKobo } from "@/lib/utils";
import { SPONSOR_PACKAGES } from "@/lib/constants";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      company, contact_name, email, phone, website, password,
      package: pkg, price, paystack_ref,
      logo_url, brand_color, tagline,
    } = body;

    if (!company || !contact_name || !email) {
      return NextResponse.json({ error: "Company name, contact name and email are required" }, { status: 400 });
    }

    const db = supabaseAdmin();
    let userId;

    // Check if user is already logged in
    const existingUser = getUserFromRequest(request);
    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create a new user account for this sponsor
      if (!password) return NextResponse.json({ error: "Password is required to create your sponsor account" }, { status: 400 });
      if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });

      const { data: existingEmail } = await db.from("users").select("id").eq("email", email.toLowerCase()).single();
      if (existingEmail) {
        // Use existing account
        userId = existingEmail.id;
      } else {
        const password_hash = await hashPassword(password);
        const { data: newUser, error: userErr } = await db
          .from("users")
          .insert({ name: contact_name, email: email.toLowerCase(), phone, password_hash, role: "sponsor" })
          .select().single();
        if (userErr) throw userErr;
        userId = newUser.id;
      }
    }

    // Verify payment if reference provided (not title sponsor)
    if (paystack_ref && price) {
      const verification = await verifyPaystackTransaction(paystack_ref);
      if (!verification.data || verification.data.status !== "success") {
        return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
      }
      if (verification.data.amount < toKobo(price)) {
        return NextResponse.json({ error: "Payment amount mismatch" }, { status: 400 });
      }
    }

    // Create sponsor record
    const pkgName = SPONSOR_PACKAGES.find((p) => p.id === pkg)?.name || pkg;
    const { data: sponsor, error } = await db.from("sponsors").insert({
      user_id: userId, company, contact_name,
      email: email.toLowerCase(), phone, website,
      package: pkg, price: price ? toKobo(price) : null,
      paystack_ref: paystack_ref || null,
      logo_url, brand_color, tagline,
      status: "pending",
    }).select().single();

    if (error) throw error;

    // Send confirmation
    await sendSponsorConfirmation({ email, company, packageName: pkgName });

    // Issue JWT if new user
    let token;
    if (!getUserFromRequest(request)) {
      token = signToken({ id: userId, name: contact_name, email: email.toLowerCase(), role: "sponsor" });
    }

    const response = NextResponse.json({ sponsor, success: true }, { status: 201 });
    if (token) {
      response.cookies.set("oddc_token", token, {
        httpOnly: true, secure: process.env.NODE_ENV === "production",
        sameSite: "lax", maxAge: 60 * 60 * 24 * 7, path: "/",
      });
    }
    return response;
  } catch (err) {
    console.error("[SPONSOR APPLY]", err);
    return NextResponse.json({ error: "Sponsorship application failed" }, { status: 500 });
  }
}
