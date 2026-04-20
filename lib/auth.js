import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "change-this-in-production";

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// Extract user from request cookies/headers
export function getUserFromRequest(request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : request.cookies?.get("oddc_token")?.value;

  if (!token) return null;
  return verifyToken(token);
}

// Require a specific role
export function requireRole(user, role) {
  if (!user) return { error: "Unauthorized", status: 401 };
  if (role && user.role !== role && user.role !== "admin") {
    return { error: "Forbidden", status: 403 };
  }
  return null;
}
