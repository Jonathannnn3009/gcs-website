// Config for the /cibil credit-report request flow. Everything a person at GCS
// would need to tweak without touching the page code lives here.

export type BureauId = "cibil" | "experian" | "equifax" | "crif";

export type Bureau = {
  id: BureauId;
  name: string;
  blurb: string;
};

export const BUREAUS: Bureau[] = [
  {
    id: "cibil",
    name: "TransUnion CIBIL",
    blurb: "The score most banks and NBFCs check first.",
  },
  {
    id: "experian",
    name: "Experian",
    blurb: "Widely used by lenders and card issuers.",
  },
  {
    id: "equifax",
    name: "Equifax",
    blurb: "Used by banks and housing-finance lenders.",
  },
  {
    id: "crif",
    name: "CRIF High Mark",
    blurb: "Strong coverage of retail and microfinance borrowers.",
  },
];

export type LastPulled = "never" | "within-12-months" | "over-12-months";

/** Asked for our own records — it does not change the price. */
export const LAST_PULLED_OPTIONS: { id: LastPulled; label: string; hint: string }[] = [
  { id: "never", label: "Never", hint: "I haven't taken a report from them" },
  { id: "over-12-months", label: "More than 12 months ago", hint: "It's been over a year" },
  { id: "within-12-months", label: "Within the last 12 months", hint: "I took one recently" },
];

/** One flat price for a report from any bureau, in rupees. */
export const REPORT_PRICE = 500;

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
