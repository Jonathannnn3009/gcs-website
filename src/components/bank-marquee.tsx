import { BANK_PARTNERS, type BankPartner } from "@/data/site";

// Plain logo, no card border — the clean look, just in motion.
function LogoItem({ bank }: { bank: BankPartner }) {
  return (
    <img
      src={bank.logo}
      alt={bank.name}
      title={bank.name}
      className="h-9 w-auto shrink-0 object-contain sm:h-11"
    />
  );
}

export function BankMarquee() {
  const partners = BANK_PARTNERS.filter((b) => b.logo);
  const mid = Math.ceil(partners.length / 2);
  const row1 = [...partners.slice(0, mid), ...partners.slice(0, mid)];
  const row2 = [...partners.slice(mid), ...partners.slice(mid)];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="marquee-track flex w-max items-center gap-14 py-1 hover:[animation-play-state:paused]">
          {row1.map((bank, i) => (
            <LogoItem key={`${bank.name}-${i}`} bank={bank} />
          ))}
        </div>
      </div>
      {row2.length > 0 && (
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
          <div className="marquee-track-reverse flex w-max items-center gap-14 py-1 hover:[animation-play-state:paused]">
            {row2.map((bank, i) => (
              <LogoItem key={`${bank.name}-rev-${i}`} bank={bank} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
