// Browser side of the chat sign-in. A visitor confirms their mobile number with a code texted to
// them (the CRM sends and checks it); the CRM hands back a pass that this browser keeps and sends
// with every question. The website's server asks the CRM whether the pass is still good.

import { CRM_API } from "@/lib/crm";
import { getCaptchaToken } from "@/lib/captcha";
import { normalizePhone } from "@/lib/lead-dedupe";

export type ChatPass = { token: string; name: string; phone: string; expiresAt: string };

const PASS_KEY = "gcs.chat.pass.v1";

/** A failed step, with words that are fine to show the visitor. */
export class ChatAuthError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

export function loadPass(): ChatPass | null {
  try {
    const raw = window.localStorage.getItem(PASS_KEY);
    const pass = raw ? (JSON.parse(raw) as Partial<ChatPass>) : null;
    if (
      pass &&
      typeof pass.token === "string" &&
      typeof pass.name === "string" &&
      typeof pass.phone === "string" &&
      typeof pass.expiresAt === "string" &&
      Date.parse(pass.expiresAt) > Date.now()
    ) {
      return pass as ChatPass;
    }
  } catch {
    // storage blocked or damaged: the visitor simply signs in again
  }
  return null;
}

function savePass(pass: ChatPass) {
  try {
    window.localStorage.setItem(PASS_KEY, JSON.stringify(pass));
  } catch {
    // the pass lives for this page view only
  }
}

export function clearPass() {
  try {
    window.localStorage.removeItem(PASS_KEY);
  } catch {
    // nothing stored
  }
}

async function post<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${CRM_API}/public/chat-auth/${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ChatAuthError(
      "We couldn't reach the server. Check your connection and try again.",
      0,
    );
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
    throw new ChatAuthError(
      typeof text === "string" && text
        ? text.charAt(0).toUpperCase() + text.slice(1)
        : "Something went wrong. Please try again.",
      res.status,
    );
  }
  return json as T;
}

/** Texts a six-digit code to the number. */
export async function requestCode(input: { name: string; phone: string }) {
  const phone = normalizePhone(input.phone);
  if (!phone) throw new ChatAuthError("Enter a valid 10-digit mobile number.", 400);
  const captchaToken = await getCaptchaToken();
  return post<{ sent: true; resendAfterSeconds: number; validMinutes: number }>("send", {
    name: input.name.trim(),
    phone,
    ...(captchaToken ? { captchaToken } : {}),
  });
}

/** Checks the code. On success the pass is kept in this browser. */
export async function confirmCode(input: { phone: string; code: string }): Promise<ChatPass> {
  const phone = normalizePhone(input.phone);
  if (!phone) throw new ChatAuthError("Enter a valid 10-digit mobile number.", 400);
  const res = await post<{ token: string; expiresAt: string; name: string }>("verify", {
    phone,
    code: input.code,
  });
  const pass: ChatPass = { token: res.token, name: res.name, phone, expiresAt: res.expiresAt };
  savePass(pass);
  return pass;
}

/** Signs out: forgets the pass here and tells the CRM to stop honouring it. */
export function endPass(pass: ChatPass) {
  clearPass();
  void post("end", { token: pass.token }).catch(() => undefined);
}
