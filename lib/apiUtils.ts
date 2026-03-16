/** Escape HTML special chars to prevent XSS in email bodies. */
export function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Simple in-memory rate limiter: max `limit` requests per `windowMs` per IP. */
const store = new Map<string, { count: number; reset: number }>();

export function rateLimit(ip: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = store.get(ip);
  if (!entry || now > entry.reset) {
    store.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

/**
 * CSRF check: reject requests whose Origin/Referer doesn't match the app host.
 * Returns an error message string if the check fails, null if it passes.
 */
export function checkCsrf(req: { headers: { get: (k: string) => string | null } }): string | null {
  const appHost = process.env.NEXT_PUBLIC_APP_URL
    ? new URL(process.env.NEXT_PUBLIC_APP_URL).host
    : null;
  // In dev there's no APP_URL — skip the check
  if (!appHost) return null;

  const origin = req.headers.get("origin") ?? req.headers.get("referer");
  if (!origin) return "Forbidden: missing origin.";
  try {
    if (new URL(origin).host !== appHost) return "Forbidden: cross-origin request.";
  } catch {
    return "Forbidden: invalid origin.";
  }
  return null;
}

/**
 * Magic-byte MIME validation for uploaded images.
 * Checks the first bytes of the buffer — not the spoofable file.type field.
 */
const IMAGE_SIGNATURES: { mime: string; bytes: number[]; offset?: number }[] = [
  { mime: "image/jpeg",  bytes: [0xff, 0xd8, 0xff] },
  { mime: "image/png",   bytes: [0x89, 0x50, 0x4e, 0x47] },
  { mime: "image/gif",   bytes: [0x47, 0x49, 0x46, 0x38] },
  { mime: "image/webp",  bytes: [0x52, 0x49, 0x46, 0x46], offset: 0 }, // RIFF....WEBP
];

export async function isAllowedImageMime(file: File): Promise<boolean> {
  const slice = await file.slice(0, 12).arrayBuffer();
  const bytes = new Uint8Array(slice);
  for (const sig of IMAGE_SIGNATURES) {
    const off = sig.offset ?? 0;
    if (sig.bytes.every((b, i) => bytes[off + i] === b)) {
      // Extra check for WebP: bytes 8-11 must be "WEBP"
      if (sig.mime === "image/webp") {
        const marker = [0x57, 0x45, 0x42, 0x50];
        if (!marker.every((b, i) => bytes[8 + i] === b)) continue;
      }
      return true;
    }
  }
  return false;
}
