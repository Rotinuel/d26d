import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getUserFromRequest, requireRole } from "@/lib/auth";

// Simple email sender for bulk broadcasts
async function sendBulkEmail(emails, subject, message, fromName) {
  const SENDGRID_KEY = process.env.SENDGRID_API_KEY;
  if (!SENDGRID_KEY) {
    console.log(`[BROADCAST] Mock send to ${emails.length} recipients:`, subject);
    return emails.length;
  }

  // SendGrid supports up to 1000 recipients per call
  const chunks = [];
  for (let i = 0; i < emails.length; i += 1000) {
    chunks.push(emails.slice(i, i + 1000));
  }

  let sent = 0;
  for (const chunk of chunks) {
    const personalizations = chunk.map((email) => ({ to: [{ email }] }));
    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SENDGRID_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations,
        from: {
          email: process.env.EMAIL_FROM || "noreply@olambedetty.ng",
          name: fromName || "Olambe Detty December Carnival",
        },
        subject,
        content: [
          {
            type: "text/html",
            value: `
              <div style="background:#08080E;color:#EDEAF5;font-family:sans-serif;padding:40px;max-width:600px;margin:0 auto;border-radius:16px;">
                <h2 style="color:#F0B429;margin-bottom:16px;">Olambe Detty December Carnival 2025</h2>
                <div style="white-space:pre-wrap;line-height:1.7;color:#EDEAF5;">${message}</div>
                <hr style="border-color:#252338;margin:24px 0;" />
                <p style="color:#6B6B85;font-size:12px;">
                  Olambe Detty December Carnival · Dec 23–26, 2025 · Olambe, Ogun State<br/>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#F0B429;">Visit our website</a>
                </p>
              </div>
            `,
          },
        ],
      }),
    });
    if (res.ok) sent += chunk.length;
  }
  return sent;
}

// GET — fetch broadcast history
export async function GET(request) {
  const user = getUserFromRequest(request);
  const err = requireRole(user, "admin");
  if (err) return NextResponse.json({ error: err.error }, { status: err.status });

  try {
    const db = supabaseAdmin();
    const { data: broadcasts } = await db
      .from("broadcasts")
      .select("*")
      .order("sent_at", { ascending: false })
      .limit(50);

    return NextResponse.json({ broadcasts: broadcasts || [] });
  } catch {
    return NextResponse.json({ broadcasts: [] });
  }
}

// POST — send a new broadcast
export async function POST(request) {
  const user = getUserFromRequest(request);
  const err = requireRole(user, "admin");
  if (err) return NextResponse.json({ error: err.error }, { status: err.status });

  try {
    const { title, message, audience } = await request.json();
    if (!title?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Title and message are required" }, { status: 400 });
    }

    const db = supabaseAdmin();

    // Gather recipient emails based on audience
    let emails = [];

    if (audience === "all" || audience === "attendees") {
      const { data } = await db
        .from("users")
        .select("email")
        .eq("role", "attendee");
      emails.push(...(data || []).map((u) => u.email));
    }

    if (audience === "all" || audience === "vendors") {
      const { data } = await db
        .from("vendors")
        .select("email")
        .in("status", ["approved", "pending"]);
      emails.push(...(data || []).map((v) => v.email));
    }

    if (audience === "all" || audience === "sponsors") {
      const { data } = await db
        .from("sponsors")
        .select("email")
        .in("status", ["approved", "pending"]);
      emails.push(...(data || []).map((s) => s.email));
    }

    // Deduplicate
    emails = [...new Set(emails)];

    // Send emails
    const recipients = await sendBulkEmail(emails, title, message, "Olambe Detty December Carnival");

    // Log the broadcast
    const { data: broadcast } = await db
      .from("broadcasts")
      .insert({
        title,
        message,
        audience,
        sent_by: user.email,
        recipients,
      })
      .select()
      .single();

    return NextResponse.json({ success: true, recipients, broadcast });
  } catch (err) {
    console.error("[BROADCAST]", err);
    return NextResponse.json({ error: "Broadcast failed" }, { status: 500 });
  }
}
