import { useState } from "react";
import { ChevronDown } from "lucide-react";

/** How many rows show before "See all": enough to fill the hero panel the same way on every loan page. */
const SHOWN = 5;

/** The "At a glance" table: the first few rows, with the rest and the note behind "See all". */
export function GlanceTable({
  rows,
  note,
}: {
  rows: { label: string; value: string }[];
  note?: string | undefined;
}) {
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
