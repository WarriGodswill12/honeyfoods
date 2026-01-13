// Input sanitization utilities for XSS protection
// Simple and Next.js compatible alternative to DOMPurify

/**
 * Sanitizes a string by removing HTML tags and escaping special characters
 * This prevents XSS attacks in user-provided text inputs
 */
export function sanitizeString(input: string | null | undefined): string {
  if (!input) return "";

  // Convert to string and trim
  let sanitized = String(input).trim();

  // Remove HTML tags
  sanitized = sanitized.replace(/<[^>]*>/g, "");

  // Escape special HTML characters
  sanitized = sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");

  return sanitized;
}

/**
 * Sanitizes a URL to prevent javascript: and data: URIs
 */
export function sanitizeUrl(url: string | null | undefined): string {
  if (!url) return "";

  const sanitized = String(url).trim();

  // Block dangerous protocols
  const dangerousProtocols = /^(javascript|data|vbscript|file|about):/i;
  if (dangerousProtocols.test(sanitized)) {
    return "";
  }

  return sanitized;
}

/**
 * Sanitizes HTML content (allows safe HTML but removes scripts)
 * Use this only when you need to preserve some HTML formatting
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return "";

  let sanitized = String(html).trim();

  // Remove script tags and their content
  sanitized = sanitized.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );

  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, "");

  // Remove javascript: URLs
  sanitized = sanitized.replace(/javascript:/gi, "");

  // Remove data: URLs (can contain embedded scripts)
  sanitized = sanitized.replace(/data:text\/html/gi, "");

  return sanitized;
}
