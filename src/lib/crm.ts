// Where the CRM's public API lives. On the live site the CRM is served from the same
// domain, so the default is the relative path. For local development `.env.development`
// points this at the CRM backend on its own port.
export const CRM_API: string =
  ((import.meta.env["VITE_CRM_API_URL"] as string | undefined) ?? "").replace(/\/$/, "") ||
  "/crm/api";

/** A picture path: pictures uploaded in the CRM are served by it; anything else is a path on the website. */
export function crmAsset(path: string): string {
  return path.startsWith("/public/") ? `${CRM_API}${path}` : path;
}

/**
 * Where the CRM's pages (sign-in, tracking) are opened from the browser. On the live site the CRM is
 * served from the same domain under /crm. For local development `.env.development` points this at
 * the CRM's own dev server.
 */
export const CRM_APP: string =
  ((import.meta.env["VITE_CRM_APP_URL"] as string | undefined) ?? "").replace(/\/$/, "") || "/crm";
