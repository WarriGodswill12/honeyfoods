// Simple in-memory rate limiter (per IP, per route)
const rateLimitMap = new Map();

export function rateLimit({
  key,
  limit,
  windowMs,
}: {
  key: string;
  limit: number;
  windowMs: number;
}) {
  const now = Date.now();
  const entry = rateLimitMap.get(key) || { count: 0, start: now };
  if (now - entry.start > windowMs) {
    // Reset window
    entry.count = 1;
    entry.start = now;
  } else {
    entry.count++;
  }
  rateLimitMap.set(key, entry);
  if (entry.count > limit) {
    return false;
  }
  return true;
}

// Simple input validation helpers
export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
export function isValidPassword(password: string) {
  return typeof password === "string" && password.length >= 8;
}
