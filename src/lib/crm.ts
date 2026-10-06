// Where the CRM's public API lives. On the live site the CRM is served from the same
// domain, so the default is the relative path. For local development `.env.development`
// points this at the CRM backend on its own port.
export const CRM_API: string =
  ((import.meta.env["VITE_CRM_API_URL"] as string | undefined) ?? "").replace(/\/$/, "") ||
  "/crm/api";
