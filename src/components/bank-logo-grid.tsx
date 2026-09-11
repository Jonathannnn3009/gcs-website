import { BANK_PARTNERS, type BankPartner } from "@/data/site";
import { BankMark } from "@/components/bank-mark";

function BankTile({ bank }: { bank: BankPartner }) {
  return (
    <div className="flex h-16 items-center gap-3 rounded-xl border border-border bg-white px-3 transition-all duration-400 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_0_20px_oklch(0.75_0.14_75/0.12)]">
      <BankMark bank={bank} className="h-9 w-9" />
      <span className="text-sm leading-tight font-bold text-foreground">{bank.name}</span>
    </div>
  );
}

export function BankLogoGrid() {
  return (
    <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {BANK_PARTNERS.map((bank) => (
        <BankTile key={bank.name} bank={bank} />
      ))}
    </div>
  );
}
