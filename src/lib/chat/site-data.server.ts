// Server only. The facts the assistant answers from: the website's built-in data with whatever
// staff have saved in the CRM laid over it (interest rates, contact details, loan wording, loans
// switched off, FAQs, calculator assumptions). If the CRM can't be reached the built-in data is
// used, so the assistant always has something correct to say.

import { CRM_API } from "@/lib/crm";
import { PRODUCTS, type Product } from "@/data/products";
import { CONTACT } from "@/data/site";
import { DEFAULT_RATES, type RatesContent } from "@/data/rates";
import { CONTACT_FAQS, PARTNER_FAQS, type Faq } from "@/data/faqs";
import { REPORT_PRICE } from "@/data/cibil";
import { CALC_ASSUMPTIONS } from "@/data/page-lists";
import { STAMP_DUTY_RATES } from "@/lib/finance";
import { serverEnv } from "./env.server";

type ProductText = Partial<
  Pick<Product, "tagline" | "about" | "features" | "eligibility" | "documents" | "facts">
>;

/** The parts of the CRM's public site-content that the assistant reads. */
type CrmContent = {
  faqs?: Record<string, Faq[]>;
  products?: Record<string, ProductText>;
  siteInfo?: {
    phone?: string;
    email?: string;
    address?: string;
    hours?: string;
    reportPrice?: number;
  };
  bankRates?: Partial<RatesContent>;
  lists?: Record<string, Record<string, string>[]>;
};

export type SiteSnapshot = {
  contact: { phone: string; email: string; address: string; hours: string; cities: string[] };
  rates: RatesContent;
  /** Only the loans that are switched on, with the CRM's wording applied. */
  products: Product[];
  faqs: { contact: Faq[]; partner: Faq[] };
  reportPrice: number;
  /** Share of income that can go to EMIs, % (the Eligibility calculator's FOIR). */
  foirPct: number;
  eligibilityRatePct: number;
  stampDutyRates: typeof STAMP_DUTY_RATES;
  /** True when the CRM answered, false when only the built-in data was used. */
  fromCrm: boolean;
};

const nonEmpty = <T>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0;
const text = (v: unknown): string => (typeof v === "string" ? v.trim() : "");

// The CRM's answer is cached for a minute per CRM address, so a burst of questions makes one request.
const TTL_MS = 60_000;
const FAIL_TTL_MS = 20_000;
const MAX_CACHED = 8;
const cache = new Map<string, { at: number; data: CrmContent | null }>();

/**
 * Where the server reaches the CRM. CRM_INTERNAL_URL (a server setting, e.g.
 * https://crm.example.com/crm/api) wins when set: a worker often cannot call its own public
 * domain. Otherwise the website's usual CRM path is used, which on the live site is on the same domain.
 */
