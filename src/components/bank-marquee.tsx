import { BANK_PARTNERS, type BankPartner } from "@/data/site";
import { BankMark } from "@/components/bank-mark";

function LogoItem({ bank }: { bank: BankPartner }) {
  return (
    <div className="flex h-16 w-56 shrink-0 items-center gap-3 rounded-xl border bg-white px-4 transition-all duration-400 hover:border-gold/40 hover:shadow-[0_0_16px_oklch(0.75_0.14_75/0.12)]">
      <BankMark bank={bank} className="h-9 w-9" />
      <span className="truncate text-sm font-bold text-foreground">{bank.name}</span>
    </div>
  );
}

export function BankMarquee() {
  const row1 = [...BANK_PARTNERS.slice(0, 23), ...BANK_PARTNERS.slice(0, 23)];
  const row2 = [...BANK_PARTNERS.slice(23), ...BANK_PARTNERS.slice(23)];

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="marquee-track flex w-max gap-3 py-1 hover:[animation-play-state:paused]">
          {row1.map((bank, i) => (
            <LogoItem key={`${bank.name}-${i}`} bank={bank} />
          ))}
        </div>
      </div>
      {row2.length > 0 && (
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
          <div className="marquee-track-reverse flex w-max gap-3 py-1 hover:[animation-play-state:paused]">
            {row2.map((bank, i) => (
              <LogoItem key={`${bank.name}-rev-${i}`} bank={bank} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
