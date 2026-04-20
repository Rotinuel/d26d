// ─── EVENT INFO ───────────────────────────────────────────────────────────────
export const EVENT = {
  name: "Olambe Detty December Carnival",
  shortName: "ODDC 2025",
  tagline: "The Most Anticipated December Festival",
  dates: "December 23–26, 2026",
  startDate: "2026-12-22T23:59:59",
  venue: "Olambe Open Grounds, Ogun State, Nigeria",
  address: "flat 4, unity estate olambe Ogun State",
  email: "info@olambedettydecember.ng",
  phone: "+234 813 428 4100",
  whatsapp: "+234 813 428 4100",
  instagram: "@olambedettydecember",
  twitter: "@olambedettydecember",
  facebook: "OlambeDettyDecember",
};

// ─── TICKET TIERS ─────────────────────────────────────────────────────────────
export const TICKET_TIERS = [
  {
    id: "single",
    name: "Single Day Pass",
    price: 10000,
    desc: "Access to one day of your choice",
    days: "1 day",
    perks: [
      "Entry to all stages on chosen day",
      "Access to vendor market",
      "Official event program",
    ],
    available: 300,
    color: "#6B6B85",
  },
  {
    id: "full",
    name: "Full Festival Pass",
    price: 35000,
    desc: "All 4 days — Dec 23 to 26",
    days: "Dec 23–26",
    perks: [
      "All 4 days of access",
      "Priority queue entry",
      "Access to all stages & market",
      "Official event program",
      "5% merch discount",
    ],
    available: 200,
    color: "#F0B429",
    popular: true,
  },
  {
    id: "vip",
    name: "VIP Pass",
    price: 120000,
    desc: "The ultimate 4-day experience",
    days: "Dec 23–26",
    perks: [
      "All 4 days VIP access",
      "Fast-track entry at all gates",
      "Exclusive VIP lounge access",
      "Complimentary welcome drinks",
      "Meet & greet access",
      "Premium merch pack",
      "Dedicated VIP restrooms",
    ],
    available: 100,
    color: "#FF6348",
  },
  {
    id: "family",
    name: "Family Bundle",
    price: 90000,
    desc: "2 adults + 2 children, all 4 days",
    days: "Dec 23–26",
    perks: [
      "2 adult full festival passes",
      "2 children passes (under 12)",
      "Family lounge access",
      "Kids activity zone access",
    ],
    available: 50,
    color: "#10B981",
  },
];

// ─── VENDOR SLOTS ─────────────────────────────────────────────────────────────
export const VENDOR_SLOTS = [
  {
    id: "std-day",
    name: "Standard Booth (Per Day)",
    price: 30000,
    size: "3×3m",
    power: "1 standard socket",
    desc: "Ideal for single-day brand showcases",
    includes: ["Branded canopy frame", "1 table + 2 chairs", "Name signage"],
  },
  {
    id: "std-full",
    name: "Standard Booth (Full Event)",
    price: 100000,
    size: "3×3m",
    power: "2 standard sockets",
    desc: "4-day presence at a bundled discount",
    includes: ["Branded canopy frame", "2 tables + 4 chairs", "Name signage", "Storage rack"],
    popular: true,
  },
  {
    id: "corner",
    name: "Corner Premium Booth",
    price: 180000,
    size: "4×4m",
    power: "4 sockets (heavy load)",
    desc: "Premium corner location — maximum foot traffic",
    includes: ["L-shaped canopy", "3 tables + 6 chairs", "Corner signage (2 sides)", "Storage rack", "Generator connection point"],
  },
  {
    id: "food",
    name: "Food Vendor Slot",
    price: 50000,
    size: "4×3m",
    power: "Industrial socket",
    desc: "Dedicated food zone slot with waste access",
    includes: ["Open canopy", "2 prep tables", "Name signage", "Waste disposal access", "Water point nearby"],
  },
];

