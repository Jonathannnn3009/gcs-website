import { useEffect, useState } from "react";
import {
  Banknote,
  CalendarClock,
  FileText,
  Layers,
  ListOrdered,
  Percent,
  Sparkles,
  Wallet,
  type LucideIcon,
} from "lucide-react";

/** A small gold icon that suits the fact's label. */
function iconFor(label: string): LucideIcon {
  const l = label.toLowerCase();
  if (/(division|category)/.test(l)) return Layers;
  if (/(steps|process|works)/.test(l)) return ListOrdered;
  if (/(document|paper)/.test(l)) return FileText;
  if (/(rate|interest|roi)/.test(l)) return Percent;
  if (/(tenure|tenor|term|period|duration|years|time)/.test(l)) return CalendarClock;
  if (/(amount|ticket|limit|loan|funding|finance|value|ltv|cover)/.test(l)) return Banknote;
  if (/(fee|charge|cost|margin)/.test(l)) return Wallet;
  return Sparkles;
}

/** How long the glow rests on each fact before it moves on to the next. */
const SLOT_MS = 1800;

/**
 * A loan's key facts (interest rate, amount, tenure...) as a clean strip with a hairline above and
 * below, hairline dividers between the columns, small spaced capitals for each label and a large
 * serif gold value. A soft gold glow travels through the facts one by one, in order, and loops;
 * it is switched off for visitors who prefer reduced motion. Three facts sit in one row, more
 * fall into rows of two (or `wide` for four across); long values are sized down to stay tidy.
 */
export function FactsStrip({
  facts,
  wide = false,
}: {
  facts: { label: string; value: string }[];
  wide?: boolean;
}) {
  const [active, setActive] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (facts.length < 2) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    setAnimate(true);
    const timer = window.setInterval(() => setActive((i) => (i + 1) % facts.length), SLOT_MS);
    return () => window.clearInterval(timer);
  }, [facts.length]);

  if (facts.length === 0) return null;
  const cols = wide ? Math.min(facts.length, 4) : facts.length === 3 ? 3 : 2;
  const grid =
    cols === 4 ? "grid-cols-2 sm:grid-cols-4" : cols === 3 ? "grid-cols-3" : "grid-cols-2";
  return (
    <dl className={`relative mt-8 grid border-y border-white/12 ${grid}`}>
      {facts.map((fact, i) => {
        const Icon = iconFor(fact.label);
        const colIndex = i % cols;
        const lastOdd = cols === 2 && facts.length % 2 === 1 && i === facts.length - 1;
        const on = animate && active === i;
        return (
          <div
            key={fact.label}
            className={[
              "relative overflow-hidden py-5 pr-4",
              colIndex > 0 ? "border-l border-white/12 pl-5 sm:pl-6" : "pl-0",
              i >= cols ? "border-t border-white/12" : "",
              lastOdd ? "col-span-2" : "",
              cols === 4
                ? "max-sm:[&:nth-child(even)]:border-l max-sm:[&:nth-child(odd)]:border-l-0"
                : "",
            ].join(" ")}
          >
            {/* the glow: a soft gold wash behind the fact it is resting on */}
            <span
              aria-hidden
              className={`pointer-events-none absolute inset-0 bg-[radial-gradient(90%_130%_at_20%_0%,rgba(228,176,40,0.22),transparent_72%)] transition-opacity duration-700 ${
                on ? "opacity-100" : "opacity-0"
              }`}
            />
            {/* and a thin gold line that sweeps along the bottom while it rests there */}
            {on ? (
              <span
                aria-hidden
                key={`sweep-${active}`}
                className="fact-sweep pointer-events-none absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-gold/0 via-gold to-gold-light"
              />
            ) : null}
            <dt
              className={`relative flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase transition-colors duration-700 ${
                on ? "text-gold-light" : "text-white/50"
              }`}
            >
              <Icon className="h-3.5 w-3.5 shrink-0 text-gold/80" />
              {fact.label}
            </dt>
            <dd
              className={`relative mt-2 font-heading leading-snug text-gold-light transition-[text-shadow] duration-700 ${
                on
                  ? "[text-shadow:0_0_22px_rgba(228,176,40,0.7)]"
                  : "[text-shadow:0_0_0_rgba(228,176,40,0)]"
              } ${
                fact.value.length > 40
                  ? "text-[0.95rem]"
                  : fact.value.length > 24
                    ? "text-[1.05rem]"
                    : "text-[1.2rem] sm:text-[1.4rem]"
              }`}
            >
              {fact.value}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
