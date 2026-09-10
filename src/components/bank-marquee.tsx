import { useState } from "react";
import { Building2 } from "lucide-react";
import { BANK_PARTNERS } from "@/data/site";

function LogoItem({ name, logo }: { name: string; logo: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="flex h-16 w-48 shrink-0 items-center justify-center gap-2 rounded-xl border bg-white px-4 transition-all duration-400 hover:border-gold/40 hover:shadow-[0_0_16px_oklch(0.75_0.14_75/0.12)]">
      {failed ? (
        <>
          <Building2 className="h-4 w-4 shrink-0 text-gold" />
          <span className="text-xs font-bold text-foreground truncate">{name}</span>
        </>
      ) : (
        <img
          src={logo}
          alt={name}
          className="h-8 max-w-[90px] object-contain"
          onError={() => setFailed(true)}
          loading="lazy"
        />
      )}
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
            <LogoItem key={`${bank.name}-${i}`} name={bank.name} logo={bank.logo} />
          ))}
        </div>
      </div>
      {row2.length > 0 && (
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
          <div className="marquee-track-reverse flex w-max gap-3 py-1 hover:[animation-play-state:paused]">
            {row2.map((bank, i) => (
              <LogoItem key={`${bank.name}-rev-${i}`} name={bank.name} logo={bank.logo} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
