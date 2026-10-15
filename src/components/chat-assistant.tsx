import { useCallback, useEffect, useId, useRef, useState } from "react";
import { GiaOrb, type GiaMood } from "@/components/gia-orb";
import { useRouter, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Check, Phone, RotateCcw, Send, Square, X } from "lucide-react";
import { ChatGate } from "@/components/chat-gate";
import { ChatMarkdown } from "@/components/chat-markdown";
import { CONTACT } from "@/data/site";
import { normalizePhone } from "@/lib/lead-dedupe";
import { submitLead } from "@/lib/leads";
import { useLanguage } from "@/lib/language";
import {
  ASSISTANT_NAME,
  ASSISTANT_ROLE,
  CHAT_LIMITS,
  type CallbackRequest,
  type ChatEvent,
  type ChatRole,
  type ChatTurn,
  type ResultCard,
} from "@/lib/chat/config";
import { ChatHttpError, streamChatReply } from "@/lib/chat/stream";
import { clearPass, endPass, loadPass, type ChatPass } from "@/lib/chat/auth";

// The website's AI assistant: a launcher in the corner that opens a chat panel. Answers come from
// /api/chat (the server holds the OpenAI key). Calculations show up as small result cards, and
// "talk to an expert" turns into a short callback form that lands in the CRM as a lead.

type Part =
  | { kind: "text"; text: string }
  | { kind: "card"; card: ResultCard }
  | { kind: "form"; req: CallbackRequest; state: "open" | "sent"; name?: string }
  | {
      kind: "error";
      code: "unavailable" | "rate_limited" | "failed" | "paused";
      text: string;
      /** The visitor's message, so "Try again" can ask it once more. */
      retry?: string;
    };

type Msg = { id: string; role: ChatRole; parts: Part[] };

const STORAGE_KEY = "gcs.chat.v1";
/** Remembers, for the number that was turned away, when its chat opens again. */
const PAUSE_KEY = "gcs.chat.paused.v1";
const MAX_STORED = 40;

const QUICK_ACTIONS = [
  {
    label: "Check my eligibility",
    prompt: "I'd like to check how much home loan I may be eligible for.",
  },
  { label: "Calculate my EMI", prompt: "Help me calculate my EMI." },
  { label: "Documents needed", prompt: "What documents do I need for a home loan?" },
  {
    label: "Lower my EMI",
    prompt: "I have an existing home loan. Can I save money by transferring it to another lender?",
  },
  { label: "Credit score help", prompt: "How can I check and improve my credit score?" },
  {
    label: "Project approval (APF)",
    prompt: "How do I check whether a housing project is bank-approved?",
  },
  { label: "Track my application", prompt: "I want to know the status of my loan application." },
  { label: "Talk to an expert", prompt: "I'd like to talk to an expert." },
];

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

type ErrorCode = Extract<Part, { kind: "error" }>["code"];

