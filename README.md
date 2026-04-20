# 🎊 Olambe Detty December Carnival — Event Platform

> **Dec 23–26, 2025 · Olambe, Ogun State, Nigeria**

A full-stack Next.js 16 event management platform with four distinct portals — Attendees, Vendors, Sponsors, and Admin — with payments powered entirely by **Paystack** in Nigerian Naira (₦).

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Portals & Features](#portals--features)
5. [Getting Started](#getting-started)
6. [Environment Variables](#environment-variables)
7. [Database Setup](#database-setup)
8. [Paystack Integration](#paystack-integration)
9. [Pricing](#pricing)
10. [Email Setup](#email-setup)
11. [Deployment](#deployment)
12. [Admin Access](#admin-access)
13. [Next.js 16 Notes](#nextjs-16-notes)
14. [Nigeria Compliance](#nigeria-compliance)
15. [Contact](#contact)

---

## Overview

The Olambe Detty December Carnival platform handles the full event lifecycle:

| Portal | Who Uses It | Key Purpose |
|---|---|---|
| **Public Landing** | Everyone | Event info, countdown, schedule, ticket CTA |
| **Attendee Portal** | Ticket buyers | Register, buy tickets, view QR codes |
| **Vendor Portal** | Vendors / businesses | Apply, book booth slots, pay, track status |
| **Sponsor Portal** | Brand partners | Choose package, pay, submit brand assets |
| **Admin Dashboard** | Event organizers | Approvals, KPIs, check-in, reports, broadcast |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | **Next.js 16.1** (App Router, Turbopack) |
| Language | **JavaScript** (no TypeScript) |
| Styling | **Tailwind CSS v3** |
| Database | **Supabase** (PostgreSQL + RLS) |
| Auth | Custom JWT (httpOnly cookies) + `bcryptjs` |
| Payments | **Paystack** (card, bank transfer, USSD, Verve) |
| Email | **SendGrid** transactional API |
| SMS/OTP | **Termii** (Nigerian provider) |
| QR Codes | `qrcode` npm + `api.qrserver.com` (dev) |
| Hosting | **Vercel** (recommended) |

---

## Project Structure

```
olambe-detty-december/
├── app/
│   ├── layout.js                  # Root layout — AuthProvider, ToastProvider, Navbar, Footer
│   ├── page.js                    # Public landing page
│   ├── not-found.js               # 404 page
│   ├── error.js                   # Error boundary
│   ├── globals.css                # Global styles + Tailwind directives
│   │
│   ├── login/page.js              # Unified login for all roles
│   │
│   ├── attendee/
│   │   └── dashboard/page.js      # Buy tickets, view QR codes
│   │
│   ├── vendor/
│   │   ├── apply/page.js          # Vendor registration + login
│   │   └── dashboard/page.js      # Slot booking, booking status
│   │
│   ├── sponsor/
│   │   ├── packages/page.js       # Public sponsorship packages
│   │   └── dashboard/page.js      # Brand assets, sponsorship status
│   │
│   ├── admin/
│   │   ├── layout.js              # Admin sidebar + mobile tab bar
│   │   ├── dashboard/page.js      # KPIs, revenue breakdown, charts
│   │   ├── tickets/page.js        # Ticket table + search + filter
│   │   ├── vendors/page.js        # Approve/reject applications
│   │   ├── sponsors/page.js       # Approve/reject + asset preview
│   │   ├── checkin/page.js        # Gate scanner + per-day counts
│   │   ├── reports/page.js        # Financial summary + CSV exports
│   │   └── broadcast/page.js      # Send emails to audience segments
│   │
│   └── api/
│       ├── auth/
│       │   ├── register/route.js  # POST — create account
│       │   ├── login/route.js     # POST — sign in
│       │   ├── me/route.js        # GET — current user
│       │   └── logout/route.js    # POST — clear cookie
│       ├── tickets/
│       │   ├── purchase/route.js  # POST — verify Paystack + issue ticket
│       │   └── my-tickets/route.js # GET — attendee's tickets
│       ├── vendors/
│       │   ├── my-bookings/route.js # GET — vendor + bookings
│       │   └── book/route.js      # POST — verify Paystack + book slot
│       ├── sponsors/
│       │   ├── apply/route.js     # POST — submit sponsorship
│       │   └── my-sponsorship/route.js # GET/PATCH — view + update assets
│       ├── paystack/
│       │   └── webhook/route.js   # POST — Paystack event handler
│       └── admin/
│           ├── stats/route.js     # GET — dashboard KPIs
│           ├── tickets/route.js   # GET — all tickets
│           ├── vendors/
│           │   ├── list/route.js  # GET — all vendors
│           │   ├── approve/route.js # POST
│           │   └── reject/route.js  # POST
│           ├── sponsors/
│           │   ├── list/route.js  # GET — all sponsors
│           │   ├── approve/route.js # POST
│           │   └── reject/route.js  # POST
│           ├── checkin/
│           │   └── scan/route.js  # POST — validate + record entry
│           ├── broadcast/route.js # GET history / POST send
│           └── reports/route.js   # GET — CSV export
│
├── components/
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Input.jsx              # Input + Select
│   │   ├── Card.jsx
│   │   ├── Badge.jsx              # Status-aware + color-aware
│   │   ├── Modal.jsx
│   │   ├── Toast.jsx              # ToastProvider + useToast hook
│   │   ├── Spinner.jsx            # Spinner + PageLoader
│   │   └── StatCard.jsx
│   ├── layout/
│   │   ├── Navbar.jsx             # Sticky nav, role-aware links, mobile menu
│   │   └── Footer.jsx
│   └── sections/
│       ├── Countdown.jsx          # Live countdown to Dec 23
│       └── TicketCard.jsx         # Landing page ticket tier card
│
├── hooks/
│   ├── useAuth.js                 # AuthContext + AuthProvider
│   └── usePaystack.js             # Paystack popup hook
│
├── lib/
│   ├── constants.js               # All event data, tiers, schedule, pricing
│   ├── supabase.js                # Browser + admin clients
│   ├── auth.js                    # JWT sign/verify, bcrypt helpers
│   ├── paystack.js                # Paystack API helpers + webhook validator
│   ├── email.js                   # SendGrid email templates
│   └── utils.js                   # naira(), cn(), QR helpers, formatDate
│
├── proxy.js                       # Next.js 16 route protection (replaces middleware.ts)
├── next.config.js
├── tailwind.config.js
├── postcss.config.mjs
├── supabase-schema.sql            # Full DB schema — run in Supabase SQL editor
├── .env.local.example
└── package.json
```

---

## Portals & Features

### 🌐 Public Landing Page (`/`)
- Animated hero with live countdown to Dec 23
- Event stats bar
- All 4 ticket tiers with perks and buy buttons
- Interactive 4-day schedule with day switcher
- Vendor and Sponsor CTAs
- Sponsors showcase section
- Contact / WhatsApp links

### 🎟️ Attendee Portal (`/attendee/dashboard`)
- Register / login with email + password
- Browse all 4 ticket tiers
- Select quantity (up to 10) and day (for single-day pass)
- Pay with Paystack — card, bank transfer, USSD, Verve, mobile money
- QR code generated per ticket (scannable at gate)
- Full ticket dashboard with modal view per ticket
- Confirmation email sent automatically

### 🏪 Vendor Portal (`/vendor/apply`, `/vendor/dashboard`)
- Register with business name, category, CAC number, description
- Application submitted for admin review
- Browse 4 slot types with size, power, includes breakdown
- Pay for slot via Paystack (blocked if application pending)
- Track booking status (pending → confirmed)
- Confirmation email on approval/rejection

### 🤝 Sponsor Portal (`/sponsor/packages`, `/sponsor/dashboard`)
- Public packages page with Bronze, Silver, Gold, Title tiers
- Inline sponsorship form with company + contact details
- Pay via Paystack (Title Sponsor submits custom inquiry)
- Submit brand assets: logo URL, tagline, brand colour picker
- Dashboard shows package perks, payment reference, asset form
- Asset submission deadline enforced (Dec 5)

### 🛠️ Admin Dashboard (`/admin/*`)

| Tab | What It Does |
|---|---|
| **Overview** | Revenue KPIs, ticket breakdown bars, check-in counts per day |
| **Tickets** | Searchable/filterable table of all sales + export |
| **Vendors** | Full application list with approve/reject + booking details |
| **Sponsors** | Brand asset preview (logo, colour, tagline) + approve/reject |
| **Check-In** | Manual reference entry, per-day counters, recent scan log |
| **Reports** | Financial summary (gross/VAT/net) + 6 CSV download cards |
| **Broadcast** | Compose emails to all/attendees/vendors/sponsors + history |

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-org/olambe-detty-december
cd olambe-detty-december
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
# Fill in all values — see Environment Variables section below
```

### 3. Set up Supabase database

```bash
# In your Supabase project → SQL Editor → paste contents of:
cat supabase-schema.sql
```

### 4. Create your first admin account

Run this SQL in Supabase after creating your account through the registration endpoint:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-admin@email.com';
```

Or use the Supabase dashboard to update the role column directly.

### 5. Start development server

```bash
npm run dev
# Opens on http://localhost:3000 with Turbopack (Next.js 16)
```

---

## Environment Variables

Create `.env.local` from the example file:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Olambe Detty December Carnival"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Paystack
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxx
PAYSTACK_SECRET_KEY=sk_test_xxx

# Auth
JWT_SECRET=your-minimum-32-character-secret-key

# Email (SendGrid)
SENDGRID_API_KEY=SG.xxx
EMAIL_FROM=noreply@olambedetty.ng
EMAIL_FROM_NAME="Olambe Detty December Carnival"

# SMS (Termii - Nigerian provider)
TERMII_API_KEY=TLxxx
TERMII_SENDER_ID=OlambeDetty

# Admin
ADMIN_SECRET_KEY=your-admin-registration-secret
```

> ⚠️ Never commit `.env.local` to version control. It is already in `.gitignore`.

---

## Database Setup

Run `supabase-schema.sql` in your Supabase SQL editor. It creates:

| Table | Purpose |
|---|---|
| `users` | All users (attendees, vendors, sponsors, admins) |
| `tickets` | Purchased tickets with QR data and status |
| `vendors` | Vendor applications and business details |
| `slot_types` | Available vendor slot configurations |
| `vendor_bookings` | Paid slot bookings linked to vendors |
| `sponsors` | Sponsor applications and brand assets |
| `checkins` | Gate entry log per ticket per day |
| `broadcasts` | Sent broadcast email history |

All tables have Row Level Security (RLS) enabled. For production, tighten the RLS policies to restrict reads by `user_id`.

---

## Paystack Integration

### Account Setup

1. Create account at [dashboard.paystack.com](https://dashboard.paystack.com)
2. Complete KYC — upload your CAC documents to increase transaction limits
3. Copy **Public Key** (frontend) and **Secret Key** (backend — never expose this)

### Payment Flow

```
User clicks Pay
      ↓
usePaystack hook opens PaystackPop.setup() popup
      ↓
User pays (card / bank / USSD / Verve / mobile money)
      ↓
Paystack calls onSuccess callback with { reference }
      ↓
Frontend calls /api/tickets/purchase (or /vendors/book, /sponsors/apply)
      ↓
API calls Paystack /transaction/verify/:reference
      ↓
On success → record in Supabase → send confirmation email
```

### Webhook Setup

In your Paystack dashboard → **Settings → API Keys & Webhooks**:

- Webhook URL: `https://yourdomain.com/api/paystack/webhook`
- Events to subscribe: `charge.success`, `transfer.success`, `refund.processed`

The webhook handler at `app/api/paystack/webhook/route.js` validates the HMAC-SHA512 signature before processing any event.

### Supported Payment Methods

| Method | Notes |
|---|---|
| Card | Visa, Mastercard, Verve |
| Bank Transfer | Real-time confirmation |
| USSD | `*737#`, `*901#`, and more |
| Pay with Bank | Direct account debit |
| Mobile Money | MTN MoMo |
| QR Code | Scan-to-pay |

### Fees

- **1.5%** per transaction, capped at **₦2,000**
- **VAT 7.5%** on Paystack fees
- International cards: additional 3.9% + ₦100

---

## Pricing

### Ticket Tiers

| Tier | Price | Coverage |
|---|---|---|
| Single Day Pass | ₦5,000 | 1 day of choice |
| Full Festival Pass | ₦15,000 | Dec 23–26 (all 4 days) |
| VIP Pass | ₦35,000 | All 4 days + VIP perks |
| Family Bundle | ₦25,000 | 2 adults + 2 children, all 4 days |

### Vendor Slots

| Slot | Price | Size | Power |
|---|---|---|---|
| Standard Booth (Per Day) | ₦30,000 | 3×3m | 1 socket |
| Standard Booth (Full Event) | ₦100,000 | 3×3m | 2 sockets |
| Corner Premium Booth | ₦180,000 | 4×4m | 4 sockets |
| Food Vendor Slot | ₦50,000 | 4×3m | Industrial |

### Sponsorship Packages

| Package | Price | Key Perk |
|---|---|---|
| Bronze | ₦250,000 | Logo on website, 2 VIP passes |
| Silver | ₦750,000 | Bronze + venue banner + 5 VIP passes |
| Gold | ₦2,500,000 | Silver + stage mentions + brand activation |
| Title Sponsor | Custom | Naming rights + full partnership |

---

## Email Setup

All emails are sent via **SendGrid**. If `SENDGRID_API_KEY` is not set, emails are logged to console (useful for development).

### Email Templates Included

| Trigger | Template |
|---|---|
| Ticket purchased | Ticket confirmation with tier, day, payment ref |
| Vendor applied | Application received — awaiting review |
| Vendor approved | Congratulations + slot details |
| Vendor rejected | Update + contact info |
| Sponsor confirmed | Welcome + asset submission instructions |

To preview templates in development, set `SENDGRID_API_KEY` to a test key and use SendGrid's activity feed.

---

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy --prod
```

Set all environment variables in **Vercel Dashboard → Project → Settings → Environment Variables**.

### Manual / Other Platforms

```bash
npm run build
npm start
```

Ensure `NODE_ENV=production` is set. The build uses **Turbopack** (stable in Next.js 16) for fast builds.

---

## Admin Access

### Creating an Admin Account

**Option A — SQL (recommended for first admin):**

1. Register normally at `/login` using any role
2. Run in Supabase SQL editor:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

**Option B — Direct Supabase dashboard:**

Open the `users` table in your Supabase dashboard and update the `role` column to `admin`.

### Admin Login

Go to `/login` → sign in with your admin email and password → you will be automatically redirected to `/admin/dashboard`.

### Admin Capabilities

- View real-time KPI dashboard
- Approve or reject vendor applications (triggers email)
- Approve or reject sponsor applications
- View all ticket sales with full attendee details
- Gate check-in with reference validation and duplicate detection
- Export all data as CSV (tickets, attendees, vendors, sponsors, checkins, revenue)
- Send broadcast emails to all or specific audience segments
- Review sponsor brand assets (logo, colour, tagline) before approving

---

## Next.js 16 Notes

This project uses **Next.js 16.1** with several new features:

### `proxy.js` instead of `middleware.ts`

Next.js 16 introduces `proxy.ts` (or `proxy.js`) as the replacement for `middleware.ts`. It makes the network boundary explicit and runs on the **Node.js runtime** (not Edge):

```js
// proxy.js — at project root
export function proxy(request) {
  // route protection logic
}

export const config = {
  matcher: ["/admin/:path*", "/attendee/:path*", ...]
};
```

Rename `middleware.ts` → `proxy.ts` in any existing projects.

### Cache Components

Next.js 16 introduces **Cache Components** with `"use cache"` directives, replacing the previous PPR (Partial Pre-Rendering) experimental flag:

```js
// next.config.js
experimental: {
  cacheComponents: true,
}
```

### Turbopack (Stable)

Turbopack is now the **default bundler** for both `next dev` and `next build`. The `--turbopack` flag is redundant but kept for clarity:

```bash
next dev --turbopack   # same as: next dev
```

Expect **2–5× faster builds** compared to Webpack.

---

## Nigeria Compliance

| Requirement | Action |
|---|---|
| **CAC Registration** | Register at [cac.gov.ng](https://cac.gov.ng) before going live |
| **Paystack KYC** | Upload CAC documents on Paystack dashboard to raise transaction limits |
| **NDPR Compliance** | Add a Privacy Policy page covering user data collection |
| **VAT (7.5%)** | Prices shown are VAT-inclusive (recommended for consumer transparency) |
| **Refund Policy** | Publish policy; Paystack dashboard supports direct refunds |
| **Venue Permit** | Apply to Ogun State Government for event permit |
| **LASAA / FAAN** | If any signage or outdoor display, obtain relevant permits |

---

## Event Schedule

| Day | Theme |
|---|---|
| **Dec 23** | Opening Night — Live DJ, headline performance, fireworks |
| **Dec 24** | Christmas Eve & Family Day — carols, kids zone, midnight countdown |
| **Dec 25** | Christmas Day Gala — VIP brunch, cultural performances, gala dinner |
| **Dec 26** | Boxing Day Finale — market, DJ battle, awards, grand closing |

---

## Contact

| | |
|---|---|
| General | info@olambedetty.ng |
| Vendors | vendors@olambedetty.ng |
| Sponsors | sponsors@olambedetty.ng |
| Technical | tech@olambedetty.ng |
| Phone | +234 801 234 5678 |
| WhatsApp | +234 801 234 5678 |
| Instagram | [@olambedetty](https://instagram.com/olambedetty) |
| Twitter/X | [@olambedetty](https://twitter.com/olambedetty) |

---

*Built with Next.js 16 · Payments by Paystack · Hosted on Vercel*
*© 2025 Olambe Detty December Carnival. All rights reserved.*
<<<<<<< HEAD
<<<<<<< HEAD
# occd26
<<<<<<< HEAD
# occd26
=======
=======
>>>>>>> e8b5248 (c)
=======
# occd26
>>>>>>> 03f4bae (first commit)
>>>>>>> e1d658b01c6caaf9506d7b7dfaf871069195ae70
# d26d
