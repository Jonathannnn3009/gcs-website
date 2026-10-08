// The partner page's commission table. Staff edit the rate card in the CRM; the site reads it
// from the CRM's public endpoint and falls back to the table baked into the page if the CRM
// can't be reached, so the page never shows an empty table.

import { useEffect, useState } from "react";
import { CRM_API } from "@/lib/crm";

export type CommissionRow = {
  product: string;
  range: string;
  avgAmount: string;
  earning: string;
};

type RateCard = {
  label: string;
  minRate: string | number;
  maxRate: string | number;
  avgAmountLabel: string;
  earningLabel: string;
};

const pct = (v: string | number) => `${Number(v)}%`;

function toRows(cards: unknown): CommissionRow[] | null {
  if (!Array.isArray(cards) || cards.length === 0) return null;
  const rows: CommissionRow[] = [];
  for (const c of cards as RateCard[]) {
    if (!c || typeof c.label !== "string") return null;
    rows.push({
      product: c.label,
      range: `${pct(c.minRate)} – ${pct(c.maxRate)}`,
      avgAmount: c.avgAmountLabel,
      earning: c.earningLabel,
    });
  }
  return rows;
}

export function useCommissionStructure(fallback: CommissionRow[]): CommissionRow[] {
  const [rows, setRows] = useState(fallback);
  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`${CRM_API}/public/commission-structure`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const next = toRows(data);
        if (next) setRows(next);
      })
      .catch(() => undefined);
    return () => ctrl.abort();
  }, []);
  return rows;
}