// ─── SPONSORSHIP PACKAGES ─────────────────────────────────────────────────────
export const SPONSOR_PACKAGES = [
  {
    id: "bronze",
    name: "Bronze",
    price: 250000,
    color: "#CD7F32",
    emoji: "🥉",
    perks: [
      "Logo on event website",
      "2 social media mentions",
      "2 VIP passes",
      "Logo on event programme",
      "Post-event thank you mention",
    ],
  },
  {
    id: "silver",
    name: "Silver",
    price: 750000,
    color: "#C0C0C0",
    emoji: "🥈",
    perks: [
      "All Bronze perks",
      "Venue banner placement",
      "Email mention to 5,000+ list",
      "5 VIP passes",
      "Programme full-page advert",
      "Instagram story feature",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    price: 2500000,
    color: "#F0B429",
    emoji: "🥇",
    perks: [
      "All Silver perks",
      "Stage mention every 2 hours",
      "10 VIP passes",
      "2 premium banner placements",
      "Social media takeover slot",
      "Brand activation space (10×10m)",
      "Dedicated post-event report",
    ],
    popular: true,
  },
  {
    id: "title",
    name: "Title Sponsor",
    price: null,
    color: "#FF6348",
    emoji: "👑",
    perks: [
      "Event naming rights",
      "All Gold perks ×2",
      "Unlimited VIP passes",
      "Emcee mentions throughout event",
      "Dedicated brand activation zone",
      "Full social media co-branding",
      "Pre & post event press coverage",
      "Custom integration opportunities",
    ],
  },
];

// ─── EVENT SCHEDULE ───────────────────────────────────────────────────────────
export const SCHEDULE = {
  "Dec 23": {
    theme: "Opening Night 🌟",
    color: "#F0B429",
    events: [
      { time: "4:00 PM", act: "Gates Open", type: "ops" },
      { time: "5:00 PM", act: "Opening Ceremony & Welcome Address", type: "main" },
      { time: "6:00 PM", act: "Afrobeat Set — DJ Neptune", type: "music" },
      { time: "7:30 PM", act: "Stand-up Comedy Showcase", type: "entertainment" },
      { time: "8:30 PM", act: "Headline Artiste Performance — Night 1", type: "main" },
      { time: "10:30 PM", act: "Grand Fireworks Display", type: "special" },
      { time: "11:00 PM", act: "After-party (VIP Lounge)", type: "vip" },
    ],
  },
  "Dec 24": {
    theme: "Christmas Eve & Family Day 🎄",
    color: "#10B981",
    events: [
      { time: "11:00 AM", act: "Gates Open", type: "ops" },
      { time: "12:00 PM", act: "Family Funfair & Kids Zone Opens", type: "family" },
      { time: "1:00 PM", act: "Storytelling & Games for Children", type: "family" },
      { time: "3:00 PM", act: "Live Band — Afrojuju Sounds", type: "music" },
      { time: "5:00 PM", act: "Christmas Carol Concert", type: "music" },
      { time: "7:00 PM", act: "Christmas Eve Special Show", type: "main" },
      { time: "9:00 PM", act: "Headline Artiste Performance — Night 2", type: "main" },
      { time: "11:30 PM", act: "Midnight Christmas Countdown & Fireworks", type: "special" },
    ],
  },
  "Dec 25": {
    theme: "Christmas Day Gala 🎅",
    color: "#FF6348",
    events: [
      { time: "12:00 PM", act: "Gates Open", type: "ops" },
      { time: "1:00 PM", act: "VIP Christmas Day Brunch", type: "vip" },
      { time: "2:00 PM", act: "Cultural Performances & Dance", type: "entertainment" },
      { time: "4:00 PM", act: "Afternoon Live Band", type: "music" },
      { time: "6:00 PM", act: "Christmas Day Gala Dinner (VIP)", type: "vip" },
      { time: "7:30 PM", act: "Headline Artiste Performance — Night 3", type: "main" },
      { time: "10:00 PM", act: "Late Night DJ Set", type: "music" },
    ],
  },
  "Dec 26": {
    theme: "Boxing Day Finale 🎊",
    color: "#8B5CF6",
    events: [
      { time: "11:00 AM", act: "Gates Open", type: "ops" },
      { time: "12:00 PM", act: "Boxing Day Market & Deals Open", type: "vendor" },
      { time: "2:00 PM", act: "Fan Talent Showcase", type: "entertainment" },
      { time: "4:00 PM", act: "All-Stars DJ Battle", type: "music" },
      { time: "6:00 PM", act: "Final Headline Performances", type: "main" },
      { time: "8:00 PM", act: "Awards & Recognition Ceremony", type: "special" },
      { time: "9:30 PM", act: "Grand Finale & Closing Show", type: "special" },
      { time: "11:00 PM", act: "Farewell Fireworks", type: "special" },
    ],
  },
};

// ─── EVENT TYPE COLORS ────────────────────────────────────────────────────────
export const EVENT_TYPE_COLORS = {
  main: "#F0B429",
  music: "#A78BFA",
  family: "#10B981",
  special: "#FF6348",
  ops: "#6B6B85",
  vip: "#F9A8D4",
  vendor: "#60A5FA",
  entertainment: "#34D399",
};

// ─── NAIRA FORMATTER ─────────────────────────────────────────────────────────
export const naira = (amount) =>
  `₦${Number(amount).toLocaleString("en-NG")}`;
