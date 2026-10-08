// Organisation details staff keep in the CRM (Settings → Organisation) that the site shows.
// Currently the extra phone numbers; empty until the CRM answers, so the page always renders.

import { useEffect, useState } from "react";
import { CRM_API } from "@/lib/crm";

export type PhoneLine = { display: string; href: string };

const toLine = (raw: string): PhoneLine | null => {
  const digits = raw.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
  if (!/^[6-9]\d{9}$/.test(digits)) return null;
  return { display: `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`, href: `tel:+91${digits}` };
};

let cached: PhoneLine[] | null = null;

/** Extra phone numbers from the CRM, beyond the primary one built into the site. */
export function useMorePhones(): PhoneLine[] {
  const [phones, setPhones] = useState<PhoneLine[]>(cached ?? []);
  useEffect(() => {
    if (cached) return;
    const ctrl = new AbortController();
    fetch(`${CRM_API}/public/settings`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: Record<string, unknown> | null) => {
        const list = data?.["org.morePhones"];
        if (!Array.isArray(list)) return;
        cached = list
          .map((v) => (typeof v === "string" ? toLine(v) : null))
          .filter((l): l is PhoneLine => l !== null);
        setPhones(cached);
      })
      .catch(() => undefined);
    return () => ctrl.abort();
  }, []);
  return phones;
}
