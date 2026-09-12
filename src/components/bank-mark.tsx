import { useState } from "react";
import { cn } from "@/lib/utils";
import type { BankPartner } from "@/data/site";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

/** Square logo badge for a bank; falls back to a monogram if no logo loads. */
export function BankMark({ bank, className }: { bank: BankPartner; className?: string }) {
  const [failed, setFailed] = useState(false);

  if (!bank.logo || failed) {
    return (
      <span
        aria-hidden
        className={cn(
          "grid shrink-0 place-items-center rounded-lg bg-gradient-to-br from-navy to-navy-soft text-[11px] font-extrabold text-gold",
          className,
        )}
      >
        {initials(bank.name)}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-white p-1",
        className,
      )}
    >
      <img
        src={bank.logo}
        alt=""
        className="h-full w-full object-contain"
        onError={() => setFailed(true)}
        loading="lazy"
      />
    </span>
  );
}
