/** Rejects cross-site POSTs (a third-party page silently submitting votes
 * or comments on a visitor's behalf) by checking the browser-sent Origin
 * header against the request's own Host. Non-browser clients (curl,
 * server-to-server) send no Origin header at all — those pass through,
 * since this is a lightweight abuse deterrent, not the app's only
 * safeguard (votes are still deduped server-side, comments still
 * length-validated). */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    return new URL(origin).host === request.headers.get("host");
  } catch {
    return false;
  }
}
