// Server only. Before answering, the chat route asks the CRM whether the visitor's pass is good, and
// whether the chat is paused for that visitor's number after too many off-topic messages.
// A pass the CRM approved is trusted for a few minutes so a conversation isn't a CRM call per message.

import { OFF_TOPIC } from "./config";
import { crmBase } from "./site-data.server";
import { readWebPass, WEB_PASS_PREFIX } from "./web-auth.server";

export type PassCheck =
  /** `pausedUntil` is a time in ms, or null when the chat is open. */
  | { status: "valid"; pausedUntil: number | null }
  | { status: "invalid" }
  | { status: "unreachable" };

export type StrikeResult = {
  strikes: number;
  /** How many more off-topic messages are allowed before the pause. */
  left: number;
  pausedUntil: number | null;
};

const TRUST_MS = 5 * 60_000;
const MAX_REMEMBERED = 2000;
const approved = new Map<string, { at: number; pausedUntil: number | null }>();

const asTime = (iso: unknown): number | null => {
  const t = typeof iso === "string" ? Date.parse(iso) : NaN;
  return Number.isFinite(t) && t > Date.now() ? t : null;
};

function remember(token: string, pausedUntil: number | null) {
  if (approved.size >= MAX_REMEMBERED && !approved.has(token))
    approved.delete(approved.keys().next().value as string);
  approved.set(token, { at: Date.now(), pausedUntil });
}

export async function checkPass(token: string, origin: string): Promise<PassCheck> {
  // A pass made by this website (sign-in by emailed code) needs no CRM: its signature is the proof.
  if (token.startsWith(WEB_PASS_PREFIX)) {
    const web = await readWebPass(token);
    if (!web) return { status: "invalid" };
    const row = localStrikes.get(`ws:${web.phone}`);
    return { status: "valid", pausedUntil: row?.pausedUntil && row.pausedUntil > Date.now() ? row.pausedUntil : null };
  }
  if (!/^[\w-]{20,200}$/.test(token)) return { status: "invalid" };

  const seen = approved.get(token);
  if (seen && Date.now() - seen.at < TRUST_MS)
    return {
      status: "valid",
      pausedUntil: seen.pausedUntil && seen.pausedUntil > Date.now() ? seen.pausedUntil : null,
    };
  approved.delete(token);

  let pausedUntil: number | null = null;
  try {
    const res = await fetch(`${crmBase(origin)}/public/chat-auth/session`, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ token }),
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return { status: "unreachable" };
    const json = (await res.json()) as { valid?: unknown; blockedUntil?: unknown };
    if (json.valid !== true) return { status: "invalid" };
    pausedUntil = asTime(json.blockedUntil);
  } catch {
    return { status: "unreachable" };
  }

  remember(token, pausedUntil);
  return { status: "valid", pausedUntil };
}

// If the CRM cannot be asked to keep the count, this instance keeps its own so the limit still holds.
const localStrikes = new Map<
  string,
  { strikes: number; last: number; pausedUntil: number | null }
>();

function strikeLocally(token: string): StrikeResult {
  const now = Date.now();
  const row = localStrikes.get(token);
  const fresh =
    !row ||
    (row.pausedUntil !== null && row.pausedUntil <= now) ||
    now - row.last > OFF_TOPIC.strikeMemoryHours * 3_600_000;
  const paused = row && row.pausedUntil && row.pausedUntil > now ? row.pausedUntil : null;
  const strikes = paused ? row!.strikes : (fresh ? 0 : row!.strikes) + 1;
  const pausedUntil =
    paused ?? (strikes >= OFF_TOPIC.strikeLimit ? now + OFF_TOPIC.pauseMinutes * 60_000 : null);
  if (localStrikes.size > 2000) localStrikes.delete(localStrikes.keys().next().value as string);
  localStrikes.set(token, { strikes, last: now, pausedUntil });
  return { strikes, left: Math.max(0, OFF_TOPIC.strikeLimit - strikes), pausedUntil };
}

/** Counts one off-topic message against the visitor's number (kept by the CRM between visits). */
export async function recordStrike(token: string, origin: string): Promise<StrikeResult> {
  if (token.startsWith(WEB_PASS_PREFIX)) {
    const web = await readWebPass(token);
    return strikeLocally(`ws:${web?.phone ?? token.slice(0, 40)}`);
  }
  try {
    const res = await fetch(`${crmBase(origin)}/public/chat-auth/strike`, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ token }),
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      const json = (await res.json()) as {
        valid?: unknown;
        strikes?: unknown;
        left?: unknown;
        blockedUntil?: unknown;
      };
      if (
        json.valid === true &&
        typeof json.strikes === "number" &&
        typeof json.left === "number"
      ) {
        const result: StrikeResult = {
          strikes: json.strikes,
          left: json.left,
          pausedUntil: asTime(json.blockedUntil),
        };
        remember(token, result.pausedUntil);
        return result;
      }
    }
  } catch {
    // fall through to the local count
  }
  const result = strikeLocally(token);
  remember(token, result.pausedUntil);
  return result;
}
