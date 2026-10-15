// Server only. A small streaming client for OpenAI's Chat Completions API. It uses plain fetch so
// it runs unchanged on the Node dev server and on Cloudflare Workers. The API key is passed in by
// the caller and is never logged or sent anywhere except api.openai.com.

import { TOOL_DEFINITIONS } from "./tools.server";

export type OpenAiMessage =
  | { role: "system" | "user"; content: string }
  | {
      role: "assistant";
      content: string | null;
      tool_calls?: {
        id: string;
        type: "function";
        function: { name: string; arguments: string };
      }[];
    }
  | { role: "tool"; tool_call_id: string; content: string };

export type ToolCall = { id: string; name: string; arguments: string };

export type StreamPiece =
  | { type: "text"; delta: string }
  | {
      type: "done";
      toolCalls: ToolCall[];
      finish: string;
      usage?: { prompt: number; completion: number };
    };

/** The API refused or failed. `status` is OpenAI's HTTP status (0 for a network failure or timeout). */
export class UpstreamError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

type Chunk = {
  choices?: {
    delta?: {
      content?: string | null;
      tool_calls?: {
        index: number;
        id?: string;
        function?: { name?: string; arguments?: string };
      }[];
    };
    finish_reason?: string | null;
  }[];
  usage?: { prompt_tokens?: number; completion_tokens?: number } | null;
};

const REQUEST_TIMEOUT_MS = 60_000;
/** An attempt that has not started answering by now is dropped and tried again. */
const FIRST_BYTE_MS = 12_000;
const REASONING_MODEL = /^(o\d|gpt-5)/;

export async function* streamChat(opts: {
  apiKey: string;
  model: string;
  messages: OpenAiMessage[];
  /** When false the model must answer in text and may not call tools (used on the last round). */
  allowTools: boolean;
  signal?: AbortSignal;
}): AsyncGenerator<StreamPiece> {
  const body: Record<string, unknown> = {
    model: opts.model,
    messages: opts.messages,
    stream: true,
    stream_options: { include_usage: true },
    max_completion_tokens: 700,
    tools: TOOL_DEFINITIONS,
    tool_choice: opts.allowTools ? "auto" : "none",
  };
  if (REASONING_MODEL.test(opts.model)) body["reasoning_effort"] = "low";
  else body["temperature"] = 0.3;

  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), REQUEST_TIMEOUT_MS);
  const onClientAbort = () => abort.abort();
  opts.signal?.addEventListener("abort", onClientAbort);

  try {
    let res: Response | undefined;
    // A connection that went stale, or a request that stalls before answering, is dropped and
    // tried again on a fresh one. Once the answer has started, nothing is retried.
    let stream: AbortController = abort;
    for (let attempt = 1; !res; attempt++) {
      stream = new AbortController();
      const stop = () => stream.abort();
      abort.signal.addEventListener("abort", stop);
      const stall = setTimeout(stop, FIRST_BYTE_MS);
      try {
        res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { "content-type": "application/json", authorization: `Bearer ${opts.apiKey}` },
          body: JSON.stringify(body),
          signal: stream.signal,
        });
      } catch (err) {
        if (abort.signal.aborted || attempt >= 3) {
          const cause = (err as { cause?: { code?: unknown } } | null)?.cause?.code;
          throw new UpstreamError(
            0,
            `Could not reach the AI service${typeof cause === "string" ? ` (${cause})` : ""}`,
          );
        }
        await new Promise((r) => setTimeout(r, 300 * attempt));
      } finally {
        clearTimeout(stall);
      }
    }
    if (!res.ok || !res.body) {
      const detail = (await res.text().catch(() => "")).slice(0, 300);
      throw new UpstreamError(res.status, detail || `AI service returned ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    const calls = new Map<number, ToolCall>();
    let buffer = "";
    let finish = "";
    let usage: { prompt: number; completion: number } | undefined;

    for (;;) {
      let step: ReadableStreamReadResult<Uint8Array>;
      try {
        step = await reader.read();
      } catch {
        throw new UpstreamError(0, "The AI service stopped responding");
      }
      if (step.done) break;
      buffer += decoder.decode(step.value, { stream: true });

      let newline: number;
      while ((newline = buffer.indexOf("\n")) >= 0) {
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (!data || data === "[DONE]") continue;

        let chunk: Chunk;
        try {
          chunk = JSON.parse(data) as Chunk;
        } catch {
          continue;
        }
        if (chunk.usage) {
          usage = {
            prompt: chunk.usage.prompt_tokens ?? 0,
            completion: chunk.usage.completion_tokens ?? 0,
          };
        }
        const choice = chunk.choices?.[0];
        if (!choice) continue;
        const text = choice.delta?.content;
        if (text) yield { type: "text", delta: text };
        for (const tc of choice.delta?.tool_calls ?? []) {
          const cur = calls.get(tc.index) ?? { id: "", name: "", arguments: "" };
          if (tc.id) cur.id = tc.id;
          if (tc.function?.name) cur.name += tc.function.name;
          if (tc.function?.arguments) cur.arguments += tc.function.arguments;
          calls.set(tc.index, cur);
        }
        if (choice.finish_reason) finish = choice.finish_reason;
      }
    }

    yield {
      type: "done",
      toolCalls: [...calls.entries()].sort((a, b) => a[0] - b[0]).map(([, c]) => c),
      finish,
      ...(usage ? { usage } : {}),
    };
  } finally {
    clearTimeout(timer);
    opts.signal?.removeEventListener("abort", onClientAbort);
  }
}
