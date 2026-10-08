// Website text that staff edit in the CRM (Settings -> Website content): FAQs, loan product
// pages and case studies. The site fetches it once; wherever the CRM has nothing, or can't be
// reached, the copy built into the site is used, so a page is never empty.

import { useEffect, useState } from "react";
import { CRM_API } from "@/lib/crm";
import type { Faq } from "@/data/faqs";
import type { Product } from "@/data/products";
import type { CaseStudy } from "@/data/case-studies";

type SiteContent = {
  faqs?: Record<string, Faq[]>;
  products?: Record<string, Partial<ProductText>>;
  caseStudies?: CaseStudyText[];
};

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

export function useSiteContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>(cached ?? {});
  useEffect(() => {
    let live = true;
    void load().then((c) => live && setContent(c));
    return () => {
      live = false;
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
