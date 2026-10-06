// The pop-up poster: what to ask the CRM for, and when to show it.
import { CRM_API } from "./crm";

export const PROMO = {
  /** Seconds of the visitor actually looking at the site before it first appears. */
  firstAfterMs: 20_000,
  /** It closes itself after this long. */
  autoCloseMs: 8_000,
  /** Never nag: at most this many times per ad per browser session… */
  maxPerSession: 3,
  /** …and never twice within this long. */
  minGapMs: 30_000,
};

export type PromoAd = { id: string; title: string; imageUrl: string; linkUrl: string | null };

/** The poster running today, or null (none scheduled, CRM unreachable, anything odd). */
export async function fetchPromoAd(signal?: AbortSignal): Promise<PromoAd | null> {
  try {
    const res = await fetch(`${CRM_API}/public/website-ad`, {
      signal: signal ?? null,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const { ad } = (await res.json()) as {
      ad: { id: string; title: string; imagePath: string; linkUrl: string | null } | null;
    };
    if (!ad || typeof ad.imagePath !== "string" || !ad.imagePath.startsWith("/public/website-ad/"))
      return null;
    // Only ever follow a secure link; anything else is dropped rather than trusted.
    const linkUrl = ad.linkUrl && /^https:\/\//i.test(ad.linkUrl) ? ad.linkUrl : null;
    return { id: ad.id, title: ad.title, imageUrl: `${CRM_API}${ad.imagePath}`, linkUrl };
  } catch {
    return null;
  }
}

export type ShowRecord = { count: number; lastAt: number };

/** May the poster appear now, given what this session has already seen? */
export function canShow(record: ShowRecord | null, now: number, limits = PROMO): boolean {
  if (!record) return true;
  return record.count < limits.maxPerSession && now - record.lastAt >= limits.minGapMs;
}

const key = (adId: string) => `gcs-promo:${adId}`;

export function readRecord(adId: string): ShowRecord | null {
  try {
    const raw = sessionStorage.getItem(key(adId));
    if (!raw) return null;
    const v = JSON.parse(raw) as ShowRecord;
    return Number.isFinite(v.count) && Number.isFinite(v.lastAt) ? v : null;
  } catch {
    return null;
  }
}

export function writeRecord(adId: string, record: ShowRecord) {
  try {
    sessionStorage.setItem(key(adId), JSON.stringify(record));
  } catch {
    /* private mode: the poster just may repeat a little more */
  }
}
