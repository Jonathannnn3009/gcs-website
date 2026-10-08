// Text edits staff make straight on the site (admin "Edit text" mode). Each edit maps the original
// wording to the new wording, per page ("/about") or for every page ("*"). Visitors get the edited
// wording applied to the page after it draws; anything not edited is untouched.

import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { CRM_API } from "@/lib/crm";
import { useSiteContent } from "@/lib/site-content";

export type PageTextMap = Record<string, Record<string, string>>;

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "TEXTAREA", "NOSCRIPT", "TITLE"]);
/** Text we set on a node, and the wording React gave it before we changed it. */
const lastSet = new WeakMap<Text, string>();
const originals = new WeakMap<Text, string>();

/** Replacement pictures: the website's original picture path -> where the CRM serves the new one. */
export type ImageMap = Record<string, string>;

const SRC_ATTR = "data-gcs-src"; // the picture the page shipped with
const SET_ATTR = "data-gcs-set"; // the address we swapped in

/** "/banks/hdfc.svg" however the page wrote it (relative, absolute, with the site's own origin). */
export function imageKey(src: string): string {
  try {
    const url = new URL(src, window.location.origin);
    return url.origin === window.location.origin ? url.pathname : url.href;
  } catch {
    return src;
  }
}

/** The picture the page shipped with for this <img>, ignoring any swap we applied. */
export function originalSrc(img: HTMLImageElement): string {
  const current = img.getAttribute("src") ?? "";
  const set = img.getAttribute(SET_ATTR);
  return set && current === set ? (img.getAttribute(SRC_ATTR) ?? current) : current;
}

export function applyImages(root: ParentNode, images: ImageMap) {
  for (const img of Array.from(root.querySelectorAll("img"))) {
    if (img.closest("[data-gcs-edit-ui]")) continue;
    const current = img.getAttribute("src") ?? "";
    const set = img.getAttribute(SET_ATTR);
    const orig = originalSrc(img);
    const replacement = images[imageKey(orig)];
    if (replacement) {
      const url = replacement.startsWith("http") ? replacement : `${CRM_API}${replacement}`;
      if (current !== url) {
        img.setAttribute(SRC_ATTR, orig);
        img.setAttribute(SET_ATTR, url);
        img.removeAttribute("srcset");
        img.setAttribute("src", url);
      }
    } else if (set && current === set) {
      img.setAttribute("src", orig); // the replacement was removed
      img.removeAttribute(SET_ATTR);
      img.removeAttribute(SRC_ATTR);
    }
  }
}

export const normalizePath = (p: string) => (p.length > 1 ? p.replace(/\/+$/, "") : p);

export function overridesFor(map: PageTextMap | undefined, pathname: string) {
  return { ...(map?.["*"] ?? {}), ...(map?.[normalizePath(pathname)] ?? {}) };
}

function skipped(node: Text): boolean {
  for (let el = node.parentElement; el; el = el.parentElement) {
    if (SKIP_TAGS.has(el.tagName) || el.hasAttribute("data-gcs-edit-ui")) return true;
  }
  return false;
}

/** The wording the page shipped with for this node, ignoring any edit we applied. */
export function originalOf(node: Text): string {
  const current = node.nodeValue ?? "";
  const set = lastSet.get(node);
  // React rewrote the node itself: the new text is the original now.
  if (set === undefined || current !== set) return current;
  return originals.get(node) ?? current;
}

export function applyOverrides(root: Node, overrides: Record<string, string>) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const node = n as Text;
    if (skipped(node)) continue;
    const current = node.nodeValue ?? "";
    const orig = originalOf(node);
    const key = orig.trim();
    const next = key ? overrides[key] : undefined;
    if (next !== undefined) {
      const out = orig.replace(key, () => next);
      if (current !== out) {
        originals.set(node, orig);
        lastSet.set(node, out);
        node.nodeValue = out;
      }
    } else if (lastSet.has(node) && current === lastSet.get(node)) {
      node.nodeValue = orig; // the edit was removed
      lastSet.delete(node);
    }
  }
}

/** Applies the CRM's text edits to whatever page is showing, and to anything drawn later. */
export function usePageText() {
  const content = useSiteContent();
  const map = content.pageText;
  const images = content.images;
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    const overrides = overridesFor(map, pathname);
    const hasAny = Object.keys(overrides).length > 0 || Object.keys(images ?? {}).length > 0;
    let frame = 0;
    const run = () => {
      frame = 0;
      applyOverrides(document.body, overrides);
      applyImages(document.body, images ?? {});
    };
    run();
    if (!hasAny) return;
    const observer = new MutationObserver(() => {
      if (!frame) frame = window.requestAnimationFrame(run);
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["src"],
    });
    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [map, images, pathname]);
}
