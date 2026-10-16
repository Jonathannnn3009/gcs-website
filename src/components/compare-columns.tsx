import { Check, Landmark, ShieldCheck, X } from "lucide-react";
import { HOME_COMPARE_BANKS, HOME_COMPARE_US } from "@/data/page-lists";
import { useList } from "@/lib/page-lists";

// "Banks & Lenders" against Growth Capital Services, side by side. The left card is plain and
// muted, the right one is a dark gradient card with a gold glow so the eye lands on it. The rows of
// the two cards line up, so each point can be read straight across, and a round "VS" badge sits
// between them.
export function CompareColumns() {
  const banks = useList("home.compare.banks", HOME_COMPARE_BANKS);
  const us = useList("home.compare.us", HOME_COMPARE_US);
  const rows = Math.max(banks.length, us.length, 1);
  const grid = { gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` };

  return (
    <div className="relative mx-auto max-w-5xl">
      <div className="grid items-stretch gap-10 md:grid-cols-2 md:gap-8">
        {/* Banks & Lenders */}
        <div className="flex flex-col overflow-hidden rounded-3xl border border-border bg-white shadow-[var(--shadow-card)] dark:bg-card">
          <div className="flex items-center gap-3 border-b border-border bg-bg-light/70 px-6 py-5 dark:bg-background/40">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-white text-navy/60 shadow-sm ring-1 ring-border dark:bg-card">
              <Landmark className="h-5 w-5" />
            </span>
            <p className="text-base font-extrabold text-navy dark:text-white" style={{ letterSpacing: "0" }}>
              Banks &amp; Lenders
            </p>
          </div>
          <ul className="grid flex-1 px-6 py-2" style={grid}>
            {banks.map((b, i) => (
              <li
                key={i}
                className="flex items-center gap-3.5 border-b border-border/70 py-4 text-[15px] text-navy/80 last:border-b-0 dark:text-white/75"
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-red-50 text-red-500 ring-1 ring-red-100 dark:bg-red-500/10 dark:ring-red-500/20">
                  <X className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span>{String(b["text"])}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* VS badge, centred on the gap (between the cards on a phone) */}
        <span
          className="pointer-events-none absolute top-1/2 left-1/2 z-20 hidden h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-navy shadow-[0_8px_24px_oklch(0.13_0.04_265/0.25)] ring-4 ring-gold/60 md:grid"
          style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 800 }}
          aria-hidden="true"
        >
          VS
        </span>
        <span
          className="pointer-events-none absolute top-1/2 left-1/2 z-20 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-sm text-navy shadow-[0_8px_24px_oklch(0.13_0.04_265/0.25)] ring-4 ring-gold/60 md:hidden"
          style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontWeight: 800 }}
          aria-hidden="true"
        >
          VS
        </span>

        {/* Growth Capital Services */}
        <div className="navy-panel relative flex flex-col overflow-hidden rounded-3xl border border-gold/40 shadow-[0_24px_60px_-20px_oklch(0.13_0.04_265/0.6)]">
          <div className="pointer-events-none absolute -top-16 -right-10 h-56 w-56 rounded-full bg-gold/20 blur-[80px]" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-[#2f5fd0]/25 blur-[80px]" />
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
          <div className="relative flex items-center gap-3 border-b border-white/10 px-6 py-5">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-gold to-gold-light text-navy shadow-[0_6px_16px_rgba(228,176,40,0.35)]">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <p className="text-base font-extrabold tracking-wide text-gold uppercase" style={{ letterSpacing: "0.04em" }}>
              Growth Capital Services
            </p>
          </div>
          <ul className="relative grid flex-1 px-6 py-2" style={grid}>
            {us.map((u, i) => (
              <li
                key={i}
                className="flex items-center gap-3.5 border-b border-white/10 py-4 text-[15px] font-semibold text-white last:border-b-0"
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold text-navy shadow-[0_0_14px_rgba(228,176,40,0.45)]">
                  <Check className="h-3.5 w-3.5" strokeWidth={3.5} />
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
