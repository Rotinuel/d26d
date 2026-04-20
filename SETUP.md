# Local Setup Guide

Follow these steps in order before running `npm run dev`.

---

## Step 1 — Create your .env.local file

In the project root (same folder as `package.json`), create a file called `.env.local`.

Copy everything from `.env.local.example` into it:

```
cp .env.local.example .env.local
```

On Windows (Command Prompt):
```
copy .env.local.example .env.local
```

---

## Step 2 — Set up Supabase (free)

1. Go to https://supabase.com and create a free account
2. Click **New Project**, give it a name (e.g. `olambe-detty`), choose a region close to Nigeria (e.g. `eu-west-2` London or `us-east-1`)
3. Set a strong database password and save it somewhere safe
4. Wait ~2 minutes for the project to spin up

### Get your keys

In your Supabase project → **Settings → API**:

- Copy **Project URL** → paste as `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon / public** key → paste as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy **service_role** key → paste as `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser. It is only used in API routes.

### Create the database tables

In Supabase → **SQL Editor** → click **New query** → paste the entire contents of `supabase-schema.sql` → click **Run**.

---

## Step 3 — Set up Paystack

1. Go to https://dashboard.paystack.com and create a free account
2. Go to **Settings → API Keys & Webhooks**
3. Copy **Test Public Key** → paste as `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
4. Copy **Test Secret Key** → paste as `PAYSTACK_SECRET_KEY`

> Use test keys during development. Switch to live keys when deploying.

---

## Step 4 — Set your JWT secret

Generate any random string of at least 32 characters for `JWT_SECRET`.

Quick way on Mac/Linux:
```bash
openssl rand -base64 32
```

On Windows (PowerShell):
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Max 256) }))
```

Or just type a long random string manually — it just needs to be secret and at least 32 chars.

---

## Step 5 — Email (optional for local dev)

If `SENDGRID_API_KEY` is not set, emails are logged to your terminal console instead of actually sending. You can skip this for local development.

To enable real emails:
1. Create a free account at https://sendgrid.com
2. Go to **Settings → API Keys → Create API Key**
3. Paste the key as `SENDGRID_API_KEY`
4. Set `EMAIL_FROM` to a verified sender email in your SendGrid account

---

## Step 6 — Your final .env.local should look like this

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Olambe Detty December Carnival"

NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijkl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

JWT_SECRET=your-random-32-plus-character-secret-string-here

# Optional for local dev — emails log to console if not set
SENDGRID_API_KEY=
EMAIL_FROM=noreply@olambedetty.ng
EMAIL_FROM_NAME="Olambe Detty December Carnival"

# Optional
TERMII_API_KEY=
TERMII_SENDER_ID=OlambeDetty
```

---

## Step 7 — Create your first admin account

1. Start the dev server: `npm run dev`
2. Go to http://localhost:3000/register
3. Register as an **Attendee** (use your real email)
4. In Supabase → **Table Editor → users** → find your row → change `role` from `attendee` to `admin`
5. Sign out and sign back in at http://localhost:3000/login
6. You will be redirected to `/admin/dashboard`

---

## Step 8 — Run the app

```bash
npm install        # install dependencies
npm run dev        # start dev server at http://localhost:3000
```

---

## Common Errors

| Error | Fix |
|---|---|
| `supabaseKey is required` | Your `.env.local` is missing or has wrong Supabase keys — check Step 2 |
| `JWT_SECRET is not set` | Add `JWT_SECRET` to `.env.local` — check Step 4 |
| `POST /api/auth/register 503` | Database not configured — Supabase keys missing or wrong |
| `relation "users" does not exist` | You haven't run `supabase-schema.sql` yet — check Step 2 |
| Paystack popup doesn't open | Missing `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` or Paystack script blocked |
| Page loads but login fails | Check browser console and terminal for the specific error |
