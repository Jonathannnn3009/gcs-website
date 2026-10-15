// Browser side: sends the conversation to /api/chat and hands each streamed event to the widget.

import type { ChatEvent, ChatRequestBody } from "./config";

/** The server answered with an error status instead of a stream. */
export class ChatHttpError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    /** When a paused chat opens again (an ISO time), if the server said. */
    readonly until?: string,
  ) {
    super(code);
  }
}

export async function streamChatReply(
  body: ChatRequestBody,
  token: string,
  onEvent: (event: ChatEvent) => void,
  signal: AbortSignal,
): Promise<void> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json", "x-chat-token": token },
    body: JSON.stringify(body),
    signal,
  });

  if (!res.ok || !res.body) {
    let code = "failed";
    let until: string | undefined;
    try {
      const json = (await res.json()) as { error?: unknown; until?: unknown };
      if (typeof json.error === "string") code = json.error;
      if (typeof json.until === "string") until = json.until;
    } catch {
      // the body was not JSON; keep the generic code
    }
    throw new ChatHttpError(res.status, code, until);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const flush = (line: string) => {
    if (!line) return;
    try {
      onEvent(JSON.parse(line) as ChatEvent);
    } catch {
      // ignore a malformed line rather than lose the whole answer
    }
  };

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let newline: number;
    while ((newline = buffer.indexOf("\n")) >= 0) {
      flush(buffer.slice(0, newline).trim());
      buffer = buffer.slice(newline + 1);
    }
  }
  flush(buffer.trim());
}
