// Server only. Gia on WhatsApp: receives a customer's message from Meta's WhatsApp Cloud API
// (webhook), asks Gia for the answer (the same instructions, tools and topic check as the website
// chat) and sends it back through Meta's API. Nothing here runs unless WHATSAPP_ENABLED is on.
//
// Server settings (Cloudflare secrets, or .env locally):
//   WHATSAPP_ENABLED          "1" turns the whole thing on; anything else makes the webhook do nothing.
//   WHATSAPP_VERIFY_TOKEN     a word we choose and paste into Meta's webhook setup.
//   WHATSAPP_APP_SECRET       the Meta app's secret, used to check that a request really came from Meta.
//   WHATSAPP_ACCESS_TOKEN     the system user's permanent token, used to send replies.
//   WHATSAPP_PHONE_NUMBER_ID  the number's ID (not the phone number itself).
//   WHATSAPP_API_VERSION      optional, defaults to DEFAULT_API_VERSION.
//   WHATSAPP_GRAPH_URL        optional, only for testing against a stand-in for Meta's API.
//   OPENAI_API_KEY            already set for the website chat.

import { ASSISTANT_NAME, OFF_TOPIC, type ChatEvent, type ChatTurn } from "@/lib/chat/config";
import { serverEnv as env } from "@/lib/chat/env.server";
import { classifyTopic, offTopicReply } from "@/lib/chat/guard.server";
import { converse } from "@/lib/chat/handler.server";
import { UpstreamError } from "@/lib/chat/openai.server";
import { getSiteSnapshot } from "@/lib/chat/site-data.server";

const DEFAULT_API_VERSION = "v23.0";
const DEFAULT_MODEL = "gpt-4.1";
/** WhatsApp refuses a text longer than 4096 characters. */
const MAX_REPLY_CHARS = 3800;
/** A whole answer (topic check, model, tools, sending) must fit in this, or Meta retries the webhook. */
const BUDGET_MS = 25_000;

export const whatsappEnabled = () => env("WHATSAPP_ENABLED") === "1";

// ── is this really Meta? ────────────────────────────────────────────────────

const hex = (bytes: ArrayBuffer) =>
  [...new Uint8Array(bytes)].map((b) => b.toString(16).padStart(2, "0")).join("");

/** Meta signs every webhook body with the app secret: header `x-hub-signature-256: sha256=<hex>`. */
export async function validSignature(rawBody: string, header: string | null): Promise<boolean> {
  const secret = env("WHATSAPP_APP_SECRET");
  if (!secret || !header?.startsWith("sha256=")) return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const expected = hex(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody)));
  const given = header.slice("sha256=".length).toLowerCase();
  if (given.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ given.charCodeAt(i);
  return diff === 0;
}

/** Meta's one-time handshake when the webhook address is saved in the developer app. */
export function answerHandshake(url: URL): Response {
  const token = env("WHATSAPP_VERIFY_TOKEN");
  const ok =
    whatsappEnabled() &&
    token !== "" &&
    url.searchParams.get("hub.mode") === "subscribe" &&
    url.searchParams.get("hub.verify_token") === token;
  const challenge = url.searchParams.get("hub.challenge") ?? "";
  return ok ? new Response(challenge, { status: 200 }) : new Response("Forbidden", { status: 403 });
}

// ── what Meta sends ─────────────────────────────────────────────────────────

export type Incoming = {
  /** Meta's message ID, unique per message. */
  id: string;
  /** The customer's number in international form without "+", e.g. 919820012345. */
  from: string;
  /** The text, or null when the message is a picture, voice note, location and so on. */
  text: string | null;
};

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/** The customer messages in one webhook call that were sent to our number (delivery receipts are ignored). */
export function readIncoming(payload: unknown): Incoming[] {
  const out: Incoming[] = [];
  const ours = env("WHATSAPP_PHONE_NUMBER_ID");
  if (!isObject(payload) || !Array.isArray(payload["entry"])) return out;
  for (const entry of payload["entry"] as unknown[]) {
    const changes = isObject(entry) && Array.isArray(entry["changes"]) ? entry["changes"] : [];
    for (const change of changes as unknown[]) {
      const value = isObject(change) && isObject(change["value"]) ? change["value"] : null;
      if (!value || !Array.isArray(value["messages"])) continue;
      const meta = isObject(value["metadata"]) ? value["metadata"] : {};
      if (ours && meta["phone_number_id"] !== ours) continue;
      for (const m of value["messages"] as unknown[]) {
        if (!isObject(m) || typeof m["id"] !== "string" || typeof m["from"] !== "string") continue;
        if (!/^\d{8,15}$/.test(m["from"])) continue;
        const body =
          isObject(m["text"]) && typeof m["text"]["body"] === "string" ? m["text"]["body"] : "";
        out.push({
          id: m["id"],
          from: m["from"],
          text: m["type"] === "text" && body.trim() ? body.trim().slice(0, 1000) : null,
        });
      }
    }
  }
  return out;
}

