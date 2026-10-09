// Website text that staff edit in the CRM (Settings -> Website content): FAQs, loan product
// pages and case studies. The site fetches it once; wherever the CRM has nothing, or can't be
// reached, the copy built into the site is used, so a page is never empty.

import { useEffect, useState } from "react";
import { CRM_API } from "@/lib/crm";
import type { Faq } from "@/data/faqs";
import type { Product } from "@/data/products";
import type { CaseStudy } from "@/data/case-studies";
import type { ProfessionalService } from "@/data/professional-services";
import type { ImageMap, PageTextMap } from "@/lib/page-text";
import { DEFAULT_RATES, type RatesContent } from "@/data/rates";
import type { SeoMap } from "@/lib/seo";
import type { ClientStory } from "@/data/testimonials";
import { applyContactInfo, type SiteInfoContact } from "@/data/site";
import { applyCibilInfo } from "@/data/cibil";

type SiteContent = {
  faqs?: Record<string, Faq[]>;
  products?: Record<string, Partial<ProductText>>;
  caseStudies?: CaseStudyText[];
  services?: Record<string, Partial<ServiceText>>;
  siteInfo?: SiteInfo;
  pageText?: PageTextMap;
  images?: ImageMap;
  bankRates?: Partial<RatesContent>;
  seo?: SeoMap;
  testimonials?: (ClientStory & { visible?: boolean })[];
  trustNumbers?: Record<string, string>;
  customPages?: CustomPage[];
  /** Repeated blocks on the pages, keyed by list name (see data/page-lists.ts). */
  lists?: Record<string, Record<string, string>[]>;
  /** Hindi and Marathi wording, keyed like pageText by the original English. */
  "pageText:hi"?: PageTextMap;
  "pageText:mr"?: PageTextMap;
};

/** A page or article staff created in the CRM. */
export type CustomPage = {
  slug: string;
  title: string;
  /** "post" shows in Insights with a date; "page" is a stand-alone page. */
  kind: "post" | "page";
  summary?: string;
  body: string;
  date?: string;
  /** Uploaded cover picture, as a CRM path such as /public/site-images/<id>. */
  image?: string;
  published?: boolean;
};

export type SiteInfo = SiteInfoContact & { reportPrice?: number; upiId?: string; upiName?: string };

/** The CA & legal service fields staff may change. */
export type ServiceText = Pick<
  ProfessionalService,
  "title" | "summary" | "whoNeedsIt" | "process" | "documents"
>;

/** The product fields staff may change. Icons, grouping and checklist forms stay in the code. */
export type ProductText = Pick<
  Product,
  "tagline" | "about" | "features" | "eligibility" | "documents" | "facts"
>;

export type CaseStudyText = Omit<CaseStudy, "icon"> & { visible?: boolean };

let cached: SiteContent | null = null;
let inflight: Promise<SiteContent> | null = null;

function load(): Promise<SiteContent> {
  if (cached) return Promise.resolve(cached);
  inflight ??= fetch(`${CRM_API}/public/site-content`)
    .then((r) => (r.ok ? r.json() : {}))
    .then((data: unknown) => {
      cached = data && typeof data === "object" ? (data as SiteContent) : {};
      return cached;
    })
    .catch(() => {
      inflight = null; // try again next time a page asks
      return {} as SiteContent;
    });
  return inflight;
}

const listeners = new Set<(c: SiteContent) => void>();

/** Lets the admin text editor push a saved change to every page that is listening. */
export function updateSiteContent(patch: Partial<SiteContent>) {
  cached = { ...(cached ?? {}), ...patch };
  for (const l of listeners) l(cached);
}

export function useSiteContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>(cached ?? {});
  useEffect(() => {
    let live = true;
    void load().then((c) => live && setContent(c));
    const listener = (c: SiteContent) => live && setContent(c);
    listeners.add(listener);
    return () => {
      live = false;
      listeners.delete(listener);
    };
  }, []);
  return content;
}

const nonEmptyList = <T>(v: unknown): v is T[] => Array.isArray(v) && v.length > 0;

/** FAQs for one page ("contact", "partner", "mumbai"...), or `fallback` if staff haven't set any. */
export function useFaqs(key: string, fallback: Faq[]): Faq[] {
  const list = useSiteContent().faqs?.[key];
  return nonEmptyList<Faq>(list) ? list : fallback;
}

/** A product with the CRM's text laid over the built-in one. */
export function useProduct(product: Product | undefined): Product | undefined {
  const text = useSiteContent().products?.[product?.slug ?? ""];
  if (!product || !text) return product;
  return {
    ...product,
    ...(typeof text.tagline === "string" && text.tagline ? { tagline: text.tagline } : {}),
    ...(typeof text.about === "string" && text.about ? { about: text.about } : {}),
    ...(nonEmptyList<string>(text.features) ? { features: text.features } : {}),
    ...(nonEmptyList<string>(text.eligibility) ? { eligibility: text.eligibility } : {}),
    ...(nonEmptyList<string>(text.documents) ? { documents: text.documents } : {}),
    ...(nonEmptyList<Product["facts"][number]>(text.facts) ? { facts: text.facts } : {}),
  };
}

