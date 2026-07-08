import type { NextConfig } from "next";

/**
 * Security response headers for this read-only static demo.
 *
 * 'unsafe-inline' is required in script-src (Next.js injects inline
 * bootstrap/hydration scripts) and style-src (Recharts writes inline
 * styles, as do Next/Tailwind). A nonce-based CSP would need middleware,
 * which this static, backend-less demo deliberately avoids — so
 * 'unsafe-inline' is the minimum that keeps every route working.
 * 'unsafe-eval' and wildcards are never used.
 */
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'none'",
    ].join("; "),
  },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
