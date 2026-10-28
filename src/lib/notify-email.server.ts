// Server only. Emails the team when someone sends an enquiry on the website, through Zoho Mail's API.
// It works without the CRM being live. Everything is switched off until these are set on the server
// (Cloudflare secrets, or process.env locally):
//   ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, ZOHO_ACCOUNT_ID,
//   ZOHO_FROM_ADDRESS (the mailbox the token belongs to) and LEAD_NOTIFY_TO (who gets the alert,
//   comma separated). ZOHO_REGION is "in" (default) or "com", to match the Zoho account.

import { serverEnv } from "@/lib/chat/env.server";
import { customerThankYou, teamAlert } from "@/lib/email-templates.server";

export type EnquiryMail = {
  name: string;
  phone: string;
  source: string;
  email?: string | undefined;
  city?: string | undefined;
  productSlug?: string | undefined;
  amount?: number | undefined;
  detail?: string | undefined;
};

let cached: { token: string; until: number } | null = null;

const clean = (s: unknown, max: number) =>
  typeof s === "string"
    ? s
        .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "")
        .trim()
        .slice(0, max)
    : "";

/** Zoho hands out a one-hour access token in exchange for the long-lived refresh token. */
async function accessToken(region: string): Promise<string | null> {
  if (cached && cached.until > Date.now()) return cached.token;
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: serverEnv("ZOHO_CLIENT_ID"),
    client_secret: serverEnv("ZOHO_CLIENT_SECRET"),
    refresh_token: serverEnv("ZOHO_REFRESH_TOKEN"),
  });
  const res = await fetch(`https://accounts.zoho.${region}/oauth/v2/token`, {
    method: "POST",
    body,
  });
  const json = (await res.json().catch(() => null)) as {
    access_token?: string;
    expires_in?: number;
  } | null;
  if (!res.ok || !json?.access_token) return null;
  cached = {
    token: json.access_token,
    until: Date.now() + Math.max(60, (json.expires_in ?? 3600) - 120) * 1000,
  };
  return json.access_token;
}

export function notifyConfigured(): boolean {
  return Boolean(
    serverEnv("ZOHO_CLIENT_ID") &&
    serverEnv("ZOHO_CLIENT_SECRET") &&
    serverEnv("ZOHO_REFRESH_TOKEN") &&
    serverEnv("ZOHO_ACCOUNT_ID") &&
    serverEnv("ZOHO_FROM_ADDRESS") &&
    serverEnv("LEAD_NOTIFY_TO"),
  );
}

/** Sends the alert. Returns whether Zoho accepted it; never throws. */
export async function sendEnquiryMail(lead: EnquiryMail, origin: string): Promise<boolean> {
  if (!notifyConfigured()) return false;
  const region = serverEnv("ZOHO_REGION") === "com" ? "com" : "in";
  try {
    const token = await accessToken(region);
    if (!token) return false;

    const name = clean(lead.name, 120);
    const phone = clean(lead.phone, 20);
    const rows: [string, string][] = [
      ["Name", name],
      ["Phone", phone],
      ["Email", clean(lead.email, 160)],
      ["City", clean(lead.city, 80)],
      ["Loan", clean(lead.productSlug, 80)],
      ["Amount", lead.amount ? `Rs. ${new Intl.NumberFormat("en-IN").format(lead.amount)}` : ""],
      ["Form", clean(lead.source, 60)],
      [
        "Received",
        `${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} (India time)`,
      ],
    ];

    const sent = await deliver(
      region,
      token,
      serverEnv("LEAD_NOTIFY_TO"),
      `New enquiry: ${name}${lead.productSlug ? ` (${clean(lead.productSlug, 40)})` : ""}`,
      teamAlert(
        origin,
        rows,
        clean(lead.detail, 2000),
        `tel:+91${phone.replace(/\D/g, "").slice(-10)}`,
      ),
    );

    // a thank-you to the customer, when they gave an email address
    const to = clean(lead.email, 160);
    if (to && /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(to)) {
      await deliver(
        region,
        token,
        to,
        "We have received your enquiry | Growth Capital Services",
        customerThankYou(origin, name.split(/\s+/)[0] ?? name, phone),
      );
    }
    return sent;
  } catch {
    return false;
  }
}

/** Can the website send mail at all (everything but the alert address)? */
export function mailConfigured(): boolean {
  return Boolean(
    serverEnv("ZOHO_CLIENT_ID") &&
      serverEnv("ZOHO_CLIENT_SECRET") &&
      serverEnv("ZOHO_REFRESH_TOKEN") &&
      serverEnv("ZOHO_ACCOUNT_ID") &&
      serverEnv("ZOHO_FROM_ADDRESS"),
  );
}

/** Sends one HTML message to one address. Returns whether Zoho accepted it; never throws. */
export async function sendSimpleMail(to: string, subject: string, html: string): Promise<boolean> {
  if (!mailConfigured()) return false;
  try {
    const region = serverEnv("ZOHO_REGION") === "com" ? "com" : "in";
    const token = await accessToken(region);
    if (!token) return false;
    return await deliver(region, token, to, subject, html);
  } catch {
    return false;
  }
}

/** One message through Zoho Mail's API. */
async function deliver(
  region: string,
  token: string,
  to: string,
  subject: string,
  content: string,
): Promise<boolean> {
  const res = await fetch(
    `https://mail.zoho.${region}/api/accounts/${encodeURIComponent(serverEnv("ZOHO_ACCOUNT_ID"))}/messages`,
    {
      method: "POST",
      headers: {
        authorization: `Zoho-oauthtoken ${token}`,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        fromAddress: serverEnv("ZOHO_FROM_ADDRESS"),
        toAddress: to,
        subject,
        content,
        mailFormat: "html",
      }),
    },
  );
  if (res.status === 401) cached = null; // token no longer good: ask for a fresh one next time
  return res.ok;
}