/** Case studies: the CRM's list when staff have set one (hidden ones dropped), else the built-in list. */
export function useCaseStudies(builtIn: CaseStudy[]): CaseStudy[] {
  const list = useSiteContent().caseStudies;
  if (!nonEmptyList<CaseStudyText>(list)) return builtIn;
  const iconFor = (slug: string, fallbackIcon: CaseStudy["icon"]) =>
    builtIn.find((c) => c.slug === slug)?.icon ?? fallbackIcon;
  const fallbackIcon = builtIn[0]?.icon;
  if (!fallbackIcon) return builtIn;
  return list
    .filter((c) => c.visible !== false && c.slug && c.headline)
    .map((c) => ({ ...c, icon: iconFor(c.slug, fallbackIcon) }));
}

function mergeService(
  service: ProfessionalService,
  text?: Partial<ServiceText>,
): ProfessionalService {
  if (!text) return service;
  return {
    ...service,
    ...(typeof text.title === "string" && text.title ? { title: text.title } : {}),
    ...(typeof text.summary === "string" && text.summary ? { summary: text.summary } : {}),
    ...(typeof text.whoNeedsIt === "string" && text.whoNeedsIt
      ? { whoNeedsIt: text.whoNeedsIt }
      : {}),
    ...(nonEmptyList<string>(text.process) ? { process: text.process } : {}),
    ...(nonEmptyList<string>(text.documents) ? { documents: text.documents } : {}),
  };
}

/** A CA & legal service with the CRM's text laid over the built-in one. */
export function useProfessionalService(
  service: ProfessionalService | undefined,
): ProfessionalService | undefined {
  const text = useSiteContent().services?.[service?.slug ?? ""];
  return service ? mergeService(service, text) : service;
}

/** The whole CA & legal list, each service with the CRM's text laid over it. */
export function useProfessionalServices(list: ProfessionalService[]): ProfessionalService[] {
  const services = useSiteContent().services;
  return services ? list.map((s) => mergeService(s, services[s.slug])) : list;
}

let appliedInfo = false;

/**
 * Applies the contact details and CIBIL price/UPI staff set in the CRM. Returns a number that
 * changes once they are applied, so the root can redraw the page with the new values.
 */
export function useApplySiteInfo(): number {
  const info = useSiteContent().siteInfo;
  const [version, setVersion] = useState(0);
  useEffect(() => {
    if (!info || appliedInfo) return;
    appliedInfo = true;
    applyContactInfo(info);
    applyCibilInfo(info);
    setVersion(1);
  }, [info]);
  return version;
}

/** Interest rates: the CRM's table when staff have set one, else the one built from the loan pages. */
export function useBankRates(): RatesContent {
  const saved = useSiteContent().bankRates;
  if (!saved) return DEFAULT_RATES;
  return {
    asOf: typeof saved.asOf === "string" ? saved.asOf : DEFAULT_RATES.asOf,
    disclaimer:
      typeof saved.disclaimer === "string" && saved.disclaimer
        ? saved.disclaimer
        : DEFAULT_RATES.disclaimer,
    defaultEmiRate:
      typeof saved.defaultEmiRate === "number" && saved.defaultEmiRate > 0
        ? saved.defaultEmiRate
        : DEFAULT_RATES.defaultEmiRate,
    rows: nonEmptyList<RatesContent["rows"][number]>(saved.rows) ? saved.rows : DEFAULT_RATES.rows,
  };
}

/** Client stories: the CRM's list when staff set one (hidden ones dropped), else the built-in ones. */
export function useTestimonials(builtIn: ClientStory[]): ClientStory[] {
  const list = useSiteContent().testimonials;
  if (!nonEmptyList<ClientStory & { visible?: boolean }>(list)) return builtIn;
  const shown = list.filter((t) => t.visible !== false && t.name && t.quote);
  return shown.length > 0 ? shown : builtIn;
}

export function formatPageDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

/** Pages and articles staff published from the CRM, plus whether the CRM has answered yet. */
export function useCustomPages(): { pages: CustomPage[]; loaded: boolean } {
  const list = useSiteContent().customPages;
  const [loaded, setLoaded] = useState(cached !== null);
  useEffect(() => {
    let live = true;
    void load().then(() => live && setLoaded(true));
    return () => {
      live = false;
    };
  }, []);
  const pages = nonEmptyList<CustomPage>(list)
    ? list.filter((p) => p.published !== false && p.slug && p.title)
    : [];
  return { pages, loaded };
}
