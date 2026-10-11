import { createFileRoute } from "@tanstack/react-router";

// POST /api/chat: the website's AI assistant. Runs on the server only, because it holds the
// OpenAI key (OPENAI_API_KEY). See src/lib/chat/ for the instructions, tools and streaming.
export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      GET: () => new Response("Use POST", { status: 405, headers: { allow: "POST" } }),
      POST: async ({ request }) => {
        const { handleChat } = await import("@/lib/chat/handler.server");
        return handleChat(request);
      },
    },
  },
});
