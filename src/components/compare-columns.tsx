import { AlertCircle, Check, ShieldCheck } from "lucide-react";
import { HOME_COMPARE_BANKS, HOME_COMPARE_US } from "@/data/page-lists";
import { useList } from "@/lib/page-lists";

// "Banks & Lenders" against Growth Capital Services, side by side. The left card is plain and
// muted, the right one is dark and lifted so the eye lands on it.
export function CompareColumns() {
  const banks = useList("home.compare.banks", HOME_COMPARE_BANKS);
  const us = useList("home.compare.us", HOME_COMPARE_US);

  return (
    <div className="mx-auto grid max-w-5xl items-center gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-4">
      {/* Banks & Lenders */}
      <div className="relative pt-6">
        <span className="absolute top-0 left-1/2 z-10 -translate-x-1/2 rounded-xl border border-border bg-white px-4 py-2 text-xs font-bold text-navy shadow-sm sm:text-sm">
          Banks &amp; Lenders
        </span>
        <ul className="space-y-4 rounded-2xl border border-border bg-white px-5 pt-9 pb-6 shadow-[var(--shadow-card)] sm:px-6">
          {banks.map((b, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-navy/85">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <span>{String(b["text"])}</span>
            </li>
          ))}
        </ul>
      </div>

      <span
        className="mx-auto font-heading text-2xl font-extrabold text-navy/70 italic"
        aria-hidden="true"
      >
        VS
      </span>

      {/* Growth Capital Services */}
      <div className="relative pt-6 md:-my-4">
        <span className="absolute top-0 left-1/2 z-10 grid h-14 w-14 -translate-x-1/2 place-items-center rounded-2xl bg-gold text-navy shadow-lg ring-4 ring-white">
          <ShieldCheck className="h-7 w-7" />
        </span>
        <div className="rounded-2xl border border-gold/40 bg-navy px-5 pt-12 pb-7 shadow-[var(--shadow-lift)] sm:px-7">
          <p className="mb-5 text-center text-sm font-extrabold tracking-wide text-gold uppercase">
            Growth Capital Services
          </p>
          <ul className="space-y-4">
            {us.map((u, i) => (
              <li key={i} className="flex items-start gap-3 text-sm font-semibold text-white">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold/20 text-gold">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                <span>{String(u["text"])}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
