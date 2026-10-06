import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import {
  PROMO,
  canShow,
  fetchPromoAd,
  readRecord,
  writeRecord,
  type PromoAd,
} from "@/lib/promo-ad";

/**
 * The offer poster set up in the CRM. Appears centred over a blurred page after the visitor has
 * spent 20 seconds looking at the site, and again when they come back to the tab after switching
 * away. Closes with the cross, Esc, a click outside, or by itself after 8 seconds.
 */
export function PromoPopup() {
  const [ad, setAd] = useState<PromoAd | null>(null);
  const [ready, setReady] = useState(false); // the picture has loaded, so nothing pops up empty
  const [open, setOpen] = useState(false);
  const [round, setRound] = useState(0); // restarts the countdown bar each time it appears
  const closeBtn = useRef<HTMLButtonElement>(null);
  const returnTo = useRef<Element | null>(null);

  // 1. Ask the CRM what is running today, and load the picture ahead of time.
  useEffect(() => {
    const ctrl = new AbortController();
    void fetchPromoAd(ctrl.signal).then((found) => {
      if (!found || ctrl.signal.aborted) return;
      setAd(found);
      const img = new Image();
      img.onload = () => !ctrl.signal.aborted && setReady(true);
      img.src = found.imageUrl;
    });
    return () => ctrl.abort();
  }, []);

  const show = useCallback(
    (force = false) => {
      if (!ad) return;
      const now = Date.now();
      if (!force && !canShow(readRecord(ad.id), now)) return;
      // A test showing (?promo=test) does not use up the visitor's allowance.
      if (!force) writeRecord(ad.id, { count: (readRecord(ad.id)?.count ?? 0) + 1, lastAt: now });
      returnTo.current = document.activeElement;
      setRound((r) => r + 1);
      setOpen(true);
    },
    [ad],
  );

  // 2. Triggers: 20 seconds of the tab actually being looked at, and coming back to the tab.
  useEffect(() => {
    if (!ad || !ready) return;
    // `?promo=test` shows it straight away, ignoring the limits, so the team can check a new poster.
    if (new URLSearchParams(window.location.search).get("promo") === "test") {
      const t = window.setTimeout(() => show(true), 800);
      return () => window.clearTimeout(t);
    }
    let seenMs = 0;
    let firstDone = false;
    const tick = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      seenMs += 1000;
      if (!firstDone && seenMs >= PROMO.firstAfterMs) {
        firstDone = true;
        show();
      }
    }, 1000);
    const onVisibility = () => {
      if (document.visibilityState === "visible") show();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.clearInterval(tick);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [ad, ready, show]);

  const close = useCallback(() => {
    setOpen(false);
    if (returnTo.current instanceof HTMLElement) returnTo.current.focus();
  }, []);

  // 3. While it is open: close by itself, on Esc, and keep the page behind it from scrolling.
  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(close, PROMO.autoCloseMs);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const scrollLock = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeBtn.current?.focus({ preventScroll: true });
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = scrollLock;
    };
  }, [open, round, close]);

  if (!ad || !open) return null;

  const picture = (
    <img
      src={ad.imageUrl}
      alt={ad.title}
      className="block max-h-[75vh] w-auto max-w-[min(92vw,30rem)] object-contain"
    />
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex animate-fade-in items-center justify-center bg-navy/45 p-4 backdrop-blur-md"
      onClick={close}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ad.title}
        className="relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeBtn}
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute -top-3 -right-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white text-navy shadow-lg ring-1 ring-black/10 transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-gold focus-visible:outline-none"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
          {ad.linkUrl ? (
            <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" onClick={close}>
              {picture}
            </a>
          ) : (
            picture
          )}
          <div className="h-1 bg-black/10" aria-hidden>
            <div
              key={round}
              className="promo-countdown h-full origin-left bg-gold"
              style={{ animationDuration: `${PROMO.autoCloseMs}ms` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
