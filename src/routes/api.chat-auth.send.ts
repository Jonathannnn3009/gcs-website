import { createFileRoute } from "@tanstack/react-router";

// POST /api/chat-auth/send: emails a sign-in code for the website chat. See src/lib/chat/web-auth.server.ts.
export const Route = createFileRoute("/api/chat-auth/send")({
  server: {
    handlers: {
      GET: () => new Response("Use POST", { status: 405, headers: { allow: "POST" } }),
      POST: async ({ request }) => {
        const json = (status: number, body: unknown) =>
          new Response(JSON.stringify(body), {
            status,
            headers: { "content-type": "application/json", "cache-control": "no-store" },
          });
        if (request.headers.get("sec-fetch-site") === "cross-site") return json(403, { message: "Not allowed." });
        const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
        if (!body) return json(400, { message: "Something went wrong. Please try again." });
        const ip =
          request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
        const auth = await import("@/lib/chat/web-auth.server");
        const out = await auth.startSignIn(body as { name: unknown; phone: unknown; email: unknown }, ip, new URL(request.url).origin);
        return out.ok
          ? json(200, { sent: true, resendAfterSeconds: out.resendAfterSeconds, validMinutes: out.validMinutes, viaEmail: true, viaSms: false, challenge: out.challenge })
          : json(out.status, { message: out.message });
      },
    },
  },
});
