import { createFileRoute } from "@tanstack/react-router";

// /api/whatsapp: the webhook Meta calls for Gia on WhatsApp.
//   GET  Meta's one-time handshake when the address is saved in the developer app.
//   POST every customer message. The body is checked against Meta's signature first, so nobody else
//        can make Gia answer (or spend OpenAI credit) by calling this address.
// It runs on the server only and does nothing unless WHATSAPP_ENABLED is "1". See
// src/lib/whatsapp/whatsapp.server.ts for the settings it needs.
export const Route = createFileRoute("/api/whatsapp")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { answerHandshake } = await import("@/lib/whatsapp/whatsapp.server");
        return answerHandshake(new URL(request.url));
      },
      POST: async ({ request }) => {
        const ok = () => new Response("ok", { status: 200 });
        const { handleWebhook, validSignature, whatsappEnabled } =
          await import("@/lib/whatsapp/whatsapp.server");
        if (!whatsappEnabled()) return ok();

        const raw = await request.text();
        if (raw.length > 100_000) return new Response("Too large", { status: 413 });
        if (!(await validSignature(raw, request.headers.get("x-hub-signature-256"))))
          return new Response("Forbidden", { status: 403 });

        let payload: unknown;
        try {
          payload = JSON.parse(raw);
        } catch {
          return ok();
        }
        await handleWebhook(payload, new URL(request.url).origin);
        return ok();
      },
    },
  },
});