// ── limits and memory ───────────────────────────────────────────────────────
// Best effort: each server instance keeps its own counts and conversations, which is plenty for the
// first stage. The hard backstop is the spending limit on the OpenAI account.

const DAY_MS = 86_400_000;
const MAX_PER_NUMBER_PER_DAY = 40;
const MAX_PER_DAY_ALL = 600;
const MAX_TURNS = 10;

const seenMessages = new Map<string, number>();
const dayHits = new Map<string, number[]>();
let allHits: number[] = [];
const talks = new Map<string, { turns: ChatTurn[]; last: number }>();
const strikes = new Map<string, { n: number; last: number; pausedUntil: number }>();

function trim<K, V>(map: Map<K, V>, max: number) {
  if (map.size <= max) return;
  for (const k of map.keys()) {
    map.delete(k);
    if (map.size <= max * 0.8) break;
  }
}

/** Meta repeats a webhook it thinks failed, so a message already handled is skipped. */
function firstTime(id: string): boolean {
  if (seenMessages.has(id)) return false;
  seenMessages.set(id, Date.now());
  trim(seenMessages, 5000);
  return true;
}

function overLimit(number: string): boolean {
  const now = Date.now();
  allHits = allHits.filter((t) => now - t < DAY_MS);
  const mine = (dayHits.get(number) ?? []).filter((t) => now - t < DAY_MS);
  if (allHits.length >= MAX_PER_DAY_ALL || mine.length >= MAX_PER_NUMBER_PER_DAY) {
    dayHits.set(number, mine);
    return true;
  }
  allHits.push(now);
  mine.push(now);
  dayHits.set(number, mine);
  trim(dayHits, 5000);
  return false;
}

function pausedUntil(number: string): number {
  const row = strikes.get(number);
  return row && row.pausedUntil > Date.now() ? row.pausedUntil : 0;
}

/** Counts an off-topic message; the same limits as the website chat (OFF_TOPIC in chat/config.ts). */
function strike(number: string): { left: number; paused: boolean } {
  const now = Date.now();
  const row = strikes.get(number);
  const startOver =
    !row ||
    now - row.last > OFF_TOPIC.strikeMemoryHours * 3_600_000 ||
    (row.pausedUntil > 0 && row.pausedUntil <= now);
  const n = (startOver ? 0 : row.n) + 1;
  const until = n >= OFF_TOPIC.strikeLimit ? now + OFF_TOPIC.pauseMinutes * 60_000 : 0;
  strikes.set(number, { n, last: now, pausedUntil: until });
  trim(strikes, 5000);
  return { left: Math.max(0, OFF_TOPIC.strikeLimit - n), paused: until > now };
}

function remember(number: string, turns: ChatTurn[]) {
  talks.set(number, { turns: turns.slice(-MAX_TURNS), last: Date.now() });
  trim(talks, 2000);
}

function recall(number: string): ChatTurn[] {
  const row = talks.get(number);
  return row && Date.now() - row.last < DAY_MS ? row.turns : [];
}

// ── turning Gia's answer into a WhatsApp message ────────────────────────────

/** Gia writes the website's markdown. WhatsApp wants *bold* and full links, and has no cards. */
export function toWhatsAppText(raw: string, origin: string): string {
  return raw
    .replace(
      /\[([^\]]+)\]\((\/[^)\s]*)\)/g,
      (_m, label: string, path: string) => `${label}: ${origin}${path}`,
    )
    .replace(/\*\*([^*]+)\*\*/g, "*$1*")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function cardText(e: Extract<ChatEvent, { t: "card" }>, origin: string): string {
  const c = e.v;
  const lines = [`*${c.title}*`];
  if (c.headline) lines.push(`${c.headline.label}: *${c.headline.value}*`);
  for (const r of c.rows) lines.push(`${r.label}: ${r.value}`);
  if (c.note) lines.push(`_${c.note}_`);
  if (c.link)
    lines.push(`${c.link.label}: ${c.link.href.startsWith("/") ? origin : ""}${c.link.href}`);
  return lines.join("\n");
}

