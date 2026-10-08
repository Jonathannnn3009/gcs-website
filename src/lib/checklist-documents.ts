// The checklist PDFs staff manage in the CRM (Settings → Website checklists). The site asks the
// CRM which file to serve for a product/variant, so editing the list there changes the download.
// If the CRM can't be reached, or has no entry, the built-in /checklists/... path is used.

import { useEffect, useState } from "react";
import { CRM_API } from "@/lib/crm";

type ChecklistDoc = { productSlug: string | null; variant: string | null; fileUrl: string };

let cached: ChecklistDoc[] | null = null;

export function useChecklistDocuments(): ChecklistDoc[] {
  const [docs, setDocs] = useState<ChecklistDoc[]>(cached ?? []);
  useEffect(() => {
    if (cached) return;
    const ctrl = new AbortController();
    fetch(`${CRM_API}/public/checklist-documents`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: unknown) => {
        if (!Array.isArray(data)) return;
        cached = data as ChecklistDoc[];
        setDocs(cached);
      })
      .catch(() => undefined);
    return () => ctrl.abort();
  }, []);
  return docs;
}

/** The PDF to serve: the CRM's entry for this product (and variant) if it has one, else `fallback`. */
export function resolveChecklistHref(
  docs: ChecklistDoc[],
  fallback: string,
  variant?: string,
): string {
  const slug =
    fallback
      .split("/")
      .pop()
      ?.replace(/-checklist\.pdf$/, "") ?? "";
  const match =
    docs.find((d) => d.productSlug === slug && !d.variant) ??
    (variant
      ? docs.find(
          (d) => d.variant === variant && d.productSlug && slug.startsWith(`${d.productSlug}-`),
        )
      : undefined) ??
    docs.find((d) => d.fileUrl === fallback);
  return match?.fileUrl ?? fallback;
}
