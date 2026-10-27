import { createFileRoute } from "@tanstack/react-router";

// POST /api/notify-lead: emails the team about a new website enquiry (see src/lib/notify-email.server.ts).
// It runs on the server only, because it holds the Zoho keys. It always answers quickly with a plain
// "ok", so a visitor never sees a problem if email is off or fails.

const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 6;
const seen = new Map<string, { n: number; since: number }>();

/** A few emails per address per ten minutes, so the form cannot be used to flood the inbox. */
function allowed(ip: string): boolean {
  const now = Date.now();
  const row = seen.get(ip);
  if (!row || now - row.since > WINDOW_MS) {
    if (seen.size > 2000) seen.delete(seen.keys().next().value as string);
    seen.set(ip, { n: 1, since: now });
    return true;
  }
  row.n += 1;
  return row.n <= MAX_PER_WINDOW;
}

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export const Route = createFileRoute("/api/notify-lead")({
  server: {
    handlers: {
      GET: () => new Response("Use POST", { status: 405, headers: { allow: "POST" } }),
      POST: async ({ request }) => {
        const ok = () =>
          new Response(JSON.stringify({ ok: true }), {
            headers: { "content-type": "application/json" },
          });
        try {
          const { notifyConfigured, sendEnquiryMail } = await import("@/lib/notify-email.server");
          if (!notifyConfigured()) return ok();

          const ip =
            request.headers.get("cf-connecting-ip") ??
            request.headers.get("x-forwarded-for") ??
            "unknown";
          if (!allowed(ip)) return ok();

          const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
          const name = text(body?.["name"], 120);
          const phone = text(body?.["phone"], 20);
          if (!body || name.length < 2 || !/^\d{10}$/.test(phone.replace(/\D/g, "").slice(-10)))
            return ok();

          const amount =
            typeof body["amount"] === "number" && body["amount"] > 0 ? body["amount"] : undefined;
          const origin = new URL(request.url).origin;
          await sendEnquiryMail(
            {
              name,
              phone,
              source: text(body["source"], 60) || "website",
              email: text(body["email"], 160) || undefined,
              city: text(body["city"], 80) || undefined,
              productSlug: text(body["productSlug"], 80) || undefined,
              amount,
              detail: text(body["detail"], 2000) || undefined,
            },
            origin,
          );
        } catch {
          // an alert failing must never affect the visitor
        }
        return ok();
      },
    },
  },
});
