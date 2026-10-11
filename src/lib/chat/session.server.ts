// Server only. Before answering, the chat route asks the CRM whether the visitor's pass is good.
// A pass the CRM approved is trusted for a few minutes so a conversation isn't a CRM call per message.

import { crmBase } from "./site-data.server";

export type PassCheck = "valid" | "invalid" | "unreachable";

const TRUST_MS = 5 * 60_000;
const MAX_REMEMBERED = 2000;
const approved = new Map<string, number>();

export async function checkPass(token: string, origin: string): Promise<PassCheck> {
  if (!/^[\w-]{20,200}$/.test(token)) return "invalid";

  const at = approved.get(token);
  if (at && Date.now() - at < TRUST_MS) return "valid";
  approved.delete(token);

  try {
    const res = await fetch(`${crmBase(origin)}/public/chat-auth/session`, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ token }),
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return "unreachable";
    const json = (await res.json()) as { valid?: unknown };
    if (json.valid !== true) return "invalid";
  } catch {
    return "unreachable";
  }

  if (approved.size >= MAX_REMEMBERED) approved.delete(approved.keys().next().value as string);
  approved.set(token, Date.now());
  return "valid";
}
