import { PRODUCTS } from "@/data/products";

/**
 * Indicative interest rates, shown on the Rates page and used as the EMI calculator's starting
 * rate. Staff keep these current in the CRM (Settings -> Website content -> Interest rates); this
 * is what shows until they do, built from the "Interest rate" line on each loan page.
 */
export type RateRow = {
  product: string;
  bank: string;
  /** e.g. "8.15%" */
  rateFrom: string;
  /** Optional upper end, e.g. "10.5%". */
  rateTo?: string;
  /** e.g. "Up to 1% + GST" */
  fee?: string;
  note?: string;
};

export type RatesContent = {
  /** When the rates were last checked, shown to visitors. */
  asOf: string;
  disclaimer: string;
  /** Starting rate for the EMI calculator, % p.a. */
  defaultEmiRate: number;
  rows: RateRow[];
};

const FROM = /(\d+(?:\.\d+)?)\s*%/;

export const DEFAULT_RATES: RatesContent = {
  asOf: "",
  disclaimer:
    "Rates are indicative and change with the lender, your profile, the loan amount and market conditions. The final rate is confirmed in the lender's sanction letter.",
  defaultEmiRate: 9.5,
  rows: PRODUCTS.flatMap((p) => {
    const fact = p.facts.find((f) => /interest rate/i.test(f.label));
    const match = fact ? FROM.exec(fact.value) : null;
    return match
      ? [
          {
            product: p.title,
            bank: "Our network of banks & NBFCs",
            rateFrom: `${match[1]}%`,
          },
        ]
      : [];
  }),
};
