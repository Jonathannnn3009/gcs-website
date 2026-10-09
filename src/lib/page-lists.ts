// Repeated blocks on the public pages (hero points, steps, benefits, stats...). The CRM's list,
// when staff have saved one, replaces the built-in items; otherwise the built-in items are used.

import { useEffect, useRef, useState } from "react";
import { ICONS } from "@/lib/icon-map";
import { PRODUCT_GROUPS } from "@/data/products";
import type { LocationContent } from "@/data/locations";
import { STAMP_DUTY_RATES } from "@/lib/finance";
import {
  CALC_ASSUMPTIONS,
  CIBIL_BUREAUS,
  CIBIL_LAST_PULLED,
  CITY_PAGES,
  FORM_CITIES,
  LIST_SPECS,
  SERVICES_GROUPS,
  type ListItem,
} from "@/data/page-lists";
import { useSiteContent } from "@/lib/site-content";

export function useList<T extends ListItem>(key: string, builtIn: T[]): T[] {
  const saved = useSiteContent().lists?.[key];
  const spec = LIST_SPECS.find((s) => s.key === key);
  if (!spec || !Array.isArray(saved) || saved.length === 0) return builtIn;

  // A new item with no icon picked borrows the first icon the built-in list uses.
  const fallbackIcon =
    Object.values(builtIn[0] ?? {}).find((v) => typeof v === "function") ?? ICONS["Sparkles"];

  const items = saved
    .filter((raw) => raw && typeof raw === "object")
    .map((raw) => {
      const item: ListItem = {};
      for (const f of spec.fields) {
        const value = raw[f.key];
        if (f.kind === "icon") {
          item[f.key] = (ICONS[String(value)] ?? fallbackIcon) as ListItem[string];
        } else {
          item[f.key] = typeof value === "string" ? value : "";
        }
      }
      return item;
    })
    // an item needs its main text; a half-filled new row is skipped
    .filter((item) => {
      const main = spec.fields.find((f) => f.kind !== "icon");
      return main ? String(item[main.key] ?? "").trim() !== "" : true;
    });
  return items.length > 0 ? (items as T[]) : builtIn;
}

/** The built-in items with the CRM's wording laid over them, matched by `idKey`; for lists whose items cannot be added or removed. */
export function useFixedList<T extends Record<string, string>>(
  key: string,
  builtIn: T[],
  idKey: string,
): T[] {
  const saved = useSiteContent().lists?.[key];
  if (!Array.isArray(saved) || saved.length === 0) return builtIn;
  const byId = new Map(builtIn.map((b) => [b[idKey], b]));
  const ordered: T[] = [];
  const used = new Set<string>();
  for (const raw of saved) {
    const base = raw && byId.get(String(raw[idKey]));
    if (!base || used.has(base[idKey] as string)) continue;
    used.add(base[idKey] as string);
    const merged: Record<string, string> = { ...base };
    for (const [k, v] of Object.entries(raw)) {
      if (k !== idKey && typeof v === "string" && (v.trim() !== "" || k in base)) merged[k] = v;
    }
    ordered.push(merged as T);
  }
  for (const b of builtIn) if (!used.has(b[idKey] as string)) ordered.push(b);
  return ordered;
}

/** Loan groups (heading and description) with the CRM's wording. */
export function useProductGroups() {
  const groups = useFixedList("services.groups", SERVICES_GROUPS, "name");
  return PRODUCT_GROUPS.map((g) => {
    const o = groups.find((x) => x.name === g.name);
    return { ...g, heading: o?.heading || g.heading, description: o?.description || g.description };
  }).sort(
    (a, b) =>
      groups.findIndex((x) => x.name === a.name) - groups.findIndex((x) => x.name === b.name),
  );
}

/** Cities we serve (enquiry form, footer, city pages). */
export function useCities(): string[] {
  const list = useList("form.cities", FORM_CITIES);
  return list.map((c) => String(c["city"]));
}

/** A city page's intro, service note and office flag with the CRM's wording. */
export function useCityPage(location: LocationContent): LocationContent {
  const pages = useFixedList("cities.pages", CITY_PAGES, "slug");
  const o = pages.find((p) => p.slug === location.slug);
  if (!o) return location;
  return {
    ...location,
    intro: o.intro || location.intro,
    serviceNote: o.serviceNote || location.serviceNote,
    hasOffice: o.hasOffice ? o.hasOffice.trim().toLowerCase() !== "no" : location.hasOffice,
  };
}

export function useBureaus() {
  return useFixedList("cibil.bureaus", CIBIL_BUREAUS, "id");
}

export function useLastPulled() {
  return useFixedList("cibil.lastPulled", CIBIL_LAST_PULLED, "id");
}

/** A calculator assumption (FOIR, working-capital shares...) as a number. */
export function useCalc(key: string, fallback: number): number {
  const rows = useFixedList("calc.assumptions", CALC_ASSUMPTIONS, "label");
  const n = Number(rows.find((r) => r.key === key)?.value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
}

/** Like useState, starting at the CRM's number and following it until the visitor moves the slider. */
export function useCalcState(key: string, fallback: number): [number, (v: number) => void] {
  const base = useCalc(key, fallback);
  const [value, setValue] = useState(base);
  const touched = useRef(false);
  useEffect(() => {
    if (!touched.current) setValue(base);
  }, [base]);
  return [
    value,
    (v: number) => {
      touched.current = true;
      setValue(v);
    },
  ];
}

/** Stamp-duty table: the CRM's rows when staff have set them, else the built-in states. */
export function useStampDutyRates(): typeof STAMP_DUTY_RATES {
  const saved = useSiteContent().lists?.["calc.stampDuty"];
  if (!Array.isArray(saved) || saved.length === 0) return STAMP_DUTY_RATES;
  const out: typeof STAMP_DUTY_RATES = {};
  for (const row of saved) {
    const state = String(row["state"] ?? "").trim();
    const stampDuty = Number(row["stampDuty"]);
    const registration = Number(row["registration"]);
    if (!state || !Number.isFinite(stampDuty) || !Number.isFinite(registration)) continue;
    const female = String(row["stampDutyFemale"] ?? "").trim();
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
