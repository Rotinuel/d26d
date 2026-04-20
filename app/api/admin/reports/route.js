import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getUserFromRequest, requireRole } from "@/lib/auth";
import { fromKobo } from "@/lib/utils";

function toCSV(rows, headers) {
  const escape = (val) => {
    const str = String(val ?? "").replace(/"/g, '""');
    return str.includes(",") || str.includes("\n") || str.includes('"') ? `"${str}"` : str;
  };
  const header = headers.map(escape).join(",");
  const body = rows.map((row) => headers.map((h) => escape(row[h] ?? "")).join(",")).join("\n");
  return `${header}\n${body}`;
}

export async function GET(request) {
  const user = getUserFromRequest(request);
  const err = requireRole(user, "admin");
  if (err) return NextResponse.json({ error: err.error }, { status: err.status });

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "tickets";

  const db = supabaseAdmin();
  let csv = "";
  let filename = `oddc-${type}-${new Date().toISOString().split("T")[0]}.csv`;

  try {
    if (type === "tickets" || type === "attendees") {
      const { data } = await db
        .from("tickets")
        .select("*, users(name, email, phone)")
        .order("created_at", { ascending: false });

      const rows = (data || []).map((t) => ({
        Reference:    t.paystack_ref,
        Name:         t.users?.name || "",
        Email:        t.users?.email || "",
        Phone:        t.users?.phone || "",
        Tier:         t.tier_name,
        Day:          t.day,
        Quantity:     t.quantity || 1,
        "Amount (₦)": fromKobo(t.price) * (t.quantity || 1),
        Status:       t.status,
        "Checked In": t.checked_in_at ? new Date(t.checked_in_at).toLocaleString("en-NG") : "No",
        Date:         new Date(t.created_at).toLocaleString("en-NG"),
      }));
      csv = toCSV(rows, Object.keys(rows[0] || { Reference: "", Name: "" }));
    }

    else if (type === "vendors") {
      const { data } = await db
        .from("vendors")
        .select("*, vendor_bookings(slot_name, price, status, paystack_ref)")
        .order("created_at", { ascending: false });

      const rows = (data || []).map((v) => ({
        "Business Name":  v.biz_name,
        Category:         v.category,
        Email:            v.email,
        Phone:            v.phone,
        "CAC/RC":         v.rc_number || "",
        Status:           v.status,
        "Booked Slot":    v.vendor_bookings?.[0]?.slot_name || "None",
        "Slot Amount (₦)":v.vendor_bookings?.[0]?.price ? fromKobo(v.vendor_bookings[0].price) : 0,
        "Booking Status": v.vendor_bookings?.[0]?.status || "None",
        "Booking Ref":    v.vendor_bookings?.[0]?.paystack_ref || "",
        "Applied On":     new Date(v.created_at).toLocaleString("en-NG"),
      }));
      csv = toCSV(rows, Object.keys(rows[0] || {}));
    }

    else if (type === "sponsors") {
      const { data } = await db
        .from("sponsors")
        .select("*")
        .order("created_at", { ascending: false });

      const rows = (data || []).map((s) => ({
        Company:         s.company,
        Contact:         s.contact_name,
        Email:           s.email,
        Phone:           s.phone || "",
        Website:         s.website || "",
        Package:         s.package,
        "Amount (₦)":   s.price ? fromKobo(s.price) : "Custom",
        "Paystack Ref":  s.paystack_ref || "",
        Status:          s.status,
        "Logo URL":      s.logo_url || "",
        Tagline:         s.tagline || "",
        "Brand Color":   s.brand_color || "",
        "Applied On":    new Date(s.created_at).toLocaleString("en-NG"),
      }));
      csv = toCSV(rows, Object.keys(rows[0] || {}));
    }

    else if (type === "checkins") {
      const { data } = await db
        .from("checkins")
        .select("*, tickets(paystack_ref, tier_name, day, users(name, email))")
        .order("scanned_at", { ascending: false });

      const rows = (data || []).map((c) => ({
        "Ticket Ref":    c.tickets?.paystack_ref || "",
        "Attendee Name": c.tickets?.users?.name || "",
        Email:           c.tickets?.users?.email || "",
        Tier:            c.tickets?.tier_name || "",
        Day:             c.day,
        Gate:            c.gate || "Main Gate",
        "Scanned By":    c.scanned_by || "",
        "Scanned At":    new Date(c.scanned_at).toLocaleString("en-NG"),
      }));
      csv = toCSV(rows, Object.keys(rows[0] || {}));
    }

    else if (type === "revenue") {
      const [tickets, bookings, sponsors] = await Promise.all([
        db.from("tickets").select("tier_name, price, quantity, status, paystack_ref, created_at"),
        db.from("vendor_bookings").select("slot_name, price, status, paystack_ref, created_at"),
        db.from("sponsors").select("company, package, price, status, paystack_ref, created_at"),
      ]);

      const ticketRows = (tickets.data || []).map((t) => ({
        Stream: "Ticket", Description: t.tier_name,
        "Amount (₦)": fromKobo(t.price) * (t.quantity || 1),
        Reference: t.paystack_ref, Status: t.status,
        Date: new Date(t.created_at).toLocaleString("en-NG"),
      }));
      const vendorRows = (bookings.data || []).map((b) => ({
        Stream: "Vendor", Description: b.slot_name,
        "Amount (₦)": fromKobo(b.price),
        Reference: b.paystack_ref, Status: b.status,
        Date: new Date(b.created_at).toLocaleString("en-NG"),
      }));
      const sponsorRows = (sponsors.data || []).map((s) => ({
        Stream: "Sponsor", Description: `${s.company} — ${s.package}`,
        "Amount (₦)": s.price ? fromKobo(s.price) : "Custom",
        Reference: s.paystack_ref || "", Status: s.status,
        Date: new Date(s.created_at).toLocaleString("en-NG"),
      }));

      const rows = [...ticketRows, ...vendorRows, ...sponsorRows];
      csv = toCSV(rows, ["Stream", "Description", "Amount (₦)", "Reference", "Status", "Date"]);
    }

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error("[REPORTS]", err);
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
