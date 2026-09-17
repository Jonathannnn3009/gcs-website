import { BANK_PARTNERS, type BankPartner } from "@/data/site";

// A calm, static row of our most recognizable partners — plain logos, no
// card borders, no scroll animation. The full partner list still exists in
// site.ts for other uses; this is a deliberately short, curated set.
const FEATURED_BANK_NAMES = [
  "HDFC Bank",
  "ICICI Bank",
  "SBI",
  "Axis Bank",
  "Kotak Mahindra",
  "Standard Chartered",
  "HSBC",
  "Bajaj Finserv",
  "Tata Capital",
  "Aditya Birla Capital",
];

export function BankMarquee() {
  const featured = FEATURED_BANK_NAMES.map((name) =>
    BANK_PARTNERS.find((b) => b.name === name),
  ).filter((b): b is BankPartner & { logo: string } => Boolean(b?.logo));

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-14 gap-y-10">
      {featured.map((bank) => (
        <img
          key={bank.name}
          src={bank.logo}
          alt={bank.name}
          title={bank.name}
          className="h-8 w-auto object-contain sm:h-10"
        />
      ))}
    </div>
  );
}
