// Server only. Handles one POST /api/chat: checks the request, limits abuse, asks the model
// (letting it use the tools in tools.server.ts) and streams the answer back as newline-delimited
// JSON events. The OpenAI key is read from the server's environment (OPENAI_API_KEY) and never
// reaches the browser.

import { CHAT_LIMITS, type ChatEvent, type ChatRequestBody, type ChatTurn } from "./config";
import { getSiteSnapshot } from "./site-data.server";
import { buildSystemPrompt } from "./prompt.server";
import { runTool } from "./tools.server";
import { streamChat, UpstreamError, type OpenAiMessage } from "./openai.server";
import { serverEnv as env } from "./env.server";
import { checkPass } from "./session.server";

// gpt-4.1 follows the formatting and honesty rules in the prompt noticeably better than gpt-4.1-mini
// (which tends to leave out page links) at about 5x the price per answer. Override with OPENAI_MODEL.
const DEFAULT_MODEL = "gpt-4.1";
/** Rounds of "model asks for tools, we answer". The last round must be plain text. */
const MAX_ROUNDS = 4;
const MAX_BODY_BYTES = 40_000;

const reply = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

// ── abuse limits ────────────────────────────────────────────────────────────
// Best effort: each server instance keeps its own counts. The hard backstop is the spending limit
// set on the OpenAI account.
const WINDOW_MS = 5 * 60_000;
const MAX_PER_WINDOW = 25;
const MAX_PER_DAY = 150;
const hits = new Map<string, number[]>();

function limited(ip: string): boolean {
  const now = Date.now();
  const day = (hits.get(ip) ?? []).filter((t) => now - t < 86_400_000);
  const recent = day.filter((t) => now - t < WINDOW_MS).length;
  if (recent >= MAX_PER_WINDOW || day.length >= MAX_PER_DAY) {
    hits.set(ip, day);
    return true;
  }
  day.push(now);
  hits.set(ip, day);
  if (hits.size > 5000) {
    for (const key of hits.keys()) {
      hits.delete(key);
      if (hits.size <= 4000) break;
    }
  }
  return false;
}

function clientIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

// ── request checking ────────────────────────────────────────────────────────

function readBody(raw: unknown): ChatRequestBody | null {
  if (!raw || typeof raw !== "object") return null;
  const b = raw as Record<string, unknown>;
  if (!Array.isArray(b["messages"])) return null;

  const turns: ChatTurn[] = [];
  for (const m of (b["messages"] as unknown[]).slice(-CHAT_LIMITS.maxTurns)) {
    if (!m || typeof m !== "object") continue;
    const { role, content } = m as Record<string, unknown>;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") continue;
    const clean = content
      .trim()
      .slice(0, role === "user" ? CHAT_LIMITS.maxUserChars : CHAT_LIMITS.maxAssistantChars);
    if (clean) turns.push({ role, content: clean });
  }
  while (turns.length > 0 && turns[0]!.role !== "user") turns.shift();
  if (turns.length === 0 || turns[turns.length - 1]!.role !== "user") return null;

  const lang =
    b["lang"] === "hi" || b["lang"] === "mr" || b["lang"] === "en" ? b["lang"] : undefined;
  const page = typeof b["page"] === "string" ? b["page"].slice(0, 120) : undefined;
  return { messages: turns, ...(page ? { page } : {}), ...(lang ? { lang } : {}) };
}

// ── the conversation ────────────────────────────────────────────────────────

