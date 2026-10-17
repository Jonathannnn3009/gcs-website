// Browser side of "Do not have a GCS ID?" on the Track Application page. The visitor confirms their mobile
// number with a code texted to them, and the CRM then texts the GCS ID to that same number. The ID never
// comes back to the page. The CRM answers the same whether or not an ID exists for the number.

import { CRM_API } from "@/lib/crm";
import { getCaptchaToken } from "@/lib/captcha";
import { normalizePhone } from "@/lib/lead-dedupe";

export type IdKind = "client" | "partner";

/** A failed step, with words that are fine to show the visitor. */
export class IdRecoveryError extends Error {}

async function post<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${CRM_API}/public/id-recovery/${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new IdRecoveryError("We couldn't reach the server. Check your connection and try again.");
  }
  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    // no body
  }
  if (!res.ok) {
    const m = (json as { message?: unknown } | null)?.message;
    const text = Array.isArray(m) ? m[0] : m;
    throw new IdRecoveryError(
      typeof text === "string" && text
        ? text.charAt(0).toUpperCase() + text.slice(1)
        : "Something went wrong. Please try again.",
    );
  }
  return json as T;
}

/** Texts a six-digit code to the number (when an ID is held against it). */
export async function requestIdCode(kind: IdKind, rawPhone: string) {
  const phone = normalizePhone(rawPhone);
  if (!phone) throw new IdRecoveryError("Enter a valid 10-digit mobile number.");
  const captchaToken = await getCaptchaToken();
  return post<{ sent: true; resendAfterSeconds: number; validMinutes: number }>("send", {
    kind,
    phone,
    ...(captchaToken ? { captchaToken } : {}),
  });
}

/** Checks the code. When it is right, the CRM texts the GCS ID; `sent` is false if none is held for the number. */
export async function confirmIdCode(kind: IdKind, rawPhone: string, code: string) {
  const phone = normalizePhone(rawPhone);
  if (!phone) throw new IdRecoveryError("Enter a valid 10-digit mobile number.");
  return post<{ sent: boolean }>("verify", { kind, phone, code: code.trim() });
}
