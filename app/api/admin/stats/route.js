import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getUserFromRequest, requireRole } from "@/lib/auth";
import { fromKobo } from "@/lib/utils";

export async function GET(request) {
  const user = getUserFromRequest(request);
  const authError = requireRole(user, "admin");
  if (authError) return NextResponse.json({ error: authError.error }, { status: authError.status });

  try {
    const db = supabaseAdmin();

    const [tickets, vendors, sponsors, checkins] = await Promise.all([
      db.from("tickets").select("id, tier, price, quantity, status, created_at"),
      db.from("vendors").select("id, status"),
      db.from("sponsors").select("id, package, price, status"),
      db.from("checkins").select("id, day"),
    ]);

    const ticketData  = tickets.data  || [];
    const vendorData  = vendors.data  || [];
    const sponsorData = sponsors.data || [];
    const checkinData = checkins.data || [];

    // Ticket stats
    const ticketCount    = ticketData.reduce((sum, t) => sum + (t.quantity || 1), 0);
    const ticketRevenue  = ticketData.filter((t) => t.status !== "refunded").reduce((sum, t) => sum + fromKobo(t.price) * (t.quantity || 1), 0);
    const byTier = ticketData.reduce((acc, t) => {
      acc[t.tier] = (acc[t.tier] || 0) + (t.quantity || 1);
      return acc;
    }, { single: 0, full: 0, vip: 0, family: 0 });

    // Vendor stats
    const vendorRevenue   = 0; // pulled from vendor_bookings
    const vendorsApproved = vendorData.filter((v) => v.status === "approved").length;
    const vendorsPending  = vendorData.filter((v) => v.status === "pending").length;

    // Sponsor stats
    const approvedSponsors = sponsorData.filter((s) => s.status === "approved");
    const sponsorRevenue   = approvedSponsors.reduce((sum, s) => sum + (s.price ? fromKobo(s.price) : 0), 0);
    const sponsorsApproved = approvedSponsors.length;
    const sponsorsPending  = sponsorData.filter((s) => s.status === "pending").length;

    // Check-ins per day
    const checkinsByDay = checkinData.reduce((acc, c) => {
      const key = c.day?.replace(" ", "").toLowerCase().replace("-", "") || "dec23";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const totalRevenue = ticketRevenue + vendorRevenue + sponsorRevenue;
    const gross        = totalRevenue;
    const netRevenue   = gross - (gross * 0.015) - (gross * 0.075);

    return NextResponse.json({
      totalRevenue, ticketRevenue, vendorRevenue, sponsorRevenue, netRevenue,
      ticketCount, ticketCapacity: 500, byTier,
      vendorsApproved, vendorsPending,
      sponsorsApproved, sponsorsPending,
      checkins: {
        dec23: checkinsByDay.dec23 || 0,
        dec24: checkinsByDay.dec24 || 0,
        dec25: checkinsByDay.dec25 || 0,
        dec26: checkinsByDay.dec26 || 0,
      },
    });
  } catch (err) {
    console.error("[ADMIN STATS]", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
