// Browser side of "Do not have a GCS ID?" on the Track Application page. The visitor confirms their mobile
// number with a code, and the CRM then sends the GCS ID. Both go by SMS once an SMS number is set up; until then
// they go by email, to the address held on the file. The ID never
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

/** How the CRM sends codes and IDs: by SMS, or by email while there is no SMS number. */
export type Via = "sms" | "email";

/** Sends a six-digit code (when an ID is held against the number). */
export async function requestIdCode(kind: IdKind, rawPhone: string) {
  const phone = normalizePhone(rawPhone);
  if (!phone) throw new IdRecoveryError("Enter a valid 10-digit mobile number.");
  const captchaToken = await getCaptchaToken();
  return post<{ sent: true; resendAfterSeconds: number; validMinutes: number; via?: Via }>("send", {
    kind,
    phone,
    ...(captchaToken ? { captchaToken } : {}),
  });
}

/** Checks the code. When it is right, the CRM sends the GCS ID; `sent` is false if none could be sent (`noEmail` when it is only that no email is on file). */
export async function confirmIdCode(kind: IdKind, rawPhone: string, code: string) {
  const phone = normalizePhone(rawPhone);
  if (!phone) throw new IdRecoveryError("Enter a valid 10-digit mobile number.");
  return post<{ sent: boolean; via?: Via; noEmail?: boolean }>("verify", { kind, phone, code: code.trim() });
}