const clockTime = (at: number) =>
  new Date(at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

function pausedText(until: number): string {
  return `This chat is paused for now because the questions weren't about loans or Growth Capital Services. It opens again around ${clockTime(until)}. For anything about your loan, our experts can help right away:`;
}

function errorText(code: ErrorCode): string {
  if (code === "paused")
    return "This chat is paused for now. For anything about your loan, our experts can help right away:";
  if (code === "rate_limited")
    return "You're sending messages quickly. Please wait a minute and try again.";
  if (code === "unavailable")
    return `${ASSISTANT_NAME} isn't available right now, but our team is. You can reach an expert here:`;
  return "I couldn't get an answer just now. Please try again, or reach us directly.";
}

function applyEvent(parts: Part[], e: ChatEvent, retry?: string): Part[] {
  switch (e.t) {
    case "d": {
      const last = parts[parts.length - 1];
      if (last?.kind === "text")
        return [...parts.slice(0, -1), { kind: "text", text: last.text + e.v }];
      return [...parts, { kind: "text", text: e.v }];
    }
    case "card":
      return [...parts, { kind: "card", card: e.v }];
    case "form":
      return [...parts, { kind: "form", req: e.v, state: "open" }];
    case "paused":
      return [...parts, { kind: "error", code: "paused", text: e.v }];
    case "error":
      return [
        ...parts,
        { kind: "error", code: e.code, text: errorText(e.code), ...(retry ? { retry } : {}) },
      ];
    default:
      return parts;
  }
}

const textOf = (m: Msg) =>
  m.parts
    .filter((p): p is Extract<Part, { kind: "text" }> => p.kind === "text")
    .map((p) => p.text)
    .join("\n\n")
    .trim();

/** What is sent to the server: the conversation as plain text turns. */
function toTurns(list: Msg[]): ChatTurn[] {
  return list.flatMap((m) => {
    const content = textOf(m);
    return content ? [{ role: m.role, content }] : [];
  });
}

function loadStored(): Msg[] {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    const list: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? (list as Msg[]).filter((m) => m && Array.isArray(m.parts)) : [];
  } catch {
    return [];
  }
}

