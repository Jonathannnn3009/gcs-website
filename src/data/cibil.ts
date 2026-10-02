// Config for the /cibil credit-report request flow. Everything a person at GCS
// would need to tweak without touching the page code lives here.

export type BureauId = "cibil" | "experian" | "equifax" | "crif";

export type Bureau = {
  id: BureauId;
  name: string;
  blurb: string;
  /**
   * What we charge when the customer has already used this bureau's free
   * report in the last 12 months, so a fresh pull is a paid one.
   * TODO: placeholder — confirm the real price for each bureau.
   */
  paidPrice: number;
};

export const BUREAUS: Bureau[] = [
  {
    id: "cibil",
    name: "TransUnion CIBIL",
    blurb: "The score most banks and NBFCs check first.",
    paidPrice: 500,
  },
  {
    id: "experian",
    name: "Experian",
    blurb: "Widely used by lenders and card issuers.",
    paidPrice: 500,
  },
  {
    id: "equifax",
    name: "Equifax",
    blurb: "Used by banks and housing-finance lenders.",
    paidPrice: 500,
  },
  {
    id: "crif",
    name: "CRIF High Mark",
    blurb: "Strong coverage of retail and microfinance borrowers.",
    paidPrice: 500,
  },
];

export type LastPulled = "never" | "within-12-months" | "over-12-months";

export const LAST_PULLED_OPTIONS: { id: LastPulled; label: string; hint: string }[] = [
  { id: "never", label: "Never", hint: "I haven't taken a free report from them" },
  { id: "over-12-months", label: "More than 12 months ago", hint: "My free report has renewed" },
  {
    id: "within-12-months",
    label: "Within the last 12 months",
    hint: "I've already used this year's free report",
  },
];

/** Service fee when the customer's free yearly report is still available — we pull it for them. */
export const FREE_REPORT_SERVICE_FEE = 100;

/**
 * UPI details the payment QR is generated from.
 * TODO: replace with the real GCS UPI ID before this goes live.
 */
export const UPI = {
  id: "growthcapitalservices@upi",
  payeeName: "Growth Capital Services",
};

/** Flip to false once the real UPI ID above is in. Only controls the dev-mode warning. */
export const UPI_IS_PLACEHOLDER = true;

export type Quote = {
  amount: number;
  /** "free-eligible": their yearly free report is available, we charge only our service fee. */
  kind: "free-eligible" | "paid";
};

export function quoteFor(bureau: Bureau, lastPulled: LastPulled): Quote {
  if (lastPulled === "within-12-months") return { amount: bureau.paidPrice, kind: "paid" };
  return { amount: FREE_REPORT_SERVICE_FEE, kind: "free-eligible" };
}

export function upiLink(amount: number, note: string): string {
  const params = new URLSearchParams({
    pa: UPI.id,
    pn: UPI.payeeName,
    am: String(amount),
    cu: "INR",
    tn: note,
  });
  return `upi://pay?${params.toString()}`;
}
