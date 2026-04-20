const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.EMAIL_FROM || "noreply@olambedetty.ng";
const FROM_NAME = process.env.EMAIL_FROM_NAME || "Olambe Detty December Carnival";

async function sendEmail({ to, subject, html }) {
  if (!SENDGRID_API_KEY) {
    console.log("[EMAIL] SendGrid not configured. Would send to:", to, subject);
    return { ok: true, mock: true };
  }

  const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SENDGRID_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: FROM_EMAIL, name: FROM_NAME },
      subject,
      content: [{ type: "text/html", value: html }],
    }),
  });

  return { ok: res.ok, status: res.status };
}

// ─── EMAIL TEMPLATES ──────────────────────────────────────────────────────────

export async function sendTicketConfirmation({ email, name, tickets, total, ref }) {
  const ticketRows = tickets
    .map(
      (t) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #252338;">${t.tier_name}</td>
        <td style="padding:8px;border-bottom:1px solid #252338;">${t.day}</td>
        <td style="padding:8px;border-bottom:1px solid #252338;">₦${Number(t.price / 100).toLocaleString()}</td>
      </tr>`
    )
    .join("");

  return sendEmail({
    to: email,
    subject: "🎊 Your Tickets for Olambe Detty December Carnival",
    html: `
      <div style="background:#08080E;color:#EDEAF5;font-family:sans-serif;padding:40px;border-radius:16px;max-width:600px;margin:0 auto;">
        <h1 style="color:#F0B429;font-size:28px;margin-bottom:8px;">You're In, ${name.split(" ")[0]}! 🎉</h1>
        <p style="color:#6B6B85;margin-bottom:24px;">Your tickets for <strong style="color:#EDEAF5;">Olambe Detty December Carnival</strong> are confirmed.</p>
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
          <thead>
            <tr style="background:#17161F;">
              <th style="padding:10px 8px;text-align:left;color:#6B6B85;font-size:12px;text-transform:uppercase;">Tier</th>
              <th style="padding:10px 8px;text-align:left;color:#6B6B85;font-size:12px;text-transform:uppercase;">Date</th>
              <th style="padding:10px 8px;text-align:left;color:#6B6B85;font-size:12px;text-transform:uppercase;">Price</th>
            </tr>
          </thead>
          <tbody>${ticketRows}</tbody>
        </table>
        <div style="background:#17161F;border-radius:12px;padding:16px;margin-bottom:24px;">
          <p style="color:#6B6B85;margin:0 0 4px;font-size:12px;">Payment Reference</p>
          <p style="font-family:monospace;color:#F0B429;margin:0;">${ref}</p>
        </div>
        <p style="color:#6B6B85;font-size:13px;">Log in to your dashboard to view your QR code tickets. Present them at the gate on event day.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/attendee/dashboard" style="display:inline-block;background:#F0B429;color:#08080E;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:16px;">View My Tickets</a>
        <p style="color:#252338;font-size:11px;margin-top:32px;">Olambe Detty December Carnival · Dec 23-26, 2025 · Olambe, Ogun State</p>
      </div>
    `,
  });
}

export async function sendVendorApplicationConfirmation({ email, bizName }) {
  return sendEmail({
    to: email,
    subject: "📋 Vendor Application Received — Olambe Detty December Carnival",
    html: `
      <div style="background:#08080E;color:#EDEAF5;font-family:sans-serif;padding:40px;border-radius:16px;max-width:600px;margin:0 auto;">
        <h1 style="color:#F0B429;font-size:24px;">Application Received! 🏪</h1>
        <p>Hi <strong>${bizName}</strong>,</p>
        <p style="color:#6B6B85;">We've received your vendor application for the Olambe Detty December Carnival. Our team will review it within 48 hours.</p>
        <p style="color:#6B6B85;">Once approved, you'll receive a confirmation email with your slot details, setup times, and vendor guidelines.</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/vendor/dashboard" style="display:inline-block;background:#F0B429;color:#08080E;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:16px;">Check Application Status</a>
      </div>
    `,
  });
}

export async function sendVendorApproval({ email, bizName, slotName, approved }) {
  return sendEmail({
    to: email,
    subject: approved
      ? "✅ Vendor Application Approved — Olambe Detty December Carnival"
      : "❌ Vendor Application Update — Olambe Detty December Carnival",
    html: `
      <div style="background:#08080E;color:#EDEAF5;font-family:sans-serif;padding:40px;border-radius:16px;max-width:600px;margin:0 auto;">
        <h1 style="color:${approved ? "#10B981" : "#FF6348"};font-size:24px;">${approved ? "Congratulations! 🎉" : "Application Update"}</h1>
        <p>Hi <strong>${bizName}</strong>,</p>
        ${
          approved
            ? `<p style="color:#6B6B85;">Your vendor application has been <strong style="color:#10B981;">approved</strong>! Your slot: <strong>${slotName}</strong>.</p>
               <p style="color:#6B6B85;">Please ensure you arrive at the venue by 8:00 AM on Dec 23 for setup. Your booth location details will follow in a separate email.</p>`
            : `<p style="color:#6B6B85;">Unfortunately, your vendor application was not approved at this time. This may be due to slot capacity or category limits.</p>
               <p style="color:#6B6B85;">Please contact us at vendors@olambedetty.ng to discuss alternatives.</p>`
        }
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/vendor/dashboard" style="display:inline-block;background:#F0B429;color:#08080E;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:16px;">View Dashboard</a>
      </div>
    `,
  });
}

export async function sendSponsorConfirmation({ email, company, packageName }) {
  return sendEmail({
    to: email,
    subject: "🤝 Sponsorship Confirmed — Olambe Detty December Carnival",
    html: `
      <div style="background:#08080E;color:#EDEAF5;font-family:sans-serif;padding:40px;border-radius:16px;max-width:600px;margin:0 auto;">
        <h1 style="color:#F0B429;font-size:24px;">Welcome Aboard, ${company}! 🎊</h1>
        <p style="color:#6B6B85;">Your <strong style="color:#EDEAF5;">${packageName} Sponsorship</strong> for Olambe Detty December Carnival has been received.</p>
        <p style="color:#6B6B85;">Our partnership team will reach out within 48 hours to discuss brand placement, asset submissions, and activation logistics.</p>
        <p style="color:#6B6B85;"><strong>Brand asset submission deadline: December 5, 2025</strong></p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/sponsor/dashboard" style="display:inline-block;background:#F0B429;color:#08080E;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:16px;">View Sponsor Dashboard</a>
      </div>
    `,
  });
}