// ── sending ─────────────────────────────────────────────────────────────────

async function sendText(to: string, body: string, signal: AbortSignal): Promise<boolean> {
  const token = env("WHATSAPP_ACCESS_TOKEN");
  const phoneId = env("WHATSAPP_PHONE_NUMBER_ID");
  if (!token || !phoneId) return false;
  const version = env("WHATSAPP_API_VERSION") || DEFAULT_API_VERSION;
  try {
    const graph = env("WHATSAPP_GRAPH_URL") || "https://graph.facebook.com";
    const res = await fetch(`${graph}/${version}/${phoneId}/messages`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${token}` },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { preview_url: true, body: body.slice(0, MAX_REPLY_CHARS) },
      }),
      signal,
    });
    if (!res.ok) console.error("[whatsapp] send failed", res.status); // status only, never the token or the text
    return res.ok;
  } catch {
    return false;
  }
}

// ── one customer message ────────────────────────────────────────────────────

const NOT_TEXT = `Thanks for your message. I can read text messages only, so please type your question about a loan, your EMI, documents or eligibility and I'll help.`;

async function answer(msg: Incoming, origin: string, signal: AbortSignal): Promise<string> {
  if (msg.text === null) return NOT_TEXT;

  const apiKey = env("OPENAI_API_KEY");
  const snapshot = await getSiteSnapshot(origin);
  const phone = snapshot.contact.phone;
  if (!apiKey) return `I can't answer right now. Please call us on ${phone}.`;

  const until = pausedUntil(msg.from);
  if (until > Date.now()) return ""; // paused for off-topic messages: stay quiet until it ends

  const turns: ChatTurn[] = [...recall(msg.from), { role: "user", content: msg.text }];

  const verdict = await classifyTopic({
    apiKey,
    model: env("OPENAI_GUARD_MODEL"),
    turns,
    signal,
  });
  if (verdict === "off_topic") {
    const s = strike(msg.from);
    return offTopicReply(undefined, s.left, s.paused);
  }

  let text = "";
  const cards: Extract<ChatEvent, { t: "card" }>[] = [];
  const extra: string[] = [];
  let wantsPerson = false;
  await converse({
    body: { messages: turns },
    origin,
    apiKey,
    model: env("OPENAI_MODEL") || DEFAULT_MODEL,
    signal,
    send: (e: ChatEvent) => {
      if (e.t === "d") text += e.v;
      else if (e.t === "card") cards.push(e);
      else if (e.t === "form") wantsPerson = true;
    },
  });

  // A calculation's card repeats the answer; send it only when the text left out its main figure.
  for (const card of cards)
    if (!card.v.headline || !text.includes(card.v.headline.value))
      extra.push(cardText(card, origin));

  // The website shows a callback form here; WhatsApp cannot, so point to the other ways in.
  if (wantsPerson)
    extra.push(
      `To talk to one of our experts, call or WhatsApp ${phone}, or send a request at ${origin}/contact.`,
    );

  const reply = toWhatsAppText([text.trim(), ...extra].filter(Boolean).join("\n\n"), origin);
  remember(msg.from, [...turns, { role: "assistant", content: reply || "…" }]);
  return reply;
}

/**
 * Handles everything in one verified webhook call. It never throws: Meta must get a quick "200" or it
 * keeps retrying, and a failure on our side must not look like one to the customer.
 */
export async function handleWebhook(payload: unknown, origin: string): Promise<void> {
  const signal = AbortSignal.timeout(BUDGET_MS);
  for (const msg of readIncoming(payload)) {
    if (!firstTime(msg.id)) continue;
    try {
      if (overLimit(msg.from)) continue;
      let reply = await answer(msg, origin, signal);
      if (!reply) continue;
      if (!(await sendText(msg.from, reply, signal))) console.error("[whatsapp] reply not sent");
    } catch (err) {
      console.error(
        "[whatsapp] could not answer",
        err instanceof UpstreamError ? err.status : "error",
      );
      const phone = (await getSiteSnapshot(origin).catch(() => null))?.contact.phone;
      await sendText(
        msg.from,
        `I'm having trouble answering right now. Please call or WhatsApp us${phone ? ` on ${phone}` : ""} and one of our experts will help.`,
        AbortSignal.timeout(8000),
      );
    }
  }
  console.info("[whatsapp] handled", JSON.stringify({ assistant: ASSISTANT_NAME }));
}