async function converse(opts: {
  body: ChatRequestBody;
  origin: string;
  apiKey: string;
  model: string;
  send: (e: ChatEvent) => void;
  signal: AbortSignal;
}): Promise<void> {
  const snapshot = await getSiteSnapshot(opts.origin);
  const messages: OpenAiMessage[] = [
    {
      role: "system",
      content: buildSystemPrompt(snapshot, { page: opts.body.page, lang: opts.body.lang }),
    },
    ...opts.body.messages.map((m): OpenAiMessage => ({ role: m.role, content: m.content })),
  ];

  const started = Date.now();
  let promptTokens = 0;
  let completionTokens = 0;
  let spoke = false;
  let rounds = 0;

  for (let round = 0; round < MAX_ROUNDS; round++) {
    rounds++;
    let text = "";
    let toolCalls: { id: string; name: string; arguments: string }[] = [];

    // Text said before a tool call ("let me work that out") is shown, then a tool runs, then the
    // answer follows; keep a paragraph break between the two so they don't run together.
    if (spoke && round > 0) opts.send({ t: "d", v: "\n\n" });

    for await (const piece of streamChat({
      apiKey: opts.apiKey,
      model: opts.model,
      messages,
      allowTools: round < MAX_ROUNDS - 1,
      signal: opts.signal,
    })) {
      if (piece.type === "text") {
        text += piece.delta;
        spoke = true;
        opts.send({ t: "d", v: piece.delta });
      } else {
        toolCalls = piece.toolCalls;
        promptTokens += piece.usage?.prompt ?? 0;
        completionTokens += piece.usage?.completion ?? 0;
      }
    }

    if (toolCalls.length === 0) break;

    messages.push({
      role: "assistant",
      content: text || null,
      tool_calls: toolCalls.map((c) => ({
        id: c.id,
        type: "function",
        function: { name: c.name, arguments: c.arguments },
      })),
    });
    for (const call of toolCalls) {
      const out = runTool(call.name, call.arguments, snapshot);
      if (out.card) opts.send({ t: "card", v: out.card });
      if (out.form) opts.send({ t: "form", v: out.form });
      messages.push({ role: "tool", tool_call_id: call.id, content: JSON.stringify(out.result) });
    }
  }

  if (!spoke) {
    opts.send({
      t: "d",
      v: "I couldn't put an answer together for that. Could you rephrase it, or would you like to talk to one of our advisors?",
    });
  }

  // Usage only: no message content or visitor details are logged.
  console.info(
    "[chat]",
    JSON.stringify({
      model: opts.model,
      rounds,
      promptTokens,
      completionTokens,
      ms: Date.now() - started,
      crm: snapshot.fromCrm,
    }),
  );
}

export async function handleChat(request: Request): Promise<Response> {
  // Block other websites from calling this from a visitor's browser and spending our credit.
  if (request.headers.get("sec-fetch-site") === "cross-site")
    return reply(403, { error: "forbidden" });

  const apiKey = env("OPENAI_API_KEY");
  if (!apiKey) return reply(503, { error: "unavailable" });

  if (limited(clientIp(request))) return reply(429, { error: "rate_limited" });

  // Only visitors who confirmed their mobile number with a code may ask anything. The pass comes
  // from the CRM; if the CRM cannot be asked, nobody is let in rather than everybody.
  const origin = new URL(request.url).origin;
  const pass = await checkPass(request.headers.get("x-chat-token") ?? "", origin);
  if (pass === "invalid") return reply(401, { error: "auth_required" });
  if (pass === "unreachable") return reply(503, { error: "unavailable" });

  // Refuse an oversized body before reading it, then again after, in case the length was not declared.
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES)
    return reply(413, { error: "too_large" });
  const rawText = await request.text();
  if (rawText.length > MAX_BODY_BYTES) return reply(413, { error: "too_large" });
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    return reply(400, { error: "bad_request" });
  }
  const body = readBody(parsed);
  if (!body) return reply(400, { error: "bad_request" });

  const model = env("OPENAI_MODEL") || DEFAULT_MODEL;
  const encoder = new TextEncoder();
  const abort = new AbortController();
  request.signal.addEventListener("abort", () => abort.abort());

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (e: ChatEvent) => {
        try {
          controller.enqueue(encoder.encode(`${JSON.stringify(e)}\n`));
        } catch {
          // the visitor closed the chat mid-answer
        }
      };
      try {
        await converse({ body, origin, apiKey, model, send, signal: abort.signal });
        send({ t: "done" });
      } catch (err) {
        if (abort.signal.aborted) {
          // the visitor stopped the answer; nothing more to say
        } else if (err instanceof UpstreamError) {
          // 401/403 = bad key, 429 = out of credit or rate limited: the assistant is out of service
          // until someone fixes the account. Log the status only, never the key.
          console.error("[chat] AI service error", err.status, err.message.slice(0, 200));
          const down = err.status === 401 || err.status === 403 || err.status === 429;
          send({
            t: "error",
            code: down ? "unavailable" : "failed",
            v: "I'm having trouble answering right now.",
          });
        } else {
          console.error("[chat] unexpected error", err);
          send({ t: "error", code: "failed", v: "Something went wrong on my side." });
        }
      } finally {
        try {
          controller.close();
        } catch {
          // already closed
        }
      }
    },
    cancel() {
      abort.abort();
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-store",
      "x-accel-buffering": "no",
    },
  });
}
