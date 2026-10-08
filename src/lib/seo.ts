// Page titles and Google descriptions staff set in the CRM (Settings -> Website content -> Search
// listings). Applied to the page's <head> once it has drawn; pages without an entry keep the
// title and description built into the page.

import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { normalizePath } from "@/lib/page-text";
import { useSiteContent } from "@/lib/site-content";

export type SeoEntry = { title?: string; description?: string };
export type SeoMap = Record<string, SeoEntry>;

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function useSeo() {
  const seo = useSiteContent().seo;
  const pathname = normalizePath(useRouterState({ select: (s) => s.location.pathname }));
  useEffect(() => {
    const entry = seo?.[pathname];
    if (!entry || (!entry.title && !entry.description)) return;
    // The route's own <head> is written on navigation; apply ours just after it.
    const apply = () => {
      if (entry.title) {
        document.title = entry.title;
        setMeta("property", "og:title", entry.title);
      }
      if (entry.description) {
        setMeta("name", "description", entry.description);
        setMeta("property", "og:description", entry.description);
      }
    };
    apply();
    const timer = window.setTimeout(apply, 250);
    return () => window.clearTimeout(timer);
  }, [seo, pathname]);
}
