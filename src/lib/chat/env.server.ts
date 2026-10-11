// Server only. Reads a server environment variable: process.env on Node (local dev, a Node
// host) or the worker's bindings on Cloudflare. Never import this from browser code.

export function serverEnv(name: string): string {
  const g = globalThis as {
    process?: { env?: Record<string, string | undefined> };
    __env__?: Record<string, unknown>;
  };
  const fromProcess = g.process?.env?.[name];
  if (fromProcess) return fromProcess.trim();
  const fromWorker = g.__env__?.[name];
  return typeof fromWorker === "string" ? fromWorker.trim() : "";
}
