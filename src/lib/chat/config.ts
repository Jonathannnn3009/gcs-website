// Shared by the chat widget (browser) and the /api/chat route (server). Nothing secret lives here.

/** The assistant's temporary name. Change it here and it changes everywhere (widget, greeting, prompt). */
export const ASSISTANT_NAME = "Gia";
export const ASSISTANT_ROLE = "GCS AI assistant";

export type ChatRole = "user" | "assistant";
export type ChatTurn = { role: ChatRole; content: string };

/** A small result panel the assistant shows after a calculation, so the numbers are easy to read. */
export type ResultCard = {
  title: string;
  /** The one figure that matters, shown large. */
  headline?: { label: string; value: string };
  rows: { label: string; value: string }[];
  note?: string;
  link?: { label: string; href: string };
};

/** Asks the widget to show its short "request a call" form. */
export type CallbackRequest = { reason: string; interest?: string };

/** One line of the streamed reply (newline-delimited JSON). */
export type ChatEvent =
  | { t: "d"; v: string }
  | { t: "card"; v: ResultCard }
  | { t: "form"; v: CallbackRequest }
  | { t: "done" }
  | { t: "error"; v: string; code: "unavailable" | "rate_limited" | "failed" };

export type ChatRequestBody = {
  messages: ChatTurn[];
  /** The page the visitor is on, e.g. /services/home-loan, so answers can fit it. */
  page?: string;
  /** The language the visitor reads the site in. */
  lang?: "en" | "hi" | "mr";
};

export const CHAT_LIMITS = {
  /** How many of the latest messages are sent with each question. */
  maxTurns: 14,
  maxUserChars: 1000,
  maxAssistantChars: 4000,
} as const;
