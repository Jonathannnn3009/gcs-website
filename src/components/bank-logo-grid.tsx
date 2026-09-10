import { useState } from "react";
import { Building2 } from "lucide-react";
import { BANK_PARTNERS, type BankPartner } from "@/data/site";

function BankLogo({ bank }: { bank: BankPartner }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="group flex h-20 items-center justify-center rounded-xl border border-border bg-white p-3 transition-all duration-400 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_0_20px_oklch(0.75_0.14_75/0.12)]">
      {failed ? (
        <div className="flex flex-col items-center gap-1">
          <Building2 className="h-5 w-5 text-gold" />
          <span className="text-[10px] font-bold text-muted-foreground text-center leading-tight">{bank.name}</span>
        </div>
      ) : (
        <img
          src={bank.logo}
          alt={bank.name}
          className="h-10 max-w-[100px] object-contain grayscale transition-all duration-400 group-hover:grayscale-0"
          onError={() => setFailed(true)}
          loading="lazy"
        />
      )}
    </div>
  );
}

export function BankLogoGrid() {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
      {BANK_PARTNERS.map((bank) => (
        <BankLogo key={bank.name} bank={bank} />
      ))}
    </div>
  );
}
