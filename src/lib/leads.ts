// Central place that sends captured leads (checklist downloads, etc.) to
// wherever they end up getting stored. Swap the body of `submitLead` once a
// storage backend (Cloudflare KV, a form-backend service, a CRM webhook…) is
// wired up — every call site already goes through this one function.

export type Lead = {
  name: string;
  phone: string;
  source: string;
  detail?: string;
};

export async function submitLead(lead: Lead): Promise<void> {
  // TODO: no storage backend is wired up yet — see the conversation with
  // Jonathan about picking one (Cloudflare KV vs. a hosted form-backend
  // service). Until then this is a no-op so the download gate still works,
  // but nothing is actually captured server-side.
  void lead;
}