export function crmBase(origin: string): string {
  const configured = serverEnv("CRM_INTERNAL_URL");
  const base = configured || CRM_API;
  return (/^https?:\/\//i.test(base) ? base : new URL(base, origin).toString()).replace(/\/$/, "");
}

async function fetchCrm(origin: string): Promise<CrmContent | null> {
  const base = crmBase(origin);
  const hit = cache.get(base);
  if (hit && Date.now() - hit.at < (hit.data ? TTL_MS : FAIL_TTL_MS)) return hit.data;

  let data: CrmContent | null = null;
  try {
    const res = await fetch(`${base}/public/site-content`, {
      signal: AbortSignal.timeout(2500),
      headers: { accept: "application/json" },
    });
    if (res.ok) {
      const json: unknown = await res.json();
      if (json && typeof json === "object") data = json as CrmContent;
    }
  } catch {
    data = null;
  }

  if (cache.size >= MAX_CACHED) cache.delete(cache.keys().next().value as string);
  cache.set(base, { at: Date.now(), data });
  return data;
}

function mergeProduct(p: Product, t: ProductText | undefined): Product {
  if (!t) return p;
  return {
    ...p,
    ...(text(t.tagline) ? { tagline: text(t.tagline) } : {}),
    ...(text(t.about) ? { about: text(t.about) } : {}),
    ...(nonEmpty<string>(t.features) ? { features: t.features } : {}),
    ...(nonEmpty<string>(t.eligibility) ? { eligibility: t.eligibility } : {}),
    ...(nonEmpty<string>(t.documents) ? { documents: t.documents } : {}),
    ...(nonEmpty<Product["facts"][number]>(t.facts) ? { facts: t.facts } : {}),
  };
}

function calcNumber(crm: CrmContent | null, key: string, fallback: number): number {
  const label = CALC_ASSUMPTIONS.find((a) => a.key === key)?.label;
  const raw = crm?.lists?.["calc.assumptions"]?.find((r) => r["label"] === label)?.["value"];
  const n = text(raw) === "" ? NaN : Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

function stampDutyRates(crm: CrmContent | null): typeof STAMP_DUTY_RATES {
  const saved = crm?.lists?.["calc.stampDuty"];
  if (!Array.isArray(saved) || saved.length === 0) return STAMP_DUTY_RATES;
  const out: typeof STAMP_DUTY_RATES = {};
  for (const row of saved) {
    const state = text(row["state"]);
    const stampDuty = Number(row["stampDuty"]);
    const registration = Number(row["registration"]);
    if (!state || !Number.isFinite(stampDuty) || !Number.isFinite(registration)) continue;
    const female = text(row["stampDutyFemale"]);
    out[state] = {
      stampDuty,
      registration,
      ...(female !== "" && Number.isFinite(Number(female))
        ? { stampDutyFemale: Number(female) }
        : {}),
    };
  }
  return Object.keys(out).length > 0 ? out : STAMP_DUTY_RATES;
}

export async function getSiteSnapshot(origin: string): Promise<SiteSnapshot> {
  const crm = await fetchCrm(origin);
  const info = crm?.siteInfo;

  const hidden = new Set(
    (crm?.lists?.["products.visibility"] ?? [])
      .filter((row) => row["visible"] === "no")
      .map((row) => row["slug"] ?? "")
      .filter(Boolean),
  );
  const products = PRODUCTS.filter((p) => !hidden.has(p.slug)).map((p) =>
    mergeProduct(p, crm?.products?.[p.slug]),
  );

  const savedRates = crm?.bankRates;
  const rates: RatesContent = savedRates
    ? {
        asOf: typeof savedRates.asOf === "string" ? savedRates.asOf : DEFAULT_RATES.asOf,
        disclaimer: text(savedRates.disclaimer) || DEFAULT_RATES.disclaimer,
        defaultEmiRate:
          typeof savedRates.defaultEmiRate === "number" && savedRates.defaultEmiRate > 0
            ? savedRates.defaultEmiRate
            : DEFAULT_RATES.defaultEmiRate,
        rows: nonEmpty<RatesContent["rows"][number]>(savedRates.rows)
          ? savedRates.rows
          : DEFAULT_RATES.rows,
      }
    : DEFAULT_RATES;

  return {
    contact: {
      phone: text(info?.phone) || CONTACT.phone,
      email: text(info?.email) || CONTACT.email,
      address: text(info?.address) || CONTACT.address,
      hours: text(info?.hours) || CONTACT.hours,
      cities: CONTACT.cities,
    },
    rates,
    products,
    faqs: {
      contact: nonEmpty<Faq>(crm?.faqs?.["contact"]) ? crm.faqs["contact"] : CONTACT_FAQS,
      partner: nonEmpty<Faq>(crm?.faqs?.["partner"]) ? crm.faqs["partner"] : PARTNER_FAQS,
    },
    reportPrice:
      typeof info?.reportPrice === "number" && info.reportPrice > 0
        ? info.reportPrice
        : REPORT_PRICE,
    foirPct: calcNumber(crm, "foir", 50),
    eligibilityRatePct: calcNumber(crm, "eligRate", 9),
    stampDutyRates: stampDutyRates(crm),
    fromCrm: crm !== null,
  };
}
