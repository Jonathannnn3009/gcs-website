// Cloudflare Turnstile token for the CRM's public lead intake.
//
// The CRM refuses public leads without a Turnstile token once it runs in production.
// Set VITE_TURNSTILE_SITE_KEY (the public site key from the Cloudflare dashboard) and every
// lead submission fetches an invisible token first. With no key set — local development —
// this resolves to undefined and the CRM (which skips the check without a secret) accepts it.

type TurnstileApi = {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SITE_KEY = (import.meta.env["VITE_TURNSTILE_SITE_KEY"] as string | undefined) ?? "";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptReady: Promise<void> | null = null;
let widgetId: string | null = null;
let container: HTMLDivElement | null = null;
let pending: ((token: string | undefined) => void) | null = null;

function loadScript(): Promise<void> {
  if (scriptReady) return scriptReady;
  scriptReady = new Promise<void>((resolve, reject) => {
    if (window.turnstile) return resolve();
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Turnstile script failed to load"));
    document.head.appendChild(s);
  });
  return scriptReady;
}

/** A fresh Turnstile token, or undefined when captcha isn't configured / couldn't be solved. */
export async function getCaptchaToken(): Promise<string | undefined> {
  if (!SITE_KEY || typeof window === "undefined") return undefined;
  try {
    await loadScript();
    const api = window.turnstile;
    if (!api) return undefined;

    return await new Promise<string | undefined>((resolve) => {
      const timer = window.setTimeout(() => {
        pending = null;
        resolve(undefined);
      }, 12000);
      pending = (token) => {
        window.clearTimeout(timer);
        pending = null;
        resolve(token);
      };

      if (widgetId === null) {
        container = document.createElement("div");
        container.style.position = "fixed";
        container.style.bottom = "12px";
        container.style.right = "12px";
        container.style.zIndex = "60";
        document.body.appendChild(container);
        widgetId = api.render(container, {
          sitekey: SITE_KEY,
          appearance: "interaction-only", // only visible if Cloudflare needs the person to do something
          callback: (token: string) => pending?.(token),
          "error-callback": () => pending?.(undefined),
          "expired-callback": () => undefined,
        });
      } else {
        api.reset(widgetId);
      }
    });
  } catch {
    return undefined;
  }
}
