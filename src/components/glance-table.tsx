import { useState } from "react";
import { ChevronDown } from "lucide-react";

/** How many rows show before "See all": enough to fill the hero panel the same way on every loan page. */
const SHOWN = 5;

type Row = { label: string; value: string };

// Labels that mean the same figure, so "Tenor" is not shown again when the strip above says "Tenure".
const SAME_FIGURE = [
  ["loan size", "loan amount", "limit"],
  ["tenor", "tenure"],
  ["interest rate", "interest", "indicative rate"],
];
const plain = (t: string) => t.toLowerCase().replace(/[*\s]+/g, " ").trim();
const figureOf = (label: string) => SAME_FIGURE.findIndex((g) => g.includes(plain(label)));

/** The strip above already shows these facts; the table keeps only what it does not. */
function withoutRepeats(rows: Row[], facts: Row[]): Row[] {
  return rows.filter(
    (r) =>
      !facts.some(
        (f) =>
          plain(f.label) === plain(r.label) ||
          plain(f.value) === plain(r.value) ||
          (figureOf(r.label) >= 0 && figureOf(r.label) === figureOf(f.label)),
      ),
  );
}

/** The "At a glance" table: the first few rows, with the rest and the note behind "See all". */
export function GlanceTable({
  rows: allRows,
  facts = [],
  note,
}: {
  rows: Row[];
  facts?: Row[];
  note?: string | undefined;
}) {
  const rows = withoutRepeats(allRows, facts);
  const [open, setOpen] = useState(false);
  const shown = open ? rows : rows.slice(0, SHOWN);
  return (
    <div>
      <dl className="overflow-hidden rounded-xl border border-gold/25 text-[13px]">
        {shown.map((g, i) => (
          <div
            key={g.label}
            className={`grid grid-cols-[34%_1fr] gap-3 px-3.5 py-2.5 ${i % 2 === 0 ? "bg-white dark:bg-card" : "bg-gold-pale/60 dark:bg-white/5"}`}
          >
            <dt className="font-bold text-navy dark:text-white">{g.label}</dt>
            <dd className="leading-snug text-foreground">{g.value}</dd>
          </div>
        ))}
      </dl>
      {open && note ? (
        <p className="mt-3 text-[11px] leading-snug text-muted-foreground italic">{note}</p>
      ) : null}
      {rows.length > SHOWN ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-gold-dark transition-colors hover:text-navy dark:hover:text-white"
        >
          {open ? "Show less" : `See all ${rows.length} points`}
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      ) : null}
    </div>
  );
}
