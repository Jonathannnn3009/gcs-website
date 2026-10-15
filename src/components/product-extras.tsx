import { ChevronDown, Globe, Receipt } from "lucide-react";
import { TopicHeader } from "@/components/topic-header";
import type { ChargesInfo, NriInfo } from "@/data/products";

// Two optional sections on a loan page: what a lender may charge besides interest, and a fuller
// guide for NRI applicants. Both stay entirely in the page so they can be read and searched.

/** Fees and other charges: a short note, then a two-column table. */
export function ChargesBlock({ charges }: { charges: ChargesInfo }) {
  return (
    <>
      <div className="border-t border-dashed border-border" />
      <div className="p-7 sm:p-9">
        <TopicHeader icon={Receipt} title="Fees and other charges" />
        <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">{charges.intro}</p>
        <div className="mt-5 overflow-hidden rounded-xl border border-border">
          {charges.rows.map((row, i) => (
            <div
              key={row.label}
              className={`grid gap-1 px-5 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6 ${
                i % 2 === 1 ? "bg-gold-pale/25 dark:bg-gold/5" : ""
              } ${i > 0 ? "border-t border-border" : ""}`}
            >
              <p className="text-sm font-bold text-navy dark:text-white">{row.label}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{row.value}</p>
            </div>
          ))}
        </div>
        {charges.note ? (
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground italic">
            {charges.note}
          </p>
        ) : null}
      </div>
    </>
  );
}

/** A guide for applicants who live abroad: how it works, then the questions they ask most. */
export function NriBlock({ nri }: { nri: NriInfo }) {
  return (
    <>
      <div className="border-t border-dashed border-border" />
      <div className="p-7 sm:p-9">
        <TopicHeader icon={Globe} title={nri.heading} />
        <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">{nri.intro}</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {nri.points.map((p) => (
            <div key={p.title} className="rounded-xl border border-border p-4">
              <p className="text-sm font-bold text-navy dark:text-white">{p.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-[10px] font-bold tracking-[0.18em] text-gold-dark uppercase">
          NRI questions answered
        </p>
        <div className="mt-3 divide-y divide-border overflow-hidden rounded-xl border border-border">
          {nri.faqs.map((f, i) => (
            <details key={f.q} className="group" {...(i === 0 ? { open: true } : {})}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                <span className="text-sm font-bold text-navy dark:text-white">{f.q}</span>
                <ChevronDown className="h-4 w-4 shrink-0 text-gold transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted-foreground italic">{nri.note}</p>
      </div>
    </>
  );
}
