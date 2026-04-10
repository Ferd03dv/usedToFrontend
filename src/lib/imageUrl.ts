/**
 * Converts a backend image path into a displayable URL.
 *
 * In development: Vite proxies /public/* to the backend (localhost:3000),
 * so paths should be same-origin relative (e.g. /public/uploads/...).
 *
 * If a path is stored as an absolute backend URL (http://localhost:3000/...)
 * we strip the origin so the proxy can handle it same-origin.
 *
 * In production: set VITE_API_BASE_URL to the backend origin.
 */
const BACKEND_ORIGINS = [
  import.meta.env.VITE_API_BASE_URL,
  'http://localhost:3000',
  'http://127.0.0.1:3000',
].filter(Boolean) as string[];

export function getImageUrl(
  path: string | null | undefined,
  fallback?: string
): string {
  if (!path) {
    return fallback || 'https://placehold.co/400x400/1f2937/94a3b8?text=No+Image';
  }

  // If the path is an absolute URL pointing to our own backend,
  // strip the origin so the Vite dev proxy serves it same-origin.
  for (const origin of BACKEND_ORIGINS) {
    if (path.startsWith(origin)) {
      return path.slice(origin.length) || '/';
    }
  }

  // External absolute URL (e.g. Cloudinary, S3) — pass through unchanged
  if (path.startsWith('http')) {
    return path;
  }

  // Relative path — use as-is (proxy handles it in dev, CDN/base handles it in prod)
  return path;
}

