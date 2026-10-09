// Analytics staff switch on from the CRM (Settings -> Website content -> Contact & CIBIL): a
// Google Analytics 4 measurement ID and/or a Meta Pixel ID. Nothing loads until an ID is saved,
// and an ID that does not look right is ignored.

import { useEffect } from "react";
import { useSiteContent } from "@/lib/site-content";

const GA_ID = /^G-[A-Z0-9]{4,14}$/;
const PIXEL_ID = /^\d{6,20}$/;

let gaLoaded = false;
let pixelLoaded = false;

function loadGoogle(id: string) {
  if (gaLoaded) return;
  gaLoaded = true;
  const w = window as unknown as { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void };
  w.dataLayer = w.dataLayer ?? [];
  w.gtag = function gtag() {
    // gtag expects the real arguments object in the data layer
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  };
  w.gtag("js", new Date());
  w.gtag("config", id);
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

type Fbq = {
  (...args: unknown[]): void;
  queue: unknown[];
  loaded: boolean;
  version: string;
  callMethod?: (...args: unknown[]) => void;
  push: Fbq;
};

function loadPixel(id: string) {
  if (pixelLoaded) return;
  pixelLoaded = true;
  const w = window as unknown as { fbq?: Fbq };
  if (!w.fbq) {
    const fbq = ((...args: unknown[]) => {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    }) as Fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = "2.0";
    fbq.queue = [];
    w.fbq = fbq;
  }
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);
  w.fbq("init", id);
  w.fbq("track", "PageView");
}

export function useTracking() {
  const info = useSiteContent().siteInfo;
  const ga = info?.googleAnalyticsId?.trim() ?? "";
  const pixel = info?.metaPixelId?.trim() ?? "";
  useEffect(() => {
    if (GA_ID.test(ga)) loadGoogle(ga);
    if (PIXEL_ID.test(pixel)) loadPixel(pixel);
  }, [ga, pixel]);
}
