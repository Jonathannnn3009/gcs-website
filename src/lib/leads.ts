// Every website form sends its enquiry through submitLead(). It posts to the CRM's public
// lead intake (POST /crm/api/public/leads), so each enquiry becomes a lead the team can see,
// assign and follow up in the CRM.
//
// It never blocks or breaks the visitor's flow: if the CRM can't be reached (it isn't
// deployed yet, the network dropped, a rate limit) the enquiry is kept in this browser and
// retried the next time the site is opened.

import { CRM_API } from "@/lib/crm";
import { getCaptchaToken } from "@/lib/captcha";
import { normalizePhone } from "@/lib/lead-dedupe";

export type Lead = {
  name: string;
  phone: string;
  /** Which form it came from, e.g. "checklist-download", "partner-enquiry". */
  source: string;
  email?: string;
  city?: string;
  /** Loan product slug as used on the website, when the form knows it. */
  productSlug?: string;
  /** Rupees — a number, or text such as "50,00,000". */
  amount?: number | string;
  detail?: string;
};

type CrmPayload = {
  name: string;
  phone: string;
  source: string;
  email?: string;
  city?: string;
  productSlug?: string;
  amount?: number;
  detail?: string;
  captchaToken?: string;
};

const QUEUE_KEY = "gcs.pendingLeads";
const QUEUE_MAX = 20;
const QUEUE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const clip = (s: string, max: number) => (s.length > max ? s.slice(0, max) : s);

/** Shapes a lead the way the CRM's intake validates it. Returns null if it can't be valid. */
function toPayload(lead: Lead): CrmPayload | null {
  const phone = normalizePhone(lead.phone);
  const name = lead.name.trim();
  if (!phone || name.length < 2) return null;

  const payload: CrmPayload = {
    name: clip(name, 120),
    phone,
    source: clip(lead.source.trim() || "website", 60),
  };
  const email = lead.email?.trim();
  if (email && email.length >= 3 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    payload.email = clip(email, 160);
  }
  const city = lead.city?.trim();
  if (city && city.length >= 2) payload.city = clip(city, 80);
  if (lead.productSlug && lead.productSlug.length >= 2) payload.productSlug = lead.productSlug;
  if (lead.amount !== undefined && lead.amount !== "") {
    const n =
      typeof lead.amount === "number"
        ? lead.amount
        : Number(String(lead.amount).replace(/[^\d.]/g, ""));
    if (Number.isFinite(n) && n >= 0) payload.amount = n;
  }
  const detail = lead.detail?.trim();
  if (detail) payload.detail = clip(detail, 2000);
  return payload;
}

type QueueItem = { payload: CrmPayload; queuedAt: number };

function readQueue(): QueueItem[] {
  try {
    const raw = window.localStorage.getItem(QUEUE_KEY);
    const list = raw ? (JSON.parse(raw) as QueueItem[]) : [];
    const now = Date.now();
    return list.filter((i) => i && i.payload && now - i.queuedAt < QUEUE_MAX_AGE_MS);
  } catch {
    return [];
  }
}

function writeQueue(list: QueueItem[]) {
  try {
    window.localStorage.setItem(QUEUE_KEY, JSON.stringify(list.slice(-QUEUE_MAX)));
  } catch {
    // storage blocked or full — nothing more we can do
  }
}

/** "sent" = accepted, "rejected" = the CRM refused it for good (don't retry), "retry" = try again later. */
async function post(payload: CrmPayload): Promise<"sent" | "rejected" | "retry"> {
  try {
    const captchaToken = await getCaptchaToken();
    const body: CrmPayload = captchaToken ? { ...payload, captchaToken } : payload;
    const res = await fetch(`${CRM_API}/public/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) return "sent";
    // 400/422: the CRM looked at it and said no — retrying the same data won't help.
    if (res.status === 400 || res.status === 422) return "rejected";
    return "retry"; // 404 (CRM not live yet), 429 (rate limit), 5xx
  } catch {
    return "retry"; // offline / blocked
  }
}

export async function submitLead(lead: Lead): Promise<void> {
  if (typeof window === "undefined") return;
  const payload = toPayload(lead);
  if (!payload) return;
  const outcome = await post(payload);
  if (outcome === "retry") writeQueue([...readQueue(), { payload, queuedAt: Date.now() }]);
}

/** Re-sends enquiries that couldn't be delivered earlier. Safe to call on every page load. */
export async function flushPendingLeads(): Promise<void> {
  if (typeof window === "undefined") return;
  const queue = readQueue();
  if (queue.length === 0) return;
  const stillPending: QueueItem[] = [];
  for (const item of queue) {
    const outcome = await post(item.payload);
    if (outcome === "retry") stillPending.push(item);
  }
  writeQueue(stillPending);
}
