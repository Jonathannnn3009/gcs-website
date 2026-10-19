import { ArrowRight, Briefcase, Clock, FileText, Handshake, Percent, type LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section";

const COLUMNS = ["Public Sector Banks", "Private Banks", "NBFCs & Housing Finance Cos."] as const;

const ROWS: { icon: LucideIcon; label: string; values: [string, string, string] }[] = [
  {
    icon: Percent,
    label: "How the interest rate is set",
    values: ["Often follows a published benchmark", "Can respond more to the market", "Often based on your profile"],
  },
  {
    icon: FileText,
    label: "Documents and checks",
    values: ["Usually step by step, with set checks", "Often led by the relationship", "Often more flexible on proofs"],
  },
  {
    icon: Briefcase,
    label: "Support for self-employed applicants",
    values: ["Usually more selective", "Moderate", "Often stronger"],
  },
  {
    icon: Clock,
    label: "Time to process",
    values: ["Can take longer", "Often quicker", "Can be quick"],
  },
  {
    icon: Handshake,
    label: "Room to negotiate",
    values: ["Usually limited", "Sometimes possible", "Case by case"],
  },
];

// One colour per column (per kind of lender), carried from the heading down through every cell.
const COL_TINTS = [
  { head: "bg-[#2a63c4]", cell: "bg-[#d6e5fb] border-[#a9c8f3]", dot: "bg-[#2a63c4]" },
  { head: "bg-[#b07a0a]", cell: "bg-[#fbe6a8] border-[#f0c868]", dot: "bg-[#b07a0a]" },
  { head: "bg-[#14815f]", cell: "bg-[#c8ecdd] border-[#97d6bf]", dot: "bg-[#14815f]" },
] as const;

/**
 * A plain-language table of how the main kinds of lender usually differ. It is a general guide,
 * not a rule: every lender, and every case, is different, which is why we compare for you.
 */
export function LenderComparison() {
  return (
    <>
      <Reveal>
        <SectionHeading
          eyebrow="Know Your Options"
          title="Which kind of lender may suit you?"
          description="Banks and NBFCs do not all work the same way. Here is a simple, general guide to how the main types usually differ."
          align="center"
        />
      </Reveal>

      {/* wide screens: the table */}
      <Reveal delay={80} className="mt-10 hidden md:block">
        <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1.15fr)_repeat(3,minmax(0,1fr))] gap-x-3 gap-y-3">
          <div />
          {COLUMNS.map((c, i) => (
            <div
              key={c}
              className={`rounded-2xl px-4 py-4 text-center text-sm font-bold text-white shadow-sm ${COL_TINTS[i]!.head}`}
            >
              {c}
            </div>
          ))}

          {ROWS.map((row) => (
            <div key={row.label} className="contents">
              <div className="flex items-center gap-3 py-5 pr-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy text-gold-light">
                  <row.icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-bold text-navy dark:text-white">{row.label}</span>
              </div>
              {row.values.map((v, ci) => (
                <div
                  key={ci}
                  className={`flex items-center justify-center rounded-xl border ${COL_TINTS[ci]!.cell} px-4 py-5 text-center text-sm font-semibold text-navy shadow-sm dark:bg-card dark:text-white`}
                >
                  {v}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Reveal>

      {/* phones: one small card per factor */}
      <div className="mx-auto mt-8 max-w-xl space-y-4 md:hidden">
        {ROWS.map((row) => (
          <Reveal key={row.label}>
            <div className="rounded-2xl border border-border bg-white p-4 shadow-sm dark:bg-card">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-navy text-gold-light">
                  <row.icon className="h-4 w-4" />
                </span>
                <p className="text-sm font-bold text-navy dark:text-white">{row.label}</p>
              </div>
              <dl className="mt-3 space-y-2 text-sm">
                {COLUMNS.map((c, i) => (
                  <div
                    key={c}
                    className={`flex items-baseline justify-between gap-4 rounded-lg border px-3 py-2 ${COL_TINTS[i]!.cell} dark:bg-card`}
                  >
                    <dt className="flex items-center gap-2 text-xs font-bold text-navy dark:text-white">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${COL_TINTS[i]!.dot}`} />
                      {c}
                    </dt>
                    <dd className="text-right font-semibold text-navy dark:text-white">{row.values[i]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120} className="mx-auto mt-8 max-w-3xl text-center">
        <p className="text-xs leading-relaxed text-muted-foreground">
          This is a general guide only. Interest rate, loan amount, tenure, charges, eligibility, approval and
          disbursement depend on each Bank or NBFC&apos;s policy, your profile and its credit assessment.
        </p>
        <Link to="/contact" className="gold-btn mt-5 py-3 text-sm">
          Compare Loan Options <ArrowRight className="h-4 w-4" />
        </Link>
      </Reveal>
    </>
  );
}
