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

/**
 * A loan's key facts (interest rate, amount, tenure...) as a clean strip with a hairline above and
 * below, hairline dividers between the columns, small spaced capitals for each label and a large
 * serif gold value. Three facts sit in one row; more fall into rows of two (or `wide` for four
 * across when there is room). Long values are sized down so they stay tidy.
 */
export function FactsStrip({
  facts,
  wide = false,
}: {
  facts: { label: string; value: string }[];
  wide?: boolean;
}) {
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
        return (
          <div
            key={fact.label}
            className={[
              "py-5 pr-4",
              colIndex > 0 ? "border-l border-white/12 pl-5 sm:pl-6" : "pl-0",
              i >= cols ? "border-t border-white/12" : "",
              lastOdd ? "col-span-2" : "",
              cols === 4
                ? "max-sm:[&:nth-child(even)]:border-l max-sm:[&:nth-child(odd)]:border-l-0"
                : "",
            ].join(" ")}
          >
            <dt className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] text-white/50 uppercase">
              <Icon className="h-3.5 w-3.5 shrink-0 text-gold/80" />
              {fact.label}
            </dt>
            <dd
              className={`mt-2 font-heading leading-snug text-gold-light ${
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
