// proxy.js — Next.js 16 network boundary file (replaces middleware.ts)
// Runs on Node.js runtime. Protects API routes server-side.
// Page route protection is handled client-side in each dashboard component.

import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// Only lock down API routes server-side — page routes rely on
// client-side guards so we don't break client-router navigations.
const PROTECTED_API = [
  { pattern: /^\/api\/tickets\/purchase/,         role: "attendee" },
  { pattern: /^\/api\/tickets\/my-tickets/,        role: "attendee" },
  { pattern: /^\/api\/vendors\/book/,              role: "vendor"   },
  { pattern: /^\/api\/vendors\/my-bookings/,       role: "vendor"   },
  { pattern: /^\/api\/sponsors\/my-sponsorship/,   role: "sponsor"  },
  { pattern: /^\/api\/admin/,                      role: "admin"    },
];

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Only intercept API routes
  if (!pathname.startsWith("/api/")) return NextResponse.next();

  const match = PROTECTED_API.find(({ pattern }) => pattern.test(pathname));
  if (!match) return NextResponse.next();

  const token = request.cookies.get("oddc_token")?.value;
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    return NextResponse.json({ error: "Unauthorized — please sign in" }, { status: 401 });
  }

  // Admins can call any route
  if (payload.role === "admin") return NextResponse.next();

  if (payload.role !== match.role) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Pass user identity downstream via headers
  const headers = new Headers(request.headers);
  headers.set("x-user-id",    payload.id);
  headers.set("x-user-role",  payload.role);
  headers.set("x-user-email", payload.email);

  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/api/:path*"],
};

<<<<<<< HEAD



// // proxy.js — Next.js 16 network boundary file (replaces middleware.ts)
// // Runs on Node.js runtime. Protects portal routes by validating the JWT cookie.

// import { NextResponse } from "next/server";
// import { verifyToken } from "@/lib/auth.js";

// // Routes that require authentication and their required roles
// const PROTECTED = [
//   { pattern: /^\/attendee/, role: "attendee" },
//   { pattern: /^\/vendor\/dashboard/, role: "vendor" },
//   { pattern: /^\/sponsor\/dashboard/, role: "sponsor" },
//   { pattern: /^\/admin/, role: "admin" },
//   { pattern: /^\/api\/tickets/, role: "attendee" },
//   { pattern: /^\/api\/tickets\/purchase/,         role: "attendee" },
//   { pattern: /^\/api\/vendors\/book/, role: "vendor" },
//   { pattern: /^\/api\/vendors\/my-bookings/, role: "vendor" },
//   { pattern: /^\/api\/sponsors\/my-sponsorship/, role: "sponsor" },
//   { pattern: /^\/api\/admin/, role: "admin" },
// ];

// export function proxy(request) {
//   const { pathname } = request.nextUrl;

//   // Only intercept API routes
//   if (!pathname.startsWith("/api/")) return NextResponse.next();

//   // Find matching protected route
//   const match = PROTECTED.find(({ pattern }) => pattern.test(pathname));
//   if (!match) return NextResponse.next();

//   // Read JWT from cookie
//   const token = request.cookies.get("oddc_token")?.value;
//   const payload = token ? verifyToken(token) : null;

//   if (!payload) {
//     // API routes return 401 JSON
//     if (pathname.startsWith("/api/")) {
//       return NextResponse.json({ error: "Unauthorized - please sign in" }, { status: 401 });
//     }
//     // Page routes redirect to login
//     const loginUrl = new URL("/login", request.url);
//     loginUrl.searchParams.set("redirect", pathname);
//     return NextResponse.redirect(loginUrl);
//   }

//    // Admins can call any route
//   if (payload.role === "admin") return NextResponse.next();

//   if (payload.role !== match.role) {
//     return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//   }

//   // Role check — admins can access any portal
//   if (payload.role !== "admin" && payload.role !== match.role) {
//     if (pathname.startsWith("/api/")) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }
//     // Redirect to the user's own portal
//     const portals = {
//       attendee: "/attendee/dashboard",
//       vendor: "/vendor/dashboard",
//       sponsor: "/sponsor/dashboard",
//     };
//     return NextResponse.redirect(new URL(portals[payload.role] || "/", request.url));
//   }

//   // Attach user info to request headers for downstream use
//   const headers = new Headers(request.headers);
//   headers.set("x-user-id", payload.id);
//   headers.set("x-user-role", payload.role);
//   headers.set("x-user-email", payload.email);

//   return NextResponse.next({ request: { headers } });
// }

// export const config = {
//   matcher: [
//     "/attendee/:path*",
//     "/vendor/dashboard/:path*",
//     "/sponsor/dashboard/:path*",
//     "/admin/:path*",
//     "/api/tickets/:path*",
//     "/api/vendors/book",
//     "/api/vendors/my-bookings",
//     "/api/sponsors/my-sponsorship",
//     "/api/admin/:path*",
//   ],
// };

=======
>>>>>>> e1d658b01c6caaf9506d7b7dfaf871069195ae70
