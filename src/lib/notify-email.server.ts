// Server only. Emails the team when someone sends an enquiry on the website, through Zoho Mail's API.
// It works without the CRM being live. Everything is switched off until these are set on the server
// (Cloudflare secrets, or process.env locally):
//   ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN, ZOHO_ACCOUNT_ID,
//   ZOHO_FROM_ADDRESS (the mailbox the token belongs to) and LEAD_NOTIFY_TO (who gets the alert,
//   comma separated). ZOHO_REGION is "in" (default) or "com", to match the Zoho account.

import { serverEnv } from "@/lib/chat/env.server";

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

/** TEMPORARY: why the last send failed, so the setup can be checked. Remove once email works. */
export let lastProblem = "";

const clean = (s: unknown, max: number) =>
  typeof s === "string" ? s.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "").trim().slice(0, max) : "";

/** Zoho hands out a one-hour access token in exchange for the long-lived refresh token. */
async function accessToken(region: string): Promise<string | null> {
  if (cached && cached.until > Date.now()) return cached.token;
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: serverEnv("ZOHO_CLIENT_ID"),
    client_secret: serverEnv("ZOHO_CLIENT_SECRET"),
    refresh_token: serverEnv("ZOHO_REFRESH_TOKEN"),
  });
  const res = await fetch(`https://accounts.zoho.${region}/oauth/v2/token`, { method: "POST", body });
  const json = (await res.json().catch(() => null)) as { access_token?: string; expires_in?: number } | null;
  if (!res.ok || !json?.access_token) {
    lastProblem = `token refresh ${res.status}: ${JSON.stringify(json ?? {}).replace(/1000\.[\w.]+/g, "…").slice(0, 200)}`;
    return null;
  }
  cached = { token: json.access_token, until: Date.now() + Math.max(60, (json.expires_in ?? 3600) - 120) * 1000 };
  return json.access_token;
}

/** TEMPORARY: the names (never the values) of the settings the server cannot see. */
export function missingSettings(): string[] {
  return ["ZOHO_CLIENT_ID", "ZOHO_CLIENT_SECRET", "ZOHO_REFRESH_TOKEN", "ZOHO_ACCOUNT_ID", "ZOHO_FROM_ADDRESS", "LEAD_NOTIFY_TO"].filter(
    (n) => !serverEnv(n),
  );
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
export async function sendEnquiryMail(lead: EnquiryMail): Promise<boolean> {
  if (!notifyConfigured()) return false;
  const region = serverEnv("ZOHO_REGION") === "com" ? "com" : "in";
  try {
    const token = await accessToken(region);
    if (!token) return false;

    const name = clean(lead.name, 120);
    const lines = [
      `New enquiry from the website`,
      ``,
      `Name: ${name}`,
      `Phone: ${clean(lead.phone, 20)}`,
      lead.email ? `Email: ${clean(lead.email, 160)}` : "",
      lead.city ? `City: ${clean(lead.city, 80)}` : "",
      lead.productSlug ? `Loan: ${clean(lead.productSlug, 80)}` : "",
      lead.amount ? `Amount: Rs. ${new Intl.NumberFormat("en-IN").format(lead.amount)}` : "",
      `Form: ${clean(lead.source, 60)}`,
      lead.detail ? `\nDetails:\n${clean(lead.detail, 2000)}` : "",
      ``,
      `Received ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} (India time)`,
    ].filter((l, i, a) => l !== "" || a[i - 1] !== "");

    const sent = await deliver(
      region,
      token,
      serverEnv("LEAD_NOTIFY_TO"),
      `New enquiry: ${name}${lead.productSlug ? ` (${clean(lead.productSlug, 40)})` : ""}`,
      lines.join("\n"),
    );

    // a short thank-you to the customer, when they gave an email address
    const to = clean(lead.email, 160);
    if (to && /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(to)) {
      const first = name.split(/\s+/)[0] ?? name;
      await deliver(
        region,
        token,
        to,
        "We have received your enquiry | Growth Capital Services",
        [
          `Dear ${first},`,
          ``,
          `Thank you for contacting Growth Capital Services. We have received your enquiry, and one of our loan experts will get in touch with you on ${clean(lead.phone, 20)}.`,
          ``,
          `To help us understand your needs, it may help to keep your identity proof, address proof and recent bank statements handy. We will tell you exactly what applies to you.`,
          ``,
          `Please note this is an enquiry, not a loan approval. Loan terms and approval depend on the lender's own checks.`,
          ``,
          `Warm regards`,
          `Growth Capital Services`,
          `If you did not make this enquiry, you can ignore this email.`,
        ].join("\n"),
      );
    }
    return sent;
  } catch (error) {
    lastProblem = `error: ${(error as Error).message}`;
    return false;
  }
}

/** One message through Zoho Mail's API. */
async function deliver(region: string, token: string, to: string, subject: string, content: string): Promise<boolean> {
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
        mailFormat: "plaintext",
      }),
    },
  );
  if (res.status === 401) cached = null; // token no longer good: ask for a fresh one next time
  if (!res.ok) lastProblem = `send ${res.status}: ${(await res.text().catch(() => "")).replace(/1000\.[\w.]+/g, "…").slice(0, 300)}`;
  return res.ok;
}
