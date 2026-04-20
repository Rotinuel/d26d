-- ============================================================
-- OLAMBE DETTY DECEMBER CARNIVAL - DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── USERS ────────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  phone         TEXT,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'attendee' CHECK (role IN ('attendee','vendor','sponsor','admin')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TICKETS ──────────────────────────────────────────────────────────────────
CREATE TABLE tickets (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  tier          TEXT NOT NULL CHECK (tier IN ('single','full','vip','family')),
  tier_name     TEXT NOT NULL,
  day           TEXT NOT NULL,
  price         INTEGER NOT NULL,  -- in kobo
  quantity      INTEGER NOT NULL DEFAULT 1,
  paystack_ref  TEXT UNIQUE NOT NULL,
  qr_data       TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'valid' CHECK (status IN ('valid','used','refunded','cancelled')),
  checked_in_at TIMESTAMPTZ,
  checked_in_by TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── VENDORS ──────────────────────────────────────────────────────────────────
CREATE TABLE vendors (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  biz_name      TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT NOT NULL,
  category      TEXT NOT NULL,
  rc_number     TEXT,
  description   TEXT,
  logo_url      TEXT,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','suspended')),
  reviewed_by   TEXT,
  reviewed_at   TIMESTAMPTZ,
  notes         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── VENDOR SLOT TYPES ────────────────────────────────────────────────────────
CREATE TABLE slot_types (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  price       INTEGER NOT NULL,  -- in kobo
  size        TEXT NOT NULL,
  power       TEXT NOT NULL,
  description TEXT,
  total       INTEGER NOT NULL DEFAULT 20,
  booked      INTEGER NOT NULL DEFAULT 0
);

INSERT INTO slot_types VALUES
  ('std-day',  'Standard Booth (Per Day)',   3000000,  '3×3m', '1 socket',          'Great for single-day showcases', 20, 0),
  ('std-full', 'Standard Booth (Full Event)',10000000, '3×3m', '2 sockets',          '4-day presence at a discount',   15, 0),
  ('corner',   'Corner Premium Booth',       18000000, '4×4m', '4 sockets',          'High-traffic corner location',   8,  0),
  ('food',     'Food Vendor Slot',           5000000,  '4×3m', 'Industrial socket',  'Includes waste disposal access', 12, 0);

-- ─── VENDOR BOOKINGS ──────────────────────────────────────────────────────────
CREATE TABLE vendor_bookings (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id    UUID REFERENCES vendors(id) ON DELETE CASCADE,
  slot_type_id TEXT REFERENCES slot_types(id),
  slot_name    TEXT NOT NULL,
  price        INTEGER NOT NULL,
  paystack_ref TEXT UNIQUE NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','rejected','refunded')),
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SPONSORS ─────────────────────────────────────────────────────────────────
CREATE TABLE sponsors (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  company      TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT,
  website      TEXT,
  package      TEXT NOT NULL CHECK (package IN ('bronze','silver','gold','title')),
  price        INTEGER,  -- null for title (custom)
  paystack_ref TEXT,
  logo_url     TEXT,
  brand_color  TEXT DEFAULT '#F0B429',
  tagline      TEXT,
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reviewed_by  TEXT,
  reviewed_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CHECKINS ─────────────────────────────────────────────────────────────────
CREATE TABLE checkins (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id   UUID REFERENCES tickets(id),
  scanned_at  TIMESTAMPTZ DEFAULT NOW(),
  gate        TEXT,
  scanned_by  TEXT,
  day         TEXT NOT NULL
);

-- ─── BROADCASTS ───────────────────────────────────────────────────────────────
CREATE TABLE broadcasts (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title      TEXT NOT NULL,
  message    TEXT NOT NULL,
  audience   TEXT NOT NULL DEFAULT 'all' CHECK (audience IN ('all','attendees','vendors','sponsors')),
  sent_by    TEXT NOT NULL,
  sent_at    TIMESTAMPTZ DEFAULT NOW(),
  recipients INTEGER DEFAULT 0
);

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
ALTER TABLE users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets        ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors        ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors       ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins       ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcasts     ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own record
CREATE POLICY "users: own row" ON users FOR ALL USING (true);

-- Tickets: user sees own
CREATE POLICY "tickets: own" ON tickets FOR ALL USING (true);

-- Vendors: own
CREATE POLICY "vendors: own" ON vendors FOR ALL USING (true);

-- Vendor bookings: own
CREATE POLICY "vendor_bookings: own" ON vendor_bookings FOR ALL USING (true);

-- Sponsors: own
CREATE POLICY "sponsors: own" ON sponsors FOR ALL USING (true);

-- Open slot_types for reading
CREATE POLICY "slot_types: public read" ON slot_types FOR SELECT USING (true);
ALTER TABLE slot_types ENABLE ROW LEVEL SECURITY;

-- ─── INDEXES ──────────────────────────────────────────────────────────────────
CREATE INDEX idx_tickets_user_id       ON tickets(user_id);
CREATE INDEX idx_tickets_paystack_ref  ON tickets(paystack_ref);
CREATE INDEX idx_tickets_status        ON tickets(status);
CREATE INDEX idx_vendors_user_id       ON vendors(user_id);
CREATE INDEX idx_vendors_status        ON vendors(status);
CREATE INDEX idx_bookings_vendor_id    ON vendor_bookings(vendor_id);
CREATE INDEX idx_sponsors_user_id      ON sponsors(user_id);
CREATE INDEX idx_sponsors_status       ON sponsors(status);
CREATE INDEX idx_checkins_ticket_id    ON checkins(ticket_id);
