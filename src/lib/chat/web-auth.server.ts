// Server only. Signs a visitor in to the website chat with a one-time code sent to their email, without
// needing the CRM. Nothing is stored: the code is tied to the request by a signature only this server can
// make, and a signed "pass" tells the chat who is asking.
//
// The signing secret is CHAT_AUTH_SECRET. If that is not set, one is made from the Zoho secrets, which
// are set anyway for sending mail. If neither exists, sign-in is off.

import { serverEnv } from "./env.server";
import { sendSimpleMail, mailConfigured } from "@/lib/notify-email.server";
import { signInCode } from "@/lib/email-templates.server";

export const WEB_PASS_PREFIX = "gw1_";
const CODE_MINUTES = 10;
const RESEND_SECONDS = 30;
const PASS_DAYS = 7;
const MAX_TRIES = 5;

const enc = new TextEncoder();
const dec = new TextDecoder();

export type WebPass = { name: string; phone: string; email: string; exp: number };

type Failure = { ok: false; status: number; message: string };
const fail = (status: number, message: string): Failure => ({ ok: false, status, message });

function secret(): string {
  const own = serverEnv("CHAT_AUTH_SECRET");
  if (own.length >= 16) return own;
  const derived = [serverEnv("ZOHO_CLIENT_SECRET"), serverEnv("ZOHO_REFRESH_TOKEN")].join("|");
  return derived.length >= 40 ? `chat|${derived}` : "";
}

const b64e = (text: string) => {
  let bin = "";
  for (const b of enc.encode(text)) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const b64d = (text: string) => {
  const bin = atob(text.replace(/-/g, "+").replace(/_/g, "/"));
  return dec.decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
};

async function sign(message: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const same = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
};

// ── limits ─────────────────────────────────────────────────────────────────────
// Best effort: each server instance keeps its own counts.
const counts = new Map<string, { n: number; since: number }>();
function tooMany(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const row = counts.get(key);
  if (!row || now - row.since > windowMs) {
    if (counts.size > 4000) counts.delete(counts.keys().next().value as string);
    counts.set(key, { n: 1, since: now });
    return false;
  }
  row.n += 1;
  return row.n > max;
}
const lastSent = new Map<string, number>();
const tries = new Map<string, number>();

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Makes a code, emails it, and hands back the signed challenge the browser must return with the code. */
export async function startSignIn(
  input: { name: unknown; phone: unknown; email: unknown },
  ip: string,
  origin: string,
): Promise<
  | { ok: true; challenge: string; resendAfterSeconds: number; validMinutes: number }
  | Failure
> {
  if (!secret() || !mailConfigured()) return fail(404, "Sign-in is not available just now.");
  const name = clean(input.name, 100);
  const phone = clean(input.phone, 15).replace(/\D/g, "").slice(-10);
  const email = clean(input.email, 160).toLowerCase();
  if (name.length < 2) return fail(400, "Please enter your name.");
  if (!/^[6-9]\d{9}$/.test(phone)) return fail(400, "Enter a valid 10-digit mobile number.");
  if (!/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(email)) return fail(400, "Enter a valid email address.");

  const now = Date.now();
  if (now - (lastSent.get(email) ?? 0) < RESEND_SECONDS * 1000)
    return fail(429, `Please wait ${RESEND_SECONDS} seconds before asking for another code.`);
  if (tooMany(`send-ip:${ip}`, 8, 3_600_000) || tooMany(`send-email:${email}`, 5, 3_600_000))
    return fail(429, "Too many codes were requested. Please try again in an hour, or call us.");

  const code = String(100_000 + (crypto.getRandomValues(new Uint32Array(1))[0]! % 900_000));
  const nonce = [...crypto.getRandomValues(new Uint8Array(8))].map((b) => b.toString(16).padStart(2, "0")).join("");
  const payload = b64e(JSON.stringify({ n: name, p: phone, e: email, x: now + CODE_MINUTES * 60_000, r: nonce }));
  const challenge = `${payload}.${await sign(`c|${payload}|${code}`)}`;

  const sent = await sendSimpleMail(
    email,
    `Your Growth Capital Services code: ${code}`,
    signInCode(origin, name.split(/\s+/)[0] ?? name, code),
  );
  if (!sent) return fail(503, "We couldn't send the code just now. Please try again, or call us.");
  lastSent.set(email, now);
  if (lastSent.size > 4000) lastSent.delete(lastSent.keys().next().value as string);
  return { ok: true, challenge, resendAfterSeconds: RESEND_SECONDS, validMinutes: CODE_MINUTES };
}

/** Checks the code against the challenge. On success returns the pass the chat accepts for a week. */
export async function finishSignIn(
  input: { challenge: unknown; code: unknown },
  ip: string,
): Promise<{ ok: true; token: string; expiresAt: string; name: string; phone: string; email: string } | Failure> {
  if (!secret()) return fail(404, "Sign-in is not available just now.");
  const challenge = clean(input.challenge, 800);
  const code = clean(input.code, 6);
  if (!/^\d{6}$/.test(code)) return fail(400, "The code is 6 digits.");
  if (tooMany(`verify-ip:${ip}`, 30, 600_000)) return fail(429, "Too many tries. Please wait a few minutes.");

  const [payload, sig] = challenge.split(".");
  if (!payload || !sig) return fail(400, "That code has expired. Please ask for a new one.");
  let data: { n: string; p: string; e: string; x: number; r: string };
  try {
    data = JSON.parse(b64d(payload));
  } catch {
    return fail(400, "That code has expired. Please ask for a new one.");
  }
  if (!(data.x > Date.now())) return fail(400, "That code has expired. Please ask for a new one.");

  const used = (tries.get(data.r) ?? 0) + 1;
  tries.set(data.r, used);
  if (tries.size > 4000) tries.delete(tries.keys().next().value as string);
  if (used > MAX_TRIES) return fail(400, "Too many wrong tries. Please ask for a new code.");

  if (!same(sig, await sign(`c|${payload}|${code}`))) {
    const left = MAX_TRIES - used;
    return fail(400, left > 0 ? `That code isn't right. ${left} ${left === 1 ? "try" : "tries"} left.` : "That code isn't right. Please ask for a new one.");
  }
  tries.set(data.r, MAX_TRIES + 1); // one code, one sign-in

  const exp = Date.now() + PASS_DAYS * 86_400_000;
  const body = b64e(JSON.stringify({ n: data.n, p: data.p, e: data.e, x: exp }));
  return {
    ok: true,
    token: `${WEB_PASS_PREFIX}${body}${await sign(`s|${body}`)}`,
    expiresAt: new Date(exp).toISOString(),
    name: data.n,
    phone: data.p,
    email: data.e,
  };
}

/** Is this a pass this server made, and is it still good? */
export async function readWebPass(token: string): Promise<WebPass | null> {
  if (!token.startsWith(WEB_PASS_PREFIX) || !secret()) return null;
  const rest = token.slice(WEB_PASS_PREFIX.length);
  const sig = rest.slice(-64);
  const body = rest.slice(0, -64);
  if (!/^[0-9a-f]{64}$/.test(sig) || !body) return null;
  if (!same(sig, await sign(`s|${body}`))) return null;
  try {
    const d = JSON.parse(b64d(body)) as { n: string; p: string; e: string; x: number };
    return d.x > Date.now() ? { name: d.n, phone: d.p, email: d.e, exp: d.x } : null;
  } catch {
    return null;
  }
}

export const webAuthReady = () => Boolean(secret()) && mailConfigured();