function Avatar({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-white ring-2 ring-gold/60 ${className}`}
    >
      <img src="/brand/gcs-mark.png" alt="" className="h-[58%] w-auto" />
    </span>
  );
}

function CardView({ card, onNavigate }: { card: ResultCard; onNavigate: (href: string) => void }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gold/30 bg-white shadow-sm">
      <div className="bg-gradient-to-br from-gold-pale/70 to-gold-pale/20 px-4 py-3">
        <p className="text-[10px] font-bold tracking-[0.18em] text-gold-dark uppercase">
          {card.title}
        </p>
        {card.headline && (
          <>
            <p className="mt-1 font-heading text-[26px] leading-none font-extrabold text-navy">
              {card.headline.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{card.headline.label}</p>
          </>
        )}
      </div>
      <dl className="divide-y divide-border px-4 text-[12.5px]">
        {card.rows.map((r) => (
          <div key={r.label} className="flex justify-between gap-3 py-1.5">
            <dt className="text-muted-foreground">{r.label}</dt>
            <dd className="text-right font-semibold text-navy">{r.value}</dd>
          </div>
        ))}
      </dl>
      {card.note && (
        <p className="px-4 pt-1.5 pb-2.5 text-[11px] leading-snug text-muted-foreground">
          {card.note}
        </p>
      )}
      {card.link && (
        <a
          href={card.link.href}
          onClick={(e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
            e.preventDefault();
            onNavigate(card.link!.href);
          }}
          className="flex items-center justify-between border-t border-border px-4 py-2 text-xs font-bold text-gold-dark transition-colors hover:bg-gold-pale/25"
        >
          {card.link.label}
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
}

function ContactButtons({ onRequestCall }: { onRequestCall?: () => void }) {
  return (
    <div className="mt-2.5 flex flex-wrap gap-2">
      <a
        href={CONTACT.phoneHref}
        className="inline-flex items-center gap-1.5 rounded-full border border-navy/20 bg-white px-3 py-1.5 text-xs font-bold text-navy transition-all hover:-translate-y-0.5 hover:border-gold active:scale-95"
      >
        <Phone className="h-3.5 w-3.5 text-gold-dark" /> Call us
      </a>
      <a
        href={CONTACT.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full border border-navy/20 bg-white px-3 py-1.5 text-xs font-bold text-navy transition-all hover:-translate-y-0.5 hover:border-[#25D366] active:scale-95"
      >
        WhatsApp
      </a>
      {onRequestCall && (
        <button
          type="button"
          onClick={onRequestCall}
          className="inline-flex items-center gap-1.5 rounded-full bg-navy px-3 py-1.5 text-xs font-bold text-white transition-all hover:-translate-y-0.5 active:scale-95"
        >
          Request a callback
        </button>
      )}
    </div>
  );
}

const fieldClass =
  "w-full rounded-lg border border-border bg-white px-3 py-2 text-[13px] text-ink outline-none transition-all placeholder:text-muted-foreground/70 focus:border-gold focus:ring-2 focus:ring-gold/20";

function CallbackCard({
  part,
  summary,
  onSent,
  who,
}: {
  part: Extract<Part, { kind: "form" }>;
  summary: () => string;
  onSent: (name: string) => void;
  /** The signed-in visitor, so they don't type their details a second time. */
  who: { name: string; phone: string } | null;
}) {
  const uidBase = useId();
  const [name, setName] = useState(who?.name ?? "");
  const [phone, setPhone] = useState(who?.phone ?? "");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  // the model's one-line reason often ends in a full stop of its own
  const reason = part.req.reason.replace(/[.\s]+$/, "");

  if (part.state === "sent") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-gold/30 bg-white p-4 shadow-sm">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-pale text-gold-dark">
          <Check className="h-4 w-4" />
        </span>
        <div className="text-[13px] leading-relaxed">
          <p className="font-bold text-navy">
            Thanks{part.name ? `, ${part.name}` : ""}. Your request is in.
          </p>
          <p className="mt-0.5 text-muted-foreground">
            An expert will call you, typically within one business day ({CONTACT.hours}).
          </p>
        </div>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    const cleanName = name.trim();
    if (cleanName.length < 2) return setError("Please enter your name.");
    if (!normalizePhone(phone)) return setError("Enter a valid 10-digit mobile number.");
    setError("");
    setSending(true);
    await submitLead({
      name: cleanName,
      phone,
      source: "website-chat",
      detail: `Website chat with ${ASSISTANT_NAME}. ${reason}${
        part.req.interest ? ` (Interested in: ${part.req.interest})` : ""
      }. Chat so far: ${summary()}`,
    });
    onSent(cleanName);
  };

  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-2xl border border-gold/30 bg-white p-4 shadow-sm"
    >
      <p className="text-[13px] font-bold text-navy">Request a call from an expert</p>
      <p className="mt-0.5 text-[11.5px] leading-snug text-muted-foreground">
        About: {reason}. A short summary of this chat is shared so you don't have to repeat
        yourself.
      </p>
      <div className="mt-3 space-y-2">
        <input
          id={`${uidBase}-name`}
          aria-label="Your name"
          className={fieldClass}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoComplete="name"
          maxLength={100}
        />
        <input
          id={`${uidBase}-phone`}
          aria-label="Mobile number"
          className={fieldClass}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="10-digit mobile number"
          inputMode="tel"
          autoComplete="tel"
          maxLength={15}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-destructive">{error}</p>}
      <button
        type="submit"
        disabled={sending}
        className="gold-btn mt-3 w-full justify-center py-2.5 text-[13px] disabled:opacity-60"
      >
        {sending ? "Sending…" : "Request a call"}
        {!sending && <ArrowRight className="h-3.5 w-3.5" />}
      </button>
    </form>
  );
}

function TypingDots() {
  return (
    <div
      className="inline-flex items-center gap-1 rounded-2xl rounded-tl-md border border-border bg-white px-3.5 py-3 shadow-sm"
      role="status"
      aria-label={`${ASSISTANT_NAME} is typing`}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-gold"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

const botBubble =
  "rounded-2xl rounded-tl-md border border-border bg-white px-3.5 py-2.5 text-[13.5px] leading-relaxed text-foreground shadow-sm";

export function ChatAssistant() {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lang = useLanguage();

  const [ready, setReady] = useState(false);
  /** True once this tab's saved chat has been read back, so saving can never overwrite it with nothing. */
  const [restored, setRestored] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  /** The visitor's sign-in (a code texted to their mobile). Nothing can be asked without it. */
  const [pass, setPass] = useState<ChatPass | null>(null);
  const [gateNote, setGateNote] = useState("");
  /** When the chat opens again, if it was paused for asking things unrelated to loans or GCS. */
  const [pausedUntil, setPausedUntil] = useState<number | null>(null);
  const passRef = useRef<ChatPass | null>(null);
  passRef.current = pass;
  const pausedRef = useRef<number | null>(null);
  pausedRef.current = pausedUntil;
  /** A question asked before signing in, sent as soon as the visitor has. */
  const pendingRef = useRef<string | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const stick = useRef(true);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<Msg[]>([]);
  messagesRef.current = messages;

  // Appear a moment after the page loads (like the WhatsApp button), and bring back this tab's chat.
  useEffect(() => {
    const saved = loadPass();
    setPass(saved);
    // a chat left in this tab belongs to whoever was signed in; without a pass it starts clean
    setMessages(saved ? loadStored() : []);
    setRestored(true);
    const timer = window.setTimeout(() => setReady(true), 2500);
    return () => window.clearTimeout(timer);
  }, []);

  // The pause belongs to the mobile number, so it is still there after a reload or a new tab.
  useEffect(() => {
    let until: number | null = null;
    try {
      const raw = window.localStorage.getItem(PAUSE_KEY);
      const saved = raw ? (JSON.parse(raw) as { phone?: unknown; until?: unknown }) : null;
      if (
        pass &&
        saved &&
        saved.phone === pass.phone &&
        typeof saved.until === "number" &&
        saved.until > Date.now()
      )
        until = saved.until;
    } catch {
      // storage blocked: the server still enforces the pause
    }
    setPausedUntil(until);
  }, [pass]);

  useEffect(() => {
    if (pausedUntil === null) return;
    const wait = pausedUntil - Date.now();
    if (wait <= 0) {
      setPausedUntil(null);
      return;
    }
    const timer = window.setTimeout(() => setPausedUntil(null), Math.min(wait, 2_147_000_000));
    return () => window.clearTimeout(timer);
  }, [pausedUntil]);

  const pause = useCallback((until: number) => {
    if (!Number.isFinite(until) || until <= Date.now()) return;
    setPausedUntil(until);
    try {
      window.localStorage.setItem(
        PAUSE_KEY,
        JSON.stringify({ phone: passRef.current?.phone ?? "", until }),
      );
    } catch {
      // the pause lasts for this page view only
    }
  }, []);

  useEffect(() => {
    if (busy || !restored) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_STORED)));
    } catch {
      // storage blocked: the chat simply won't survive a reload
    }
  }, [messages, busy, restored]);

  // Keep the newest words in view unless the visitor has scrolled up to read.
  useEffect(() => {
    const el = listRef.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [messages, busy, open]);

  // On a phone the chat is a full-width sheet: stop the page behind it from scrolling.
  useEffect(() => {
    if (!open || window.innerWidth >= 640) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = before;
    };
  }, [open]);

  useEffect(() => {
    if (open && window.matchMedia("(min-width: 640px)").matches) inputRef.current?.focus();
  }, [open]);

  const navigate = useCallback(
    (href: string) => {
      router.history.push(href);
      // pushState raises no hashchange, which is what the Tools page listens for to open a calculator
      if (href.includes("#"))
        window.setTimeout(() => window.dispatchEvent(new HashChangeEvent("hashchange")), 60);
      if (window.innerWidth < 640) setOpen(false);
    },
    [router],
  );

  const run = useCallback(
    async (history: Msg[]) => {
      const token = passRef.current?.token;
      if (!token) return;
      const bot: Msg = { id: uid(), role: "assistant", parts: [] };
      const lastUser = [...history].reverse().find((m) => m.role === "user");
      setMessages([...history, bot]);
      setBusy(true);
      stick.current = true;

      const ctrl = new AbortController();
      abortRef.current = ctrl;
      const patch = (fn: (parts: Part[]) => Part[]) =>
        setMessages((list) =>
          list.map((m) => (m.id === bot.id ? { ...m, parts: fn(m.parts) } : m)),
        );

      try {
        await streamChatReply(
          { messages: toTurns(history).slice(-CHAT_LIMITS.maxTurns), page: pathname, lang },
          token,
          (e) => {
            if (e.t === "paused") pause(Date.parse(e.until));
            patch((parts) => applyEvent(parts, e, lastUser ? textOf(lastUser) : undefined));
          },
          ctrl.signal,
        );
      } catch (err) {
        if (!ctrl.signal.aborted && err instanceof ChatHttpError && err.status === 401) {
          // the pass ran out or was withdrawn: back to the sign-in, keeping the question to ask after
          clearPass();
          setPass(null);
          setGateNote("For your security, please confirm your number again to keep chatting.");
          pendingRef.current = lastUser ? textOf(lastUser) : null;
          setMessages(history.slice(0, -1));
          setBusy(false);
          return;
        }
        if (
          !ctrl.signal.aborted &&
          err instanceof ChatHttpError &&
          err.status === 429 &&
          err.code === "paused"
        ) {
          // asked again while paused (another device, or the pause was not remembered here)
          const until = err.until ? Date.parse(err.until) : Date.now() + 60 * 60_000;
          pause(until);
          patch((parts) => [...parts, { kind: "error", code: "paused", text: pausedText(until) }]);
        } else if (!ctrl.signal.aborted) {
          const retry = lastUser ? textOf(lastUser) : undefined;
          const code =
            err instanceof ChatHttpError
              ? err.status === 429
                ? "rate_limited"
                : err.status === 503
                  ? "unavailable"
                  : "failed"
              : "failed";
          patch((parts) => [
            ...parts,
            { kind: "error", code, text: errorText(code), ...(retry ? { retry } : {}) },
          ]);
        }
      } finally {
        setBusy(false);
        abortRef.current = null;
        // a stopped answer with nothing in it is not worth keeping
        setMessages((list) => list.filter((m) => !(m.id === bot.id && m.parts.length === 0)));
      }
    },
    [pathname, lang, pause],
  );

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim().slice(0, CHAT_LIMITS.maxUserChars);
      if (!text || abortRef.current) return;
      if (pausedRef.current && pausedRef.current > Date.now()) return;
      if (!passRef.current) {
        pendingRef.current = text;
        return;
      }
      setInput("");
      if (inputRef.current) inputRef.current.style.height = "auto";
      void run([
        ...messagesRef.current,
        { id: uid(), role: "user", parts: [{ kind: "text", text }] },
      ]);
    },
    [run],
  );

  // Other parts of the site can open the chat: window.dispatchEvent(new CustomEvent("gcs:open-chat", { detail: { message } })).
  const sendRef = useRef(send);
  sendRef.current = send;
  useEffect(() => {
    const onOpen = (e: Event) => {
      setReady(true);
      setOpen(true);
      const message = (e as CustomEvent<{ message?: string }>).detail?.message;
      if (message) sendRef.current(message);
    };
    window.addEventListener("gcs:open-chat", onOpen);
    return () => window.removeEventListener("gcs:open-chat", onOpen);
  }, []);

  const signedIn = (next: ChatPass) => {
    setPass(next);
    passRef.current = next;
    setGateNote("");
    const waiting = pendingRef.current;
    pendingRef.current = null;
    if (waiting) window.setTimeout(() => sendRef.current(waiting), 0);
  };

  const signOut = () => {
    if (passRef.current) endPass(passRef.current);
    pendingRef.current = null;
    setPass(null);
    setGateNote("");
    reset();
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // nothing saved
    }
  };

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    setBusy(false);
    setInput("");
    stick.current = true;
  };

  const retry = (botId: string, text: string) => {
    if (abortRef.current) return;
    const history = messagesRef.current.filter((m) => m.id !== botId);
    if (
      history.length > 0 &&
      history[history.length - 1]?.role === "user" &&
      textOf(history[history.length - 1]!) === text
    ) {
      void run(history);
    }
  };

  const patchForm = (
    msgId: string,
    index: number,
    patch: Partial<Extract<Part, { kind: "form" }>>,
  ) =>
    setMessages((list) =>
      list.map((m) =>
        m.id !== msgId
          ? m
          : {
              ...m,
              parts: m.parts.map((p, i) =>
                i === index && p.kind === "form" ? { ...p, ...patch } : p,
              ),
            },
      ),
    );

  const requestCall = (botId: string) =>
    setMessages((list) =>
      list.map((m) =>
        m.id === botId
          ? {
              ...m,
              parts: [
                ...m.parts,
                {
                  kind: "form",
                  state: "open",
                  req: { reason: "Wants a call from an expert" },
                } as Part,
              ],
            }
          : m,
      ),
    );

  const summary = () =>
    messagesRef.current
      .filter((m) => m.role === "user")
      .slice(-4)
      .map((m) => `"${textOf(m).slice(0, 160)}"`)
      .join(" | ")
      .slice(0, 700);

  // Gia's flame follows the chat: a flare when a reply finishes (or the visitor says thanks),
  // a swirl while thinking, a pulse while writing, a dim ember if something went wrong.
  const [flare, setFlare] = useState(false);
  const wasBusy = useRef(false);
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    const failed = !!lastMsg?.parts.some((p) => p.kind === "error");
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (wasBusy.current && !busy && !failed) {
      setFlare(true);
      timer = setTimeout(() => setFlare(false), 2200);
    }
    wasBusy.current = busy;
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [busy, messages]);

  if (!ready) return null;

  const isPaused = pausedUntil !== null && pausedUntil > Date.now();
  const last = messages[messages.length - 1];
  const waitingForText =
    busy && !!last && last.role === "assistant" && !last.parts.some((p) => p.kind === "text");
  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  const lastUserText = lastUser?.parts.map((p) => (p.kind === "text" ? p.text : "")).join(" ") ?? "";
  const thanked = !busy && last?.role === "assistant" && /(thanks?|thank you|thx|great|perfect|awesome|dhanyavad|shukriya)/i.test(lastUserText);
  const mood: GiaMood = last?.parts.some((p) => p.kind === "error")
    ? "concerned"
    : waitingForText
      ? "thinking"
      : busy
        ? "speaking"
        : flare || thanked
          ? "joy"
          : "idle";

  return (
    // data-gcs-edit-ui keeps the site's text editor and translation swapper out of the chat.
    <div data-gcs-edit-ui className="font-sans">
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`Chat with ${ASSISTANT_NAME}, our AI assistant`}
          className="fixed right-[5.5rem] bottom-5 z-50 flex h-[72px] items-center gap-2.5 rounded-full bg-navy px-2 text-white shadow-[0_6px_24px_oklch(0.13_0.04_265/0.35)] ring-1 ring-gold/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_32px_oklch(0.13_0.04_265/0.45)] active:scale-95 sm:pr-5"
          style={{ animation: "gcs-whatsapp-pop 600ms cubic-bezier(0.22,1,0.36,1) both" }}
        >
          <span className="relative">
            <GiaOrb mood={mood} tone="dark" className="h-16 w-16" />
          </span>
          <span className="hidden text-left sm:block">
            <span className="block text-sm leading-tight font-bold">Ask {ASSISTANT_NAME}</span>
            <span className="block text-[10px] text-white/70">AI assistant</span>
          </span>
        </button>
      )}

      {open && (
        <>
          <div
            className="fixed inset-0 z-[59] bg-navy/35 backdrop-blur-[2px] sm:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <section
            role="dialog"
            aria-label={`Chat with ${ASSISTANT_NAME}`}
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
            }}
            className="fixed inset-x-0 bottom-0 z-[60] flex h-[min(86dvh,680px)] origin-bottom-right flex-col overflow-hidden rounded-t-3xl border border-gold/20 bg-white shadow-[0_24px_80px_-12px_oklch(0.13_0.04_265/0.45)] sm:inset-x-auto sm:right-5 sm:bottom-5 sm:h-[min(640px,calc(100dvh-2.5rem))] sm:w-[390px] sm:rounded-2xl"
            style={{ animation: "gcs-scale-in 220ms ease both" }}
          >
            <header className="navy-panel flex items-center gap-3 px-4 py-3.5 text-white">
              <GiaOrb mood={mood} tone="dark" className="h-[52px] w-[52px]" />
              <div className="min-w-0 flex-1">
                <p className="font-heading text-base leading-tight font-bold">{ASSISTANT_NAME}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/70">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {ASSISTANT_ROLE} · replies instantly
                </p>
              </div>
              {pass && (
                <button
                  type="button"
                  onClick={reset}
                  aria-label="Start a new chat"
                  title="New chat"
                  className="grid h-8 w-8 place-items-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="grid h-8 w-8 place-items-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            </header>

            {!pass ? (
              <ChatGate note={gateNote} onSignedIn={signedIn} />
            ) : (
              <>
                <div
                  ref={listRef}
                  role="log"
                  aria-live="polite"
                  onScroll={(e) => {
                    const el = e.currentTarget;
                    stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
                  }}
                  className="flex-1 space-y-3 overflow-y-auto overscroll-contain bg-bg-light px-4 py-4"
                >
                  <div className="flex items-end gap-2">
                    <Avatar />
                    <div className={`max-w-[88%] ${botBubble}`}>
                      <p>
                        Hi{pass ? ` ${pass.name.trim().split(/\s+/)[0]}` : ""}, I'm{" "}
                        <strong className="font-bold text-navy">{ASSISTANT_NAME}</strong>, GCS's AI
                        assistant. I can check your loan eligibility, work out EMIs, explain
                        documents and rates, or connect you with an expert.
                      </p>
                      <p className="mt-2">What would you like to do?</p>
                    </div>
                  </div>

                  {messages.length === 0 && !isPaused && (
                    <div className="flex flex-wrap gap-2 pl-10">
                      {QUICK_ACTIONS.map((a) => (
                        <button
                          key={a.label}
                          type="button"
                          onClick={() => send(a.prompt)}
                          className="rounded-full border border-gold/40 bg-white px-3 py-1.5 text-xs font-semibold text-navy transition-all duration-200 hover:-translate-y-0.5 hover:border-gold hover:bg-gold-pale/40 active:scale-95"
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {messages.map((m, mi) => {
                    if (m.role === "user") {
                      return (
                        <div
                          key={m.id}
                          className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-navy px-3.5 py-2.5 text-[13.5px] leading-relaxed break-words whitespace-pre-wrap text-white"
                        >
                          {textOf(m)}
                        </div>
                      );
                    }
                    const isLast = mi === messages.length - 1;
                    const cards = m.parts.filter(
                      (p): p is Extract<Part, { kind: "card" }> => p.kind === "card",
                    );
                    const text = textOf(m);
                    return (
                      <div key={m.id} className="flex items-end gap-2">
                        <Avatar />
                        <div className="min-w-0 max-w-[88%] flex-1 space-y-2">
                          {/* A calculation's card comes first, the explanation after it, forms last. */}
                          {cards.map((p, i) => (
                            <CardView key={i} card={p.card} onNavigate={navigate} />
                          ))}
                          {text && (
                            <div className={`inline-block ${botBubble}`}>
                              <ChatMarkdown
                                text={text}
                                streaming={busy && isLast}
                                onNavigate={navigate}
                              />
                            </div>
                          )}
                          {m.parts.map((p, i) => {
                            if (p.kind === "form") {
                              return (
                                <CallbackCard
                                  key={i}
                                  part={p}
                                  summary={summary}
                                  who={pass}
                                  onSent={(name) => patchForm(m.id, i, { state: "sent", name })}
                                />
                              );
                            }
                            if (p.kind === "error") {
                              return (
                                <div
                                  key={i}
                                  className={`${botBubble} border-gold/30 bg-gold-pale/20`}
                                >
                                  <p>{p.text}</p>
                                  {p.code === "failed" && p.retry ? (
                                    <button
                                      type="button"
                                      onClick={() => retry(m.id, p.retry!)}
                                      className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-navy px-3 py-1.5 text-xs font-bold text-white transition-all hover:-translate-y-0.5 active:scale-95"
                                    >
                                      <RotateCcw className="h-3 w-3" /> Try again
                                    </button>
                                  ) : null}
                                  {p.code !== "rate_limited" && (
                                    <ContactButtons
                                      {...(p.code === "unavailable" || p.code === "paused"
                                        ? { onRequestCall: () => requestCall(m.id) }
                                        : {})}
                                    />
                                  )}
                                </div>
                              );
                            }
                            return null;
                          })}
                          {isLast && waitingForText && <TypingDots />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {isPaused && (
                  <div className="border-t border-border bg-white p-4">
                    <p className="text-[13px] leading-relaxed text-ink">
                      <strong className="font-bold text-navy">Chat paused.</strong> It opens again
                      around {clockTime(pausedUntil!)}. For anything about your loan, our experts
                      are a call away.
                    </p>
                    <ContactButtons />
                    <p className="mt-3 text-[10.5px] leading-snug text-muted-foreground">
                      {ASSISTANT_NAME} is an AI assistant and can make mistakes. Figures are
                      indicative. {ASSISTANT_NAME} only answers questions about loans, credit and GCS.{" "}
                      <button
                        type="button"
                        onClick={signOut}
                        className="font-semibold text-navy underline hover:text-gold-dark"
                      >
                        Not you? Sign out
                      </button>
                    </p>
                  </div>
                )}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                  }}
                  hidden={isPaused}
                  className="border-t border-border bg-white p-3"
                >
                  <div className="flex items-end gap-2 rounded-2xl border border-border bg-bg-light py-1.5 pr-1.5 pl-3.5 transition-all focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/20">
                    <textarea
                      ref={inputRef}
                      value={input}
                      rows={1}
                      maxLength={CHAT_LIMITS.maxUserChars}
                      aria-label={`Message ${ASSISTANT_NAME}`}
                      placeholder="Ask about loans, EMI, eligibility…"
                      onChange={(e) => {
                        setInput(e.target.value);
                        e.target.style.height = "auto";
                        e.target.style.height = `${Math.min(e.target.scrollHeight, 112)}px`;
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                          e.preventDefault();
                          send(input);
                        }
                      }}
                      className="max-h-28 min-h-[34px] flex-1 resize-none bg-transparent py-1.5 text-[13.5px] text-ink outline-none placeholder:text-muted-foreground/70"
                    />
                    {busy ? (
                      <button
                        type="button"
                        onClick={() => abortRef.current?.abort()}
                        aria-label="Stop the answer"
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy text-white transition-transform active:scale-90"
                      >
                        <Square className="h-3.5 w-3.5 fill-current" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={!input.trim()}
                        aria-label="Send message"
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold text-navy transition-all hover:bg-gold-light active:scale-90 disabled:opacity-40"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <p className="mt-2 px-1 text-center text-[10.5px] leading-snug text-muted-foreground">
                    {ASSISTANT_NAME} is an AI assistant and can make mistakes. Figures are
                    indicative. Please don't share Aadhaar, PAN, OTP or bank details here.{" "}
                    <button
                      type="button"
                      onClick={signOut}
                      className="font-semibold text-navy underline hover:text-gold-dark"
                    >
                      Not you? Sign out
                    </button>
                  </p>
                </form>
              </>
            )}
          </section>
        </>
      )}
    </div>
  );
}
